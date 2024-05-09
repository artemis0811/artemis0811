<template>
    <div class="create-image-editor">
        <b-row class="mb-1">
            <b-col md="6">
                <h3 id="canvasName" v-b-modal.new-image-builder>{{ canvasName }} <feather-icon icon="EditIcon" class="mr-50" /></h3>
            </b-col>
            <b-col md="6 text-right">
                <!-- <b-button variant="success" v-b-modal.new-image-builder>
                    <feather-icon icon="UploadCloudIcon" class="mr-50" />
                    <router-link class="text-white" :to="{ name : 'create-image-builder', params : { token : projectToken } }">
                        New Template
                    </router-link>
                </b-button> -->
                <save-template save-type="create" :name="canvasName"></save-template>
                <b-button variant="secondary" v-b-modal.guide>
                    <feather-icon icon="FileTextIcon" class="mr-50" />
                    <span class="align-middle">Guide</span>
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="7">
                <b-row class="mb-1">
                    <b-col>
                        <b-modal v-model="modal" id="new-image-builder" centered title="Enter template Name">
                            <label>Name</label>
                            <b-form-input v-model="canvasName" id="inputCanvasName"></b-form-input>
                        </b-modal>
                        <!-- --------------------------------- Import Button(+) ----------------------------------- -->
                        <b-dropdown v-if="show" trigger="click" placement="bottom-start" text="Insert" size="sm" variant="primary" class="ie-insert">
                            <import-file></import-file> 
                            <tools></tools>
                        </b-dropdown>
                        <!-- --------------------------------- End Import Button(+) ----------------------------------- -->
                    </b-col>
                    <b-col md="7">
                        <footer class="bottomBar" v-if="show">
                            <zoom :name="canvasName" :project-token="projectToken" :imageOwner="imageOwner"></zoom>
                        </footer>
                    </b-col>
                </b-row>
                <hr>
                <b-row>
                    <b-col md="12">
                        <div id="workspace">
                            <div>
                                <div class="inside-shadow"></div>
                                <div v-if="ruler" class="coordinates-bar coordinates-bar-top" style="width: 100%"></div>
                                <div v-if="ruler" class="coordinates-bar coordinates-bar-left" style="height: 100%"></div>
                                <!-- --------------------------------- Main Content ----------------------------------- -->
                                <canvas id="canvas"></canvas>
                            </div>
                        </div>
                    </b-col>    
                </b-row>
            </b-col>
            <b-col md="5">
                <div v-if="show" style="background-color : #fff;" class="set-group">
                    <set-size></set-size>
                    <attribute :imageOwner="imageOwner"></attribute>
                    <!-- <group></group> -->
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>

// import element
import importFile from '@editor/components/importFile';
import saveTemplate from '@editor/components/saveTemplate';
// top assembly
import save from '@editor/components/save';
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
import { http } from "@/services/requests";

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
            "project_token" : this.projectToken,
        }
    },
    data() {
        return {
            projectToken : null, 
            canvasName: 'New template',
            modal: false,
            show: false,
            select: null,
            ruler: true,
            param_id: this.$route.params.id,
            imageOwner : null, 
            isLoading : true,
        };
    },
    components: {
        setSize,
        tools,
        attribute,
        importFile,
        save,
        zoom,
        loader,
        group, 
        saveTemplate
    },
    mounted() {
        document.body.classList.add('body-overflow');
        this.havingToken();
        this.remainingImageBuilder();
    },
    created() {
        this.$store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', true)
    },
    destroyed() {
        this.$store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', this.isVerticalMenuCollapsed)
    },
    methods: {
        async remainingImageBuilder() {
            await http.get('remaining-image-templates/' + this.projectToken)
            .then((response) => {
                if(!response.data.success) {
                    this.$router.push({ name : 'image-builder', project_token : this.projectToken });
                    return;
                }
                this.intiateTemplate();
                this.isEditorOwner();
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', 3000);
            });
        },
        async isEditorOwner() {
            await http.get('editor/check-ownership/' + this.projectToken)
            .then((response) => {
                if(response.data.success) {
                    this.imageOwner = response.data.role;
                }
            })
            .catch((error) => {
                alert(error)
            });
        },
        intiateTemplate() {
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

            
        },
        handleResize() {
            if(canvas.editor.editorWorkspace) {
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
}
</style>
