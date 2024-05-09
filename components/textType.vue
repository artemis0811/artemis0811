<template>
    <div class="setBox">
        <div v-show="textType.includes(mSelectOneTypeProps[0])">
            <!-- control part -->
            <b-row class="mb-1">
                <b-col md="2">Size</b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="width">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.width"
                            @change="(value) => changeGroup('width', value)"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="height">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.height"
                            @change="(value) => changeGroup('height', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>

            <!-- --------------------- Position ----------------------->
            <b-row class="mb-1">
                <b-col md="2">Position</b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="horizontal(X)">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.left"
                            @change="(value) => changeGroup('left', value)"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="vertical(Y)">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.top"
                            @change="(value) => changeGroup('top', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <!-- --------------------- End Position ----------------------->
            <!-- -------------------  Text Rotate  ---------------- -->
            <b-row class="mb-1">
                <b-col>Rotate</b-col>
                <b-col>
                    <b-input-group size="sm" append="px">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.angle"
                            @change="(value) => changeGroup('angle', value)" :max="360"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <!-- -------------------  End Text Rotate  ---------------- -->

            <!-- control part -->
            <b-row class="mb-1">
                <b-col md="1">Text</b-col>


                <!-- <b-col md="12">
                    <b-input-group>
                        <b-form-input size="sm" v-model="fontAttr.text" @keyup="textKeyPress"></b-form-input>
                        <template #append>
                            <b-dropdown variant="secondary" size="sm" class="no-caret-icon">
                                <template #button-content>
                                    <feather-icon icon="ZapIcon"/>
                                </template>
                                <b-dropdown-item v-for="tag in tags" :key="tag" @click="onChangeSelect(tag)">{{ tag }}</b-dropdown-item>
                            </b-dropdown>
                        </template>
                    </b-input-group>
                </b-col> -->
                

                <!-- <b-col>
                    <div class="input-and-select">
                        <b-form-input id="textInput" size="sm" v-model="fontAttr.text" @keyup="(value) => textKeyPress(value)"></b-form-input>
                        <div class="select-overlay">
                            <feather-icon icon="ZapIcon"/>
                            <select @change="onChangeSelect" id="selectField" class="form-control ib-tag-select" v-model="fontAttr.selectedTag">
                                <option :value="tag" v-for="tag in tags" :key="tag">{{ tag }}</option>
                            </select>
                        </div>
                    </div>
                </b-col> -->

                <b-col md="11">
                    <div class="input-and-select">
                        <b-form-input id="textInput" size="sm" v-model="fontAttr.text" @keyup="(value) => textKeyPress(value)"></b-form-input>
                        <div class="select-overlay">
                            <feather-icon icon="ZapIcon"/>
                            <v-select placeholder="Insert field" class="image-select" v-model="fontAttr.selectedTag" label="text" :reduce="text => text.value" :options="tags" :clearable="false" @input="onChangeSelect"/>
                        </div>
                    </div>
                </b-col>

                
            </b-row>
            <!-- -------------------  Text Setting  ---------------- -->
            <!-- -------------------  text handling  ---------------- -->
            <b-row class="mb-1">
                <b-col>
                    <select class="form-control image-editor-select" v-model="fontAttr.selected_fontfamily"
                        @change="(value) => changeCommonText('fontFamily', value)" size="sm">
                        <option v-for="(item, index) in fontAttr.fontLists" :value="item.name" :key="item.index">{{
                            item.name }}</option>
                    </select>
                </b-col>
                <b-col class="text-right">
                    <b-button variant="secondary" @click="uploadFontClick" size="sm">
                        Add custom font
                        &nbsp;<feather-icon icon="UploadCloudIcon" />
                        <input type="file" id="uploadFont" @change="uploadFont" style="display:none" accept=".woff,.ttf,.otf" />
                    </b-button>
                </b-col>
            </b-row>
            <!-- -------------------  End text handling  ---------------- -->

            <!-- -------------------  font setting  ---------------- -->
            <b-row class="mb-1">
                <!-- -------------------  font size & color  ---------------- -->
                <b-col md="3">
                    <b-input-group size="sm" prepend="A" v-b-tooltip.hover title="Font Size">
                        <b-form-input v-model="fontAttr.fontSize" type="number"
                            @change="(value) => changeCommonText('fontSize', value)"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col md="2">
                    <b-form-input type="color" @change="(value) => changeCommonText('fill', value)" v-model="fontAttr.fill"
                        size="sm"></b-form-input>
                </b-col>
                <!-- -------------------  font size & color  ---------------- -->

                <!-- -------------------  font style  ---------------- -->
                <b-col class="text-right">
                    <b-button variant="outline-secondary" @click="changeFontWeight('fontWeight', fontAttr.fontWeight)"
                        size="sm">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path
                                d="M793.99865 476a244 244 0 0 0 54-130.42C862.75865 192.98 743.01865 64 593.85865 64H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h63.74v576H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h418.64c141.6 0 268.28-103.5 282-244.8 9.48-96.9-32.78-184.12-101.66-239.2zM418.33865 224h175.52a96 96 0 0 1 0 192h-175.52z m175.52 576h-175.52V576h175.52a112 112 0 0 1 0 224z"
                                :fill="fontAttr.fontWeight === 'bold' ? '#305ef4' : '#666'"></path>
                        </svg>
                    </b-button>
                    <b-button variant="outline-secondary" @click="changeFontStyle('fontStyle', fontAttr.fontStyle)"
                        size="sm">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path
                                d="M832 96v64a32 32 0 0 1-32 32h-125.52l-160 640H608a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h125.52l160-640H416a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z"
                                :fill="fontAttr.fontStyle === 'italic' ? '#305ef4' : '#666'"></path>
                        </svg>
                    </b-button>
                    <b-button variant="outline-secondary" @click="changeLineThrough('linethrough', fontAttr.linethrough)"
                        size="sm">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path
                                d="M893.088 501.792H125.344a32 32 0 0 0 0 64h767.744a32 32 0 0 0 0-64zM448 448h112V208h288V96H160v112h288zM448 640h112v288H448z"
                                :fill="fontAttr.linethrough ? '#305ef4' : '#666'"></path>
                        </svg>
                    </b-button>
                    <b-button variant="outline-secondary" @click="changeUnderline('underline', fontAttr.underline)"
                        size="sm">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path
                                d="M703.232 67.008h127.488v413.248c0 158.016-142.656 286.016-318.72 286.016-176 0-318.72-128-318.72-286.016V67.008h127.488v413.248c0 39.872 18.176 78.144 51.136 107.776 36.8 32.96 86.528 51.072 140.096 51.072s103.36-18.112 140.032-51.136c33.024-29.632 51.2-67.968 51.2-107.776V67.008zM193.28 871.616h637.44v85.376H193.28v-85.376z"
                                :fill="fontAttr.underline ? '#305ef4' : '#666'"></path>
                        </svg>
                    </b-button>
                </b-col>
                <!-- -------------------  font style  ---------------- -->
            </b-row>

            <!-- -------------------  Long text handling  ---------------- -->
            <b-row class="mb-1">
                <b-col>Long text handling</b-col>
                <b-col>
                    <select class="form-control image-editor-select" v-model="fontAttr.selected_text_manage_type"
                        @change="changeHandleLongText" v-b-tooltip.hover title="Controls the length of the input string"
                        size="sm">
                        <option value="automatic" selected>Automatic font size</option>
                        <option value="shorten">Shorten text</option>
                        <option value="break">Line break</option>
                    </select>
                </b-col>
            </b-row>

            <!-- -------------------  Text alignment  ---------------- -->
            <b-row class="mb-1">
                <b-col>
                    <p>Align Horizontal/Vertical</p>
                    <align :strokeWidth="Number(fontAttr.strokeWidth)"></align>
                </b-col>
            </b-row>
            <!-- -------------------  End Text Setting  ---------------- -->

            <!-- -------------------  Round Corners  ---------------- -->
            <hr />
            <b-row class="mb-1">
                <b-col>Round Corners</b-col>
                <b-col>
                    <b-input-group append="px" size="sm">
                        <b-form-input autocomplete="off" type="number" v-model="fontAttr.round" :max="80"
                            @change="(value) => changeCommonRect('round', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <!-- -------------------  End Round Corners  ---------------- -->

            <!-- -------------------  Fill  ---------------- -->
            <b-row class="mb-1">
                <b-col md="6">Fill</b-col>
                <b-col md="6" class="text-right">
                    
                    <b-form-checkbox v-model="textFillState" @change="changeTextFillState" class="custom-control-success mr-0"
                        name="fill" switch inline></b-form-checkbox>
                </b-col>
                <b-col v-show="textFillState" md="6">Color</b-col>
                <b-col v-show="textFillState" md="6">
                    <b-form-input type="color" v-model="fontAttr.rectFill"
                        @change="(value) => changeCommonRect('fill', value)" size="sm"></b-form-input>
                </b-col>
            </b-row>
            <!-- -------------------  End Fill  ---------------- -->

            <!-- -------------------  Text Border  ---------------- -->
            <b-row class="mb-1">
                <b-col md="9">Border</b-col>
                <b-col md="3" class="text-right">
                    <b-form-checkbox v-model="borderState" @change="changeBorderState" class="custom-control-success mr-0"
                        name="fill" switch inline></b-form-checkbox>
                </b-col>
            </b-row>
            <b-row v-show="borderState" class="mb-1">
                <b-col md="6">
                    Color
                </b-col>
                <b-col md="6">
                    <b-form-input type="color" v-model="fontAttr.stroke"
                        @change="(value) => changeCommonRect('stroke', value)" size="sm"></b-form-input>
                </b-col>
                <b-col md="6" class="mt-1">
                    Border Style
                </b-col>
                <b-col md="6" class="mt-1">
                    <select class="form-control image-editor-select" v-model="fontAttr.strokeLabel"
                        @change="changeCommonRect('strokeType', fontAttr.strokeLabel)" size="sm">
                        <option v-for="item in strokeDashList" :value="item.label" :key="'stroke-' + item.label">
                            {{ item.label }}
                        </option>
                    </select>
                </b-col>
                <b-col md="6" class="mt-1">Line thickness</b-col>
                <b-col md="6" class="mt-1">
                    <b-input-group append="px" size="sm">
                        <b-form-input autocomplete="off" type="number" v-model="fontAttr.strokeWidth" :max="40"
                            @change="(value) => changeCommonRect('strokeWidth', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <!-- -------------------  End Text Border  ---------------- -->
        </div>
    </div>
</template>

<script>

import select from '@editor/mixins/select';
import Color from './color.vue';
import Align from './align.vue';
import $ from "jquery";
import OpenType from 'opentype.js'
import { fontLists } from "@editor/utils/fontConstant.js";
import { http } from '@/services/requests';

export default {
    mixins: [select],
    props: ['mSelectOneTypeProps'],
    components: {
        Color,
        Align
    },
    data() {
        return {
            textType: ['i-text', 'textbox', 'text'],
            // baseAttr: this.mSelectOneTypeProps[1],
            //fontAttr: this.mSelectOneTypeProps[2],
            baseAttr: JSON.parse(JSON.stringify(this.mSelectOneTypeProps[1])),
            fontAttr: JSON.parse(JSON.stringify(this.mSelectOneTypeProps[2])),
            // fontAttr: Object.assign({}, this.mSelectOneTypeProps[2]),
            tags: [],
            borderState: false,
            textFillState: false,
            strokeDashList: [
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [1, 10],
                        strokeLineCap: 'round',
                        strokeLabel: 'dotted',
                    },
                    label: 'dotted',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [15, 15],
                        strokeLineCap: 'square',
                        strokeLabel: 'dashed',
                    },
                    label: 'dashed',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [0, 0],
                        strokeLineCap: 'square',
                        strokeLabel: 'solid',

                    },
                    label: 'solid',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [],
                        strokeLineCap: 'square',
                        strokeLabel: 'double',
                    },
                    label: 'double',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [],
                        strokeLineCap: 'round',
                        strokeLabel: 'groove',
                    },
                    label: 'groove',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [],
                        strokeLineCap: 'square',
                        strokeLabel: 'ridge',
                    },
                    label: 'ridge',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [],
                        strokeLineCap: 'round',
                        strokeLabel: 'inset',
                    },
                    label: 'inset',
                },
                {
                    value: {
                        strokeUniform: true,
                        strokeDashArray: [],
                        strokeLineCap: 'round',
                        strokeLabel: 'outset',
                    },
                    label: 'outset',
                },
                {
                    label: 'none',
                },
            ],
        }
    },
    computed: {
        textFillStateFlag: function() {
            return this.textFillState;
        }
    },
    created() {

        this.canvas.c.on("object:moving", (opt) => {
            this.baseAttr.left = this.canvas.c.getActiveObject().left - this.canvas.editor.editorWorkspace.workspace.left;
            this.baseAttr.top = this.canvas.c.getActiveObject().top - this.canvas.editor.editorWorkspace.workspace.top;
        });

        this.canvas.c.on("object:scaling", (opt) => {

            var currObj = this.canvas.c.getActiveObject();
            
            if (this.canvas.c.getActiveObject().customType == "text") {

                if ( this.fontAttr.selected_text_manage_type == "automatic" ) {
                    this.fixTextPosition();
                } else {
                    this.fixTextPosition();
                    this.changeHandleLongText(this.fontAttr.selected_text_manage_type);
                }

                // Calculate new dimensions
                var newWidth = currObj.width * currObj.scaleX;
                var newHeight = currObj.height * currObj.scaleY;

                // // Update baseAttr for text
                this.baseAttr.width = newWidth;
                this.baseAttr.height = newHeight;

                // Reset the scale to 1, as we've manually updated the dimensions
                currObj.set({
                    scaleX: 1,
                    scaleY: 1
                });
            }
        });

        this.event.on('selectOne', (e) => {
            
            if (e[0].type == "group") {

                if (window.globalFonts) {
                    this.fontAttr.fontLists = window.globalFonts;
                } else {
                    this.fontAttr.fontLists = window.globalFonts = fontLists;
                }

                const groupObj = e[0];
                const rectObj = e[0]._objects[0];
                const textObj = e[0]._objects[1];

                //<!----------------- group property --------------->
                this.fontAttr.position = groupObj.position;
                this.fontAttr.selected_text_manage_type = groupObj.texthandle || "automatic";
                //<!----------------- end group property --------------->

                //<!----------------- rect property --------------->
                this.fontAttr.rectFill = rectObj.get('fill') || '';
                this.fontAttr.round = rectObj.get('ry') || 0;
                this.fontAttr.stroke = rectObj.get('stroke') || '';
                this.fontAttr.strokeWidth = rectObj.get('strokeWidth') || 0;
                this.fontAttr.strokeLabel = rectObj.get('strokeLabel') || "solid";
                //<!----------------- end rect property --------------->

                //<!----------------- end text property --------------->
                this.fontAttr.fill = textObj.get('fill') || '';
                this.fontAttr.text = textObj.get('text') || '';
                this.fontAttr.fontSize = textObj.get('fontSize');
                this.fontAttr.fontFamily = textObj.get('fontFamily');
                this.fontAttr.underline = textObj.get('underline');
                this.fontAttr.overline = textObj.get('overline');
                this.fontAttr.fontStyle = textObj.get('fontStyle');
                this.fontAttr.fontWeight = textObj.get('fontWeight');
                this.fontAttr.selected_fontfamily = textObj.fontFamily;
                //<!----------------- end text property --------------->

                // Update textFillState and borderState
                this.textFillState = !!this.fontAttr.rectFill;
                this.borderState = !!this.fontAttr.stroke && this.fontAttr.strokeWidth > 0;
                
                this.baseAttr.width = this.canvas.c.getActiveObject().width;
                this.baseAttr.height = this.canvas.c.getActiveObject().height;

                this.baseAttr.left = this.canvas.c.getActiveObject().left - this.canvas.editor.editorWorkspace.workspace.left;
                this.baseAttr.top = this.canvas.c.getActiveObject().top - this.canvas.editor.editorWorkspace.workspace.top;

                this.baseAttr.angle = this.canvas.c.getActiveObject().angle;

                // this.$nextTick(() => {
                //     this. ();
                // });
            }   
        });

        this.canvas.c.on("object:modified", (opt) => {
            this.baseAttr.width = this.canvas.c.getActiveObject().width;
            this.baseAttr.height = this.canvas.c.getActiveObject().height;
            this.baseAttr.angle = this.canvas.c.getActiveObject().angle;
            opt.e.preventDefault();
            opt.e.stopPropagation();
            this.canvas.c.renderAll();
        });

    },
    mounted() {        
        this.getProductFiels();
    },
    methods: {
        onChangeSelect(e) {
            let value = e;
            this.changeCommonText2('addTag', '[' + value + ']');
        },
        getProductFiels() {
            if (!this.$route.params.token) {
                this.showToast('danger', 3000, 'Alert', 'Opps! Project token is missing.')
                return;
            }

            http.get('get-product-fields/' + this.$route.params.token)
                .then((response) => {
                    if(Array.isArray(response.data) && response.data.length > 0) {
                        response.data.forEach((field) => {
                            this.tags.push({ text : field, value : field });
                        });
                    }
                    // this.tags = Object.entries(response.data);
                })
                .catch((error) => {
                    this.showToast('danger', 3000, 'Alert', error)
                });
        },
        initSet() {
            var activeObject = this.canvas.c.getActiveObject();
            if (activeObject.customType == "text") {
                //<---------------fill of rect setting ------------->
                if (activeObject._objects[0].fill !== '' || activeObject._objects[0].fill !== 'undefined') {
                    this.textFillState = true;
                    this.fontAttr.rectFill  = activeObject._objects[0].fill;
                }
                //<---------------fill of rect setting ------------->

                // <---------border of rect setting ---------->
                if (activeObject._objects[0].stroke != '') {
                    this.borderState = true;
                }

                if (activeObject._objects[0].strokeWidth != 0) {
                    this.borderState = true;
                    this.baseAttr.strokeWidth = activeObject._objects[0].strokeWidth;
                }
                // <---------border of rect setting ---------->
            }
        },
        changeTextFillState(value) {
            if (value == false) {
                const activeObject = this.canvas.c.getActiveObject();
                activeObject._objects[0].set('fill', '').setCoords();
                this.fontAttr.rectFill = '';
                this.canvas.c.renderAll();
            }
        },
        changeBorderState(value) {
            if (value == false) {
                const activeObject = this.canvas.c.getActiveObject();
                activeObject._objects[0].set('stroke', '').setCoords();
                activeObject._objects[0].set('strokeWidth', 0).setCoords();
                this.fontAttr.strokeWidth = 0;
                this.fontAttr.stroke = '';
                activeObject._objects[0].set("width", activeObject.width);
                activeObject._objects[0].set("height", activeObject.height);
                //center text object
                activeObject._objects[0].set({
                    left: 0 - (activeObject.width) / 2,
                    top: 0 - (activeObject.height) / 2,
                });
                activeObject._objects[1].set({
                    left: 0 - (activeObject.width) / 2,
                    top: 0 - (activeObject.height) / 2,
                });
                this.canvas.c.renderAll();
            }
        },
        //<!--------------- when textobjectbox's size increase ad decrease, text position and size fix    ---------------->
        fixTextPosition() {
            const activeObject = this.canvas.c.getActiveObject();
            if (activeObject.customType == "text") {

                const w = activeObject.width * activeObject.scaleX,
                    h = activeObject.height * activeObject.scaleY
                // var borderWidth = Number(document.getElementById("borderWidth").value);
                var borderWidth = Number(this.fontAttr.strokeWidth);

                activeObject.set({
                    'height': h,
                    'width': w,
                    'scaleX': 1,
                    'scaleY': 1,
                });

                activeObject._objects[0].set({
                    'height': h - borderWidth,
                    'width': w - borderWidth,
                    'scaleX': 1,
                    'scaleY': 1,
                    "left": 0 - (activeObject.width) / 2,
                    "top": 0 - (activeObject.height) / 2
                });
                var rectW = activeObject.width - borderWidth * 2;
                var textW = activeObject._objects[1].width;
                var textS = rectW / textW;
                if (textW > rectW) {
                    activeObject.set({
                        position: {
                            "positionX": "left",
                            "positionY": activeObject.position.positionY
                        }
                    });
                    activeObject._objects[1].set("scaleX", textS);
                    activeObject._objects[1].set("scaleY", textS);
                } else {

                    if (activeObject.originPoistion == "right") {
                        activeObject.set({
                            position: {
                                "positionX": "right",
                                "positionY": activeObject.position.positionY
                            }
                        });
                    }
                    if (activeObject.originPoistion == "xCenter") {
                        activeObject.set({
                            position: {
                                "positionX": "xCenter",
                                "positionY": activeObject.position.positionY
                            }
                        });
                    }

                    if (textS <= 1) {
                        activeObject._objects[1].set("scaleX", textS).setCoords();
                        activeObject._objects[1].set("scaleY", textS).setCoords();
                    }
                }
                var position = this.canvas.editor.getPosition(activeObject);
                if (activeObject.position.positionX == "right") {
                    activeObject._objects[1].set({
                        "left": position.left - borderWidth,
                        "top": position.top + borderWidth
                    });
                }

                if (activeObject.position.positionX == "left") {
                    activeObject._objects[1].set({
                        "left": position.left + borderWidth,
                        "top": position.top + borderWidth
                    });
                }

                if (activeObject.position.positionX == "xCenter") {
                    activeObject._objects[1].set({
                        "left": position.left,
                        "top": position.top + borderWidth
                    });
                }
                if (activeObject.position.positionY == "top") {
                    activeObject._objects[1].top = position.top + borderWidth
                }

                if (activeObject.position.positionY == "bottom") {
                    activeObject._objects[1].top = position.top - borderWidth
                }

                if (activeObject.position.positionY == "yCenter") {
                    activeObject._objects[1].top = position.top
                }
                this.canvas.c.renderAll();
            }
        },
        //<!--------------- when textobjectbox's size increase ad decrease, text position and size fix    ---------------->

        hiddenOutArea(activeObject) {

            var textObject = activeObject._objects[1];
            var clipRect = new fabric.Rect({
                originX: 'left',
                originY: 'top',
                left: activeObject.left,
                top: activeObject.top,
                width: activeObject.width - this.fontAttr.strokeWidth,
                height: activeObject.height,
                angle: activeObject.angle,
                absolutePositioned: true,
            });

            textObject.clipPath = clipRect;
            this.canvas.c.renderAll();
            textObject.clipPath = "";
        },

        addNewlinesBasedOnWrapper(text, wrapperWidth, fontSize, fontFamily, lineHeight) {

            if (typeof text !== 'string' || typeof wrapperWidth !== 'number' || typeof fontSize !== 'number') {
                console.error('Invalid input types');
                return null;
            }

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            context.font = `${fontSize}px Arial`; // Using a default font
            const words = text.split(/\s+/);
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = context.measureText(currentLine + ' ' + word).width;
                if (width < wrapperWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);

            const newText = lines.join('\n');

            return newText;
        },

        removeNewlines(text) {
            if (typeof text !== 'string') {
                console.error('Invalid input type');
                return null;
            }

            return text.replace(/\n/g, ' ');
        },
        //<!---------------- handle long text -------------->
        changeHandleLongText(selectedValue) {
            let evt;

            if (selectedValue instanceof Event) {
                evt = selectedValue.target.value;
            } else {
                evt = selectedValue;
            }

            console.log(evt);
           

            const activeObject = this.canvas.c.getActiveObject();
            if (!activeObject) {
                console.error("No active object found");
                return;
            }
            

            const textObject = activeObject._objects ? activeObject._objects[1] : activeObject;

            if (evt === 'automatic') {

                this.fontAttr.selected_text_manage_type = "automatic";
                activeObject.set("texthandle", this.fontAttr.selected_text_manage_type);
                const noBreak = this.removeNewlines(this.fontAttr.text);
                textObject.set('text', noBreak);
                this.fixTextPosition();

            } else if (evt === 'break') {

                const lineBreak = this.addNewlinesBasedOnWrapper(this.fontAttr.text, this.baseAttr.width, textObject.fontSize, 'arial', 1.5);
                textObject.set('text', lineBreak);
                this.fontAttr.selected_text_manage_type = "break";
                activeObject.set("texthandle", this.fontAttr.selected_text_manage_type);
                textObject.set("fontSize", textObject.fontSize).setCoords();
                textObject.set("scaleX", 1);
                textObject.set("scaleY", 1);
                this.hiddenOutArea(activeObject);

            } else {

                const noBreak = this.removeNewlines(this.fontAttr.text);
                textObject.set('text', noBreak);
                this.fontAttr.selected_text_manage_type = "shorten";
                activeObject.set("texthandle", this.fontAttr.selected_text_manage_type);
                textObject.set("fontSize", textObject.fontSize).setCoords();
                textObject.set("scaleX", 1);
                textObject.set("scaleY", 1);
                this.hiddenOutArea(activeObject);
            }

            this.canvas.c.renderAll();
        },

        //<!----------------end handle long text -------------->
        textKeyPress(value) {
            var string = this.fontAttr.text;
            // if (value.keyCode == 8) {
            //     if (string.includes('[')) {
            //         string = string.slice(0, string.lastIndexOf('['));
            //     }
            // }
            this.changeCommonText('text', string);
            this.changeHandleLongText(this.fontAttr.selected_text_manage_type);

        },
        //<!----------------------------  upload font   --------------------->
        uploadFontClick() {
            $("#uploadFont").click();
        },

        uploadFont(e) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                const activeObject = this.canvas.c.getActiveObject()._objects[1];
                const fontBuffer = reader.result;
                
                // Check if the file is either TTF or OTF
                if (file.name.toLowerCase().endsWith('.ttf') || file.name.toLowerCase().endsWith('.otf')) {
                    const font = OpenType.parse(fontBuffer);
                    const fontName = font.names.fontFamily.en;

                    this.fontFace = new FontFace(fontName, fontBuffer);
                    document.fonts.add(this.fontFace);

                    activeObject.set("fontFamily", fontName);

                    if (!window.globalFonts) {
                        window.globalFonts = this.fontAttr.fontLists;
                    }

                    const values = Object.values(window.globalFonts);
                    const searchValue = fontName;
                    const includesValue = values.includes(searchValue);

                    if (!includesValue) {
                        const stringforBuffer = new Uint8Array(fontBuffer).reduce(function (accumulator, value) {
                            return accumulator + String.fromCharCode(value);
                        }, '');

                        window.globalFonts.push({
                            name: fontName,
                            ttf_base64: stringforBuffer
                        });
                    }

                    activeObject.set('fontFamily', fontName).setCoords();
                    this.canvas.c.renderAll();
                    this.fontAttr.selected_fontfamily = fontName;
                } else {
                    console.error('Unsupported font format. Please upload a TTF or OTF file.');
                }
            };

            reader.readAsArrayBuffer(file);
        },

        //<!----------------------------  upload font   --------------------->
        changeFontWeight(key, value) {
            const nValue = value === 'normal' ? 'bold' : 'normal';
            this.fontAttr.fontWeight = nValue;
            this.canvas.c.getActiveObject()._objects[1].set(key, nValue).setCoords();
            this.canvas.c.renderAll();
        },
        // italics
        changeFontStyle(key, value) {
            const nValue = value === 'normal' ? 'italic' : 'normal';
            this.fontAttr.fontStyle = nValue;
            this.canvas.c.getActiveObject()._objects[1].set(key, nValue).setCoords();
            this.canvas.c.renderAll();
        },
        // middle stroke
        changeLineThrough(key, value) {
            const nValue = value === false;
            this.fontAttr.linethrough = nValue;
            this.canvas.c.getActiveObject()._objects[1].set(key, nValue).setCoords();
            this.canvas.c.renderAll();
        },
        // underline
        changeUnderline(key, value) {
            const nValue = value === false;
            this.fontAttr.underline = nValue;
            this.canvas.c.getActiveObject()._objects[1].set(key, nValue).setCoords();
            this.canvas.c.renderAll();
        },
        changeGroup(key, evt) {
            const activeObject = this.canvas.c.getActiveObject();
            if (evt.target != undefined) {
                if (typeof (Number(evt.target.value)) == "NAN") {
                    evt = Number(evt.target.value);
                } else {
                    evt = evt.target.value;
                }
            }
            if (key === 'angle') {
                activeObject.rotate(evt);
                this.canvas.c.renderAll();
                return;
            }

            if (['left', 'top'].includes(key)) {
                activeObject.set(key, Number(evt) + this.canvas.editor.editorWorkspace.workspace[key]);
                this.canvas.c.renderAll();
                return;
            }

            activeObject && activeObject.set(key, evt);
            this.canvas.c.renderAll();
        },
        changeCommonRect(key, evt) {

            const activeObject = this.canvas.c.getActiveObject()._objects[0];

            if (key == "strokeType") {
                const stroke = this.strokeDashList.find((item) => item.label === evt);
                activeObject.set(stroke.value).setCoords();
                this.canvas.c.renderAll();
                return;
            }

            if (key === "stroke") {
                activeObject.set("stroke", evt);
                this.canvas.c.renderAll();
                return;
            }

            if (key === "strokeWidth") {
                const strokeWidthValue = isNaN(evt) ? Number(evt.target.value) : Number(evt);
                activeObject.set("strokeWidth", strokeWidthValue);
                this.fixTextPosition();
                this.changeHandleLongText(this.fontAttr.selected_text_manage_type);
                this.canvas.c.renderAll();
                return;
            }

            if (key === "round") {
                const roundValue = isNaN(evt) ? Number(evt.target.value) : Number(evt);
                activeObject.set("ry", roundValue).setCoords();
                activeObject.set("rx", roundValue).setCoords();
                this.canvas.c.renderAll();
                return;
            }

            if (key === "fill") {
                activeObject.set("fill", evt);
                this.canvas.c.renderAll();
                return;
            }

            const numericValue = isNaN(evt) ? Number(evt.target.value) : Number(evt);
            activeObject && activeObject.set(key, numericValue);
            this.canvas.c.renderAll();
        },
        changeCommonText2(key, evt) {
            
            const activeObject = this.canvas.c.getActiveObject()._objects[1];

            if (key == "addTag") {
                evt = this.fontAttr.text + evt;
                key = "text";
            }

            this.fontAttr[key] = evt;
            activeObject && activeObject.set(key, evt);
            this.fixTextPosition();
            this.changeHandleLongText(this.fontAttr.selected_text_manage_type);
        },
        changeCommonText(key, evt) {

            const activeObject = this.canvas.c.getActiveObject()._objects[1];

            if (evt.target != undefined) {
                if (typeof (Number(evt.target.value)) == "NAN") {
                    evt = Number(evt.target.value);
                } else {
                    evt = evt.target.value;
                }
            }

            if (key == "deleteText") {
                if (evt.keyCode == 8) {
                    evt = evt.slice(0, evt.lastIndexOf('['));
                }
            }

            if (key == "addTag") {
                evt = this.fontAttr.text + evt;
                key = "text";
            }

            this.fontAttr[key] = evt;
            activeObject && activeObject.set(key, evt);
            this.fixTextPosition();
            this.changeHandleLongText(this.fontAttr.selected_text_manage_type);
        },
    }
}
</script>
<style scoped>
.input-size {
    width: 20%
}

.image-editor-select {
    background-position: calc(100% - 12px) 9px, calc(100% - 20px) 13px, 100% 0 !important;
}

.ib-tag-select {
    max-width: 150px;
    width : 100%;
    height: 30px;
    background-position: calc(100% - 12px) 7px, calc(100% - 26px) 10px, 100% 0 !important;
}

.select-overlay {
    width: max-content;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor : pointer;
}

.select-overlay svg {
    position: absolute;
    color: #fff;
    cursor : pointer;
}

.select-overlay select {
    appearance: none; 
    -webkit-appearance: none;
    -moz-appearance: none;
    background: #82868a;
    background-size: 12px; 
    padding-right: 30px;
    border: 1px solid #ccc; 
    border-radius: 4px;
    width: 100%;
    padding: 8px; 
    font-size: 16px; 
    cursor: pointer;
}

.select-overlay select:focus {
    outline: none;
}

.select-overlay .v-select {
    width: 200px;
}

.input-and-select {
    position: relative;
    display: flex;
}

.input-and-select input {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: 0 !important;
}
</style>