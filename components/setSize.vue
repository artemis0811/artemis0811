<template>
    <div v-if="mSelectMode == 'multiple' || !mSelectMode == 'one' || mSelectMode == ''" class="p-1">
        <b-tabs content-class="mt-3" @input="changeTab">
            <b-tab title="Setup" active>
                <template #title>
                    <feather-icon icon="SettingsIcon"/>
                    <strong>Setup</strong>
                </template>
                <b-row class="mb-1">
                    <b-col>Image Size</b-col>
                    <b-col>
                        <b-form-select v-model="selected" :options="canvasSizes" @change="changeSelect" size="sm"></b-form-select>
                    </b-col>
                </b-row>
                <b-row class="mb-1">
                    <b-col>Width</b-col>
                    <b-col>
                        <b-form-input autocomplete="off" type="number" v-model="width" size="sm"></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="mb-1">
                    <b-col>Height</b-col>
                    <b-col>
                        <b-form-input autocomplete="off" type="number" v-model="height" size="sm"></b-form-input>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>Background color</b-col>
                    <colorBar></colorBar>
                </b-row>
            </b-tab>
            <b-tab title="Layer">
                <template #title>
                    <feather-icon icon="LayersIcon"/>
                    <strong>Layer</strong>
                </template>
                <layer></layer>
            </b-tab>
            <b-tab title="Background">
                <template #title>
                    <feather-icon icon="ImageIcon"/>
                    <strong>Background</strong>
                </template>
                <background></background>
            </b-tab>
            <!-- <b-tab title="Lighton">
                <template #title>
                    <feather-icon icon="ImageIcon"/>
                    <strong>Lihgt On</strong>
                </template>
                <light-on></light-on>
            </b-tab> -->
            <b-tab title="Preview" name="name3" id="preview">
                <template #title>
                    <feather-icon icon="EyeIcon"/>
                    <strong>Preview</strong>
                </template>
                <preview ref="form"/>
            </b-tab>
        </b-tabs>
    </div>
</template>
<script>

import select from '@editor/mixins/select';
import EditorWorkspace from '@editor/core/EditorWorkspace';
import layer from "./layer.vue";
import background from "./background.vue";
import lightOn from "./lightOn.vue";
import colorBar from "./colorBar.vue";
import preview from "./preview.vue";
import { http } from '@/services/requests';

export default {
    name: 'canvasSize',
    mixins: [select],
    inject: ['canvas', 'fabric'],
    props: ['templateSize'],
    data() {
        return {
            selected: "900x900",
            width: 900,
            height: 900,
            canvasSizes: []
        };
    },

    components: {
        lightOn,
        layer,
        colorBar,
        preview,
        background
    },
    computed: {
        currentValue() {
            return this.canvasSizes.find(option => option.value === this.selected)
        }
    },
    mounted() {
       
        // Get all the canvas sizes from the databaes
        this.getCanvasSizes()

        // set the canvas sizes
        this.canvas.editor.editorWorkspace = new EditorWorkspace(this.canvas.c, {
            width   : this.width,
            height  : this.height,
        });

    },
    methods: {
        async getCanvasSizes() {
            await http.get('editor/canvas-sizes/' +  this.$route.params.token)
            .then((response) => {
                if(response.data.success) {
                    if(Array.isArray(response.data.canvas_sizes) && response.data.canvas_sizes.length) {
                        this.canvasSizes.push({
                            value   : 'custom-size',
                            text    : 'Custom Size',
                            width   : '',
                            height :  '',
                        });
                        response.data.canvas_sizes.forEach((size) => {
                            this.canvasSizes.push({
                                value   : size.width + 'x' + size.height,
                                text    : size.name, 
                                width   : size.width,
                                height  : size.height
                            });
                        });

                         // Add all the canvas size
                        if (this.templateSize) {
                            let savedCanvasSize = this.templateSize.split('x');
                            if (savedCanvasSize.length === 2) {

                                this.width  = parseInt(savedCanvasSize[0], 10); // Convert to number
                                this.height = parseInt(savedCanvasSize[1], 10); // Convert to number

                                // Check if the size exists in the canvasSizes array
                                let sizeExists = this.canvasSizes.some(size => size.width === this.width && size.height === this.height);
                                if (sizeExists) {
                                    this.selected = this.width + 'x' + this.height;
                                } else {
                                    this.selected = 'custom-size';
                                }
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error);
            });
        },
        changeTab(name) {
            //when preview tab is pressed,load data from endpoint. 
            if (name == 3) {
                this.$refs.form.showPreview();
            }
        },
        setSize() {
            this.canvas.c.discardActiveObject();
            this.canvas.editor.editorWorkspace.setSize(Number(this.width), Number(this.height));
        },
        changeSelect(evt) {
            var resolution = evt.split("x");
            if (evt == 'custom-size') {
                this.selected = '';
            } else {
                this.width = Number(resolution[0]);
                this.height = Number(resolution[1]);
                this.setSize();
            }
            this.selected = evt
        },
    },
    watch: {
        width(newVal) {
               this.canvas.editor.editorWorkspace.setSize(Number(this.width), Number(this.height));
            this.canvas.c.discardActiveObject();
            this.canvas.c.renderAll();
        },
        height(newVal) {
            this.canvas.editor.editorWorkspace.setSize(Number(this.width), Number(this.height));
            this.canvas.c.discardActiveObject();
            this.canvas.c.renderAll();

        },
    }
};
</script>

