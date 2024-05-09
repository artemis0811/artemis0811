<template>
    <div class="create-image-editor">
        <b-row class="mb-1">
            <b-col md="6">
                <h3 id="canvasName" v-if="templateName" v-b-modal.new-image-builder>{{ templateName }} 
                    <feather-icon icon="EditIcon" class="mr-50" />
                </h3>
            </b-col>
            <b-col md="6 text-right">
                <save-template save-type="update" :name="templateName" :isTemplateLoaded="isTemplateLoaded" @updateTemplate="updateTemplate"></save-template>
                <b-button variant="secondary" v-b-modal.guide>
                    <feather-icon icon="FileTextIcon" class="mr-50" />
                    <span class="align-middle">Guide</span>
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="6" md="7">
                <b-row class="mb-1">
                    <b-col>
                        <b-modal v-model="modal" id="new-image-builder" centered title="Change Name">
                            <label>Name</label>
                            <b-form-input v-model="templateName" name="canvas-name" id="inputCanvasName"></b-form-input>
                        </b-modal>
                        <!-- --------------------------------- Import Button(+) ----------------------------------- -->
                        <b-dropdown v-if="show" trigger="click" placement="bottom-start" text="Insert" size="sm"
                            variant="primary">
                            <import-file @templateInfo="templateInfo"></import-file>
                            <tools></tools>
                        </b-dropdown>
                        <!-- --------------------------------- End Import Button(+) ----------------------------------- -->
                    </b-col>
                    <b-col md="7">
                        <footer class="bottomBar" v-if="show">
                            <zoom :project-token="projectToken" :name="templateName" :isTemplateOwner="isTemplateOwner">
                            </zoom>
                        </footer>
                    </b-col>
                </b-row>
                <hr>
                <b-row>
                    <b-col md="12" id="workspace">
                        <b-overlay :show="!isTemplateLoaded" rounded="sm">
                            <div>
                                <div class="inside-shadow"></div>
                                <div v-if="ruler" class="coordinates-bar coordinates-bar-top" style="width: 100%"></div>
                                <div v-if="ruler" class="coordinates-bar coordinates-bar-left" style="height: 100%"></div>
                                <!-- --------------------------------- Main Content ----------------------------------- -->
                                <canvas id="canvas"></canvas>
                            </div>
                            <template #overlay>
                                <div class="text-center">
                                    <b-spinner variant="primary" label="Spinning" size="sm"></b-spinner> Plese wait...
                                </div>
                            </template>
                        </b-overlay>
                    </b-col>

                </b-row>
            </b-col>
            <b-col sm="6" md="5">
                <div v-if="show" style="background-color : #fff;" class="set-group">
                    <set-size v-if="isTemplateLoaded" :templateSize="templateSize"></set-size>
                    <attribute v-if="isTemplateLoaded"></attribute>
                    <!-- <group v-if="isTemplateLoaded"></group> -->
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>

import { http } from "@/services/requests";
// import element
import importFile from '@editor/components/importFile';
// top assembly
import save from '@editor/components/save';
import saveTemplate from '@editor/components/saveTemplate';
import zoom from '@editor/components/zoom';
// left component
import tools from '@editor/components/tools';
import setSize from '@editor/components/setSize';
import group from '@editor/components/group';
// right side component
import attribute from '@editor/components/attribute';
// functional components
import EventHandle from '@editor/utils/eventHandler';
import loader from "@editor/components/loader"

// import "@editor/assets/css/main.css"
import { fabric } from 'fabric';
import Editor from '@editor/core';
import $ from "jquery";

const event = new EventHandle();
event.setMaxListeners(0)
const canvas = {};

export default {
    name: 'Editor',
    provide() {
        return {
            "canvas": canvas,
            "fabric": fabric,
            "event": event,
            "path": this.$route.path,
            "param_id": this.$route.params.id,
            "project_token": this.projectToken,
        }
    },
    data() {
        return {
            isLoading: true,
            isVerticalMenuCollapsed: this.$store.state.verticalMenu.isVerticalMenuCollapsed,
            projectToken: null,
            canvasName: 'New template',
            modal: false,
            show: false,
            select: null,
            ruler: true,
            param_id: this.$route.params.id,
            isTemplateOwner: false,
            templateSize: null,
            isTemplateLoaded: false,
            templateName: null,
        };
    },
    components: {
        setSize,
        tools,
        attribute,
        importFile,
        save,
        saveTemplate,
        zoom,
        loader,
        group,
    },
    destroyed() {
        this.$store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', this.isVerticalMenuCollapsed)
    },
    created() {
        this.$store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', true)
    },
    mounted() {

        this.havingToken();
        document.body.classList.add('body-overflow');

        this.canvas = new fabric.Canvas('canvas', {
            fireRightClick: true,
            stopContextMenu: true,
            controlsAboveOverlay: true,
            perPixelTargetFind: true,
            targetFindTolerance: 4,
            preserveObjectStacking: true
        });

        canvas.c = this.canvas;
        event.init(canvas.c);
        canvas.editor = new Editor(canvas.c);
        this.show = true;
        this.$Spin.hide();
        canvas.c.renderAll();

        setTimeout(() => {

            if (canvas.c.name == undefined || canvas.c.name == '') {
                this.canvasName = "New template"
            } else {
                this.canvasName = canvas.c.name;
            }

            //when delete keyboard press, select element is deleted
            $(document).keydown(e => {
                if (e.originalEvent.code == "Delete") {
                    const activeObject = this.canvas.getActiveObjects();
                    if (activeObject) {
                        activeObject.map((item) => {
                            if (item.id == "trimImage" || item.id == "nonBgImage") {
                                return false;
                            } else {
                                this.canvas.remove(item)
                            }
                        });
                    }
                    this.canvas.requestRenderAll();
                    this.canvas.discardActiveObject();
                }
            });
            const windowObj = window;
            windowObj.addEventListener('resize', this.handleResize);
            // call the handler once to get the initial width and height values
            // this.handleResize(this);
        }, 3000);
    },
    methods: {
        updateTemplate(isLoaded) {
            this.isTemplateLoaded = isLoaded;
        },
        templateInfo(templateInfo) {
            if (templateInfo) {
                this.isTemplateLoaded = templateInfo.isLoaded;
                this.templateSize = templateInfo.templateSize;
                this.templateSize = templateInfo.templateSize;
                this.isTemplateOwner = templateInfo.isTemplateOwner;
                this.templateName = templateInfo.templateName;
            }
        },
        saveJson() {

            var name = '';
            if (document.getElementById("canvasName") != null) {
                //name = document.getElementById("inputCanvasName").value;
                name = this.name;
            }

            const dataUrl = this.canvas.editor.getJson();
            dataUrl.id = this.param_id;
            dataUrl.name = name;
            dataUrl.image_url = this.canvas.editor.getImageUrl();

            http.put('editor/update', { data: dataUrl, project_token: this.projectToken, id: this.$route.params.id })
                .then((response) => {
                    if (response.data.success) {
                        this.showToast('success', 3000, 'Success', response.data.message ? response.data.message : 'Successfully updated the template.')
                    } else {
                        this.showToast('danger', 3000, 'Alert', 'Something is wrong to update the template.')
                    }
                })
                .catch();
        },
        handleResize() {
            if (canvas.editor.editorWorkspace) {
                canvas.editor.editorWorkspace.setSize(900, 900);
            }
        },
        testclick() {
            console.log('test work')
        }
    }

};
</script>
<style scoped>
#canvas {
    overflow-y: scroll;
    width: 100% !important;
}

canvas.upper-canvas {
    width: 100% !important;
}

.set-group {
    overflow-y: auto;
    height: calc(100vh - 170px);
}

#workspace {
    height: 70vh;
}</style>
