<template>
    <div class="attribute p-1 bg-white">
        <div v-show="mSelectMode === 'one'" id="attribute">
            <!-- general properties -->
            <div class="right_header">

                <!-- Right Head -->
                <right-header :mSelectOneTypeProps="[mSelectOneType, baseAttr]"></right-header>
                <!-- Right Head -->

                <b-row class="mt-1" v-if="['image','extra_product', 'productImage'].includes(replaceType)">
                    <b-col md="12">
                        <div class="drag-and-drop" @drop="handleDrop" ref="draggableBox" @dragover.prevent>
                            Drag a file or <a href="#" @click="insertImg">Select an Image</a>
                        </div>
                    </b-col>
                    <b-col>
                        <div class="replaced-image">
                            <b-img-lazy v-bind="{ width : 100, height : 100 }" :src="selectedImageUrl"></b-img-lazy>
                        </div>
                    </b-col>
                    <b-col class="text-right">
                        <b-overlay :show="!isProductImageLoaded" rounded="sm" v-if="'extra_product' === replaceType">
                            <select class="form-control image-editor-select" @change="selectProductImage" size="sm">
                                <option v-for="item in allProductImages" :value="item.value" :key="item.value">{{ item.name }}</option>
                            </select>
                        </b-overlay>
                        <b-button v-else @click="insertImg" variant="secondary" size="sm">Replace</b-button>
                    </b-col>
                </b-row>
                

                <!-- layer setting -->
                <hr />
                <div class="d-flex">
                    <layer1></layer1>
                    <div class="lock-icons">
                        <b-button variant="outline-secondary" v-if="mSelectMode === 'one'" v-b-tooltip.hover
                            title="Click to unlock or lock" placement="top" size="sm">
                            <feather-icon icon="ChevronsRightIcon" v-if="isLock" @click="doLock(false)" />
                            <feather-icon icon="UnlockIcon" v-else @click="doLock(true)" />
                        </b-button>
                        <b-button variant="outline-secondary" v-if="mSelectMode === 'one'" v-b-tooltip.hover
                            title="Click to view or unview" placement="top" size="sm">
                            <feather-icon icon="EyeOffIcon" v-if="isView" @click="doView(true)" />
                            <feather-icon icon="EyeIcon" v-else @click="doView(false)" />
                        </b-button>
                        <b-dropdown id="eye-dropdown" text="..." size="sm">
                            <clone></clone>
                            <dele></dele>
                        </b-dropdown>
                    </div>
                </div>
                <!-- layer setting -->
                <hr />
            </div>
            <div class="setBox">
                <div v-show="imgType.includes(mSelectOneType)">
                    <!-- control part -->
                    <b-row class="mb-1">
                        <b-col md="2">
                            <label for="">Size</label>
                        </b-col>
                        <b-col md="5">
                            <b-input-group size="sm" append="width">
                                <b-form-input type="number" autocomplete="off" v-model="baseAttr.width"
                                    @change="changeCommon('width', $event)">
                                </b-form-input>
                            </b-input-group>
                            <!-- <b-form-input type="number" autocomplete="off" v-model="baseAttr.width" @change="(value) => changeCommon('width', value)"></b-form-input> -->
                        </b-col>
                        <b-col md="5">
                            <b-input-group size="sm" append="height">
                                <b-form-input type="number" autocomplete="off" v-model="baseAttr.height"
                                    @change="changeCommon('height', $event)">
                                </b-form-input>
                            </b-input-group>
                            <!-- <b-form-input type="number" autocomplete="off" v-model="baseAttr.height" @change="(value) => changeCommon('height', value)"></b-form-input> -->
                        </b-col>
                    </b-row>
                    <!-- --------------------- Position ----------------------->
                    <b-row class="mb-1">
                        <b-col md="2">
                            <label for="">Position</label>
                        </b-col>
                        <b-col md="5">
                            <b-input-group size="sm" append="horizontal(X)">
                                <b-form-input type="number" autocomplete="off" v-model="baseAttr.left"
                                    @change="changeCommon('left', $event)" pattern="^\d*(\.\d{0,2})?$">
                                </b-form-input>
                            </b-input-group>
                        </b-col>
                        <b-col md="5">
                            <b-input-group append="vertical(Y)" size="sm">
                                <b-form-input type="number" autocomplete="off" v-model="baseAttr.top"
                                    @change="changeCommon('top', $event)">
                                </b-form-input>
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <!-- --------------------- Position ----------------------->
                </div>
                <div v-show="imgType.includes(mSelectOneType)">
                    <b-row class="mb-1">
                        <b-col>
                            <label for="">Flip</label>
                        </b-col>
                        <b-col>
                            <flip></flip>
                        </b-col>
                        <b-col>
                            <b-form-input size="sm" autocomplete="off" type="number" v-model="baseAttr.angle" :max="360"
                                @change="(value) => changeCommon('angle', value)"></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- <div class="row mb-3">
                        <div>Flip</div>
                        <flip></flip>
                        <div class="input-size">
                            <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type-text">
                                <span class="ivu-input-suffix">
                                    <i style="font-style: normal; font-size: 11px">&deg;</i> -->
                    <!-- Degree -->
                    <!-- </span>
                                <input autocomplete="off" type="number"
                                    class="ivu-input ivu-input-default ivu-input-with-suffix" placeholder="Enter text"
                                    v-model="baseAttr.angle" :max="360" @change="(value) => changeCommon('angle', value)" />
                            </div>
                        </div>
                    </div> -->
                    <!-- emptypattern part -->
                    <b-row class="mb-1"
                        v-if="(baseAttr.id === 'productImage' || baseAttr.id === 'nonBgImage' || baseAttr.customType === 'extra_product') && imageOwner">
                        <b-col md="9">Remove background <b-badge pill variant="warning">beta</b-badge></b-col>
                        <b-col md="3" class="text-right">
                            <b-form-checkbox v-model="nonBgImageState" class="custom-control-success mr-0"
                                name="remove-background" switch inline @change="nonproductImageChange">
                            </b-form-checkbox>
                        </b-col>
                    </b-row>
                    <b-row class="mb-1"
                        v-if="(baseAttr.id === 'productImage' || baseAttr.id === 'nonBgImage' || baseAttr.customType === 'extra_product')">
                        <b-col md="9">Zoom in to fill wrapper <b-badge pill variant="warning">beta</b-badge></b-col>
                        <b-col md="3" class="text-right">
                            <b-form-checkbox v-model="trimImageState" class="custom-control-success mr-0"
                                name="trim-empty-space-from-margins" switch inline @change="trimproductImageChange">
                            </b-form-checkbox>
                        </b-col>
                    </b-row>
                    <b-row class="mb-1">
                        <b-col md="12" class="mb-1">
                            <label>Align Horizontal/Vertical</label>
                        </b-col>
                        <b-col md="12" v-if="baseAttr.customType == 'image'">
                            <align-image></align-image>
                        </b-col>
                        <b-col md="12"
                            v-if="baseAttr.customType === 'extra_product' || baseAttr.customType === 'productImage'">
                            <align-product :position="[baseAttr.position]"></align-product>
                        </b-col>
                    </b-row>
                </div>

                <!----------------- shape and text ----------------------->
                <shape-type :mSelectOneTypeProps="[mSelectOneType, baseAttr]"></shape-type>
                <text-type :mSelectOneTypeProps="[mSelectOneType, baseAttr, fontAttr]"
                    @textGroupSet="textGroupSet($event)"></text-type>

                <!----------------- shape and text ----------------------->

                <!-- Layer restriction -->
                <hr />
                <b-row class="mb-1">
                    <b-col md="9">Layer time restriction</b-col>
                    <b-col md="3" class="text-right">
                        <b-form-checkbox v-model="restrictionState" class="custom-control-success mr-0"
                            name="layer-time-restriction" switch inline></b-form-checkbox>
                    </b-col>
                </b-row>

                <div v-if="restrictionState">
                    <b-row class="mb-1">
                        <b-col>Generate</b-col>
                        <b-col>
                            <select class="form-control image-editor-select" v-model="baseAttr.layerShowPeriod.mode"
                                @change="(event) => changeLayerShowPeriod('mode', event.target.value)" size="sm">
                                <option v-for="item in modes" :value="item.value" :key="item.value">{{ item.label }}
                                </option>
                            </select>
                        </b-col>
                    </b-row>
                    <b-row class="mb-1">
                        <b-col>From</b-col>
                        <b-col>
                            <b-form-datepicker placeholder="Start date" id="layer-restriction-from"
                                v-model="baseAttr.layerShowPeriod.startDate"
                                @on-change="(value) => changeLayerShowPeriod('startDate', value)"
                                size="sm"></b-form-datepicker>
                        </b-col>
                    </b-row>
                    <b-row class="mb-1">
                        <b-col>Until</b-col>
                        <b-col>
                            <b-form-datepicker placeholder="End date" id="layer-restriction-until"
                                v-model="baseAttr.layerShowPeriod.endDate"
                                @on-change="(value) => changeLayerShowPeriod('endDate', value)"
                                size="sm"></b-form-datepicker>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-input v-model="text" placeholder="Generated all the time." readonly
                                size="sm"></b-form-input>
                        </b-col>
                    </b-row>
                </div>
                <!-- Layer restriction -->
            </div>
        </div>
    </div>
</template>

<script>
import { getImgStr, selectFiles } from '@editor/utils/utils';
import { v4 as uuid } from 'uuid';
import select from "@editor/mixins/select";
import layer1 from "./layer1.vue";
import Color from "./color.vue";
import dele from "./del.vue";
import clone from "./clone.vue";
import flip from "./flip.vue";
import alignImage from "./alignImage.vue";
import alignProduct from "./alignProduct.vue";
import { nonBgImage, trimImage, trimandremove, productImage } from "@editor/utils/imgConstant";
import rightHeader from "./rightHeader.vue";
import shapeType from "./shapeType.vue";
import background from "./background.vue";
import textType from "./textType.vue";
import group from "./group.vue";
import { fabric } from "fabric";
import { http } from '@/services/requests';

const lockAttrs = [
    "lockMovementX",
    "lockMovementY",
    "lockRotation",
    "lockScalingX",
    "lockScalingY",
];

export default {
    name: "ToolBar",
    mixins: [select],
    components: {
        Color,
        layer1,
        dele,
        clone,
        flip,
        alignImage,
        rightHeader,
        alignProduct,
        shapeType,
        textType,
        group,
        background
    },
    props: ['imageOwner'],
    data() {
        return {
            isProductImageLoaded :false,
            allProductImages : [],
            replace : null, 
            //layer restriction
            modes: [
                {
                    value: "only",
                    label: "only",
                },
                {
                    value: "except",
                    label: "except",
                },
            ],
            changeProductImageState: false,
            restrictionState: false,
            //layer restriction
            isLock: false,
            isView: true,
            nonBgImageState: false,
            trimImageState: false,
            imageStatus: "",

            // common element
            baseType: [
                "text",
                "i-text",
                "textbox",
                "triangle",
                "image",
                "group",
                "line",
                "arrow",
                "rect",
                "circle",
            ],
            // <!------------------------image element --->
            imgType: ["image"],
            // general properties
            baseAttr: {
                name: "",
                width: 0,
                height: 0,
                round: 0,
                sizeX: 0,
                sizeY: 0,
                opacity: 0,
                angle: 0,
                fill: "#fff",
                left: 0,
                top: 0,
                strokeWidth: 0,
                stroke: "",
                shadow: {
                    color: "#ffffff",
                    blur: 0,
                    offsetX: 0,
                    offsetY: 0,
                },
                layerShowPeriod: {
                    mode: "",
                    startDate: "",
                    endDate: "",
                },
            },
            // font properties
            fontAttr: {
                string: "",
                fontSize: 0,
                fontFamily: "",
                lineHeight: 0,
                charSpacing: 0,
                fontWeight: "",
                textBackgroundColor: "#fff",
                textAlign: "",
                fontStyle: "",
                underline: false,
                linethrough: false,
                overline: false,
            },

            // font alignment
            textAlignList: ["left", "center", "right"],
            // Align icon
            textAlignListSvg: [
                '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
                '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
                '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>',
            ],
            imageShowMode: "",
            layerShowPeriod: {
                mode: "",
                startDate: "",
                endDate: "",
            },
            text: '',
            selectedImageUrl : null,
            replaceType : null,
        };
    },

    created() {
        this.canvas.c.on("object:scaling", (opt) => {
            var activeObject = this.canvas.c.getActiveObject();
            if (opt.transform.corner == "mr" || opt.transform.corner == "mt" || opt.transform.corner == "ml" || opt.transform.corner == "mb") {
                opt.target.lockScalingFlip = true;
            }

            if (opt.transform.corner == "br") {
                var target = opt.target;
                var pointer = this.canvas.c.getPointer(opt.e);
                if (target && target.id === "productImage" && pointer.x !== target.left && pointer.y !== target.top || target.customType === "extra_product") {
                    var scaleXChange = (pointer.x - target.left) / target.width;
                    var scaleYChange = (pointer.y - target.top) / target.height;
                    target.lockScalingFlip = true;
                    target.set({
                        scaleX: scaleXChange,
                        scaleY: scaleYChange,
                    });
                    target.setCoords(); // Update the object's coordinates
                }
            }

            if (activeObject.customType == "productImage" || activeObject.customType == "extra_product") {
                this.baseAttr.width = activeObject.get('width');
                this.baseAttr.height = activeObject.get('height');
                this.controlProductImage();
                this.fixTextPosition();
            }

            // Update baseAttr dimensions based on the scaling
            if (activeObject && activeObject.type === 'image') { // Check if the object is an image
                this.baseAttr.width = activeObject.getScaledWidth();
                this.baseAttr.height = activeObject.getScaledHeight();
            }
        }),

        this.event.on("selectUpdate", () => {
            if (this.canvas.c.getActiveObject().name == "picture") {
                this.canvas.c.getActiveObject().clipState = this.imageShowMode;
            }
        });


        this.canvas.c.on("object:moving", (opt) => {
            let current_object = this.canvas.c.getActiveObject();
            // Calculate new positions
            this.baseAttr.left = current_object.left - this.canvas.editor.editorWorkspace.workspace.left;
            this.baseAttr.top = current_object.top - this.canvas.editor.editorWorkspace.workspace.top;
        });

        this.event.on("selectOne", (items) => {

            this.isLock = !items[0].hasControls;
            this.mSelectActive = items[0];
            var activeObject = this.canvas.c.getActiveObject();
            
            // activeObject.forEachObject((obj) => {
            //     if("extra_product" === obj.customType) {
            //         console.log('hello')
            //         console.log(obj.getSrc())
            //     }
            // });

            if (activeObject) {

                this.replaceType = activeObject.customType;

                if( 'image' === activeObject.customType ) {
                    this.selectedImageUrl = activeObject.getSrc();
                } else if ( 'extra_product' ===  activeObject.customType ) {
                    this.getExtraProducts();
                    this.selectedImageUrl = this.findImageSrc(activeObject)
                } else {
                    this.selectedImageUrl = null;
                }
                // base
                this.baseAttr.id = activeObject.id;
                this.baseAttr.position = activeObject.position;
                this.baseAttr.customType = activeObject.customType;
                this.baseAttr.item_name = activeObject.item_name;
                this.baseAttr.round = activeObject.get("rx");
                this.baseAttr.height = activeObject.get("height");
                this.baseAttr.width = activeObject.get("width");
                this.baseAttr.opacity = activeObject.get("opacity") * 100;
                this.baseAttr.fill = activeObject.get("fill");

                if (this.baseAttr.fill == null) {
                    this.baseAttr.fill = "";
                }

                this.baseAttr.left = activeObject.get("left") - this.canvas.editor.editorWorkspace.workspace.left;
                this.baseAttr.top = activeObject.get("top") - this.canvas.editor.editorWorkspace.workspace.top;
                this.baseAttr.stroke = activeObject.get("stroke");

                if (this.baseAttr.stroke == null) {
                    this.baseAttr.stroke = "";
                }

                this.baseAttr.shadow = activeObject.get("shadow") || {};
                this.baseAttr.angle = activeObject.get("angle") || 0;
                this.baseAttr.padding = activeObject.get("padding") || 0;
                this.baseAttr.layerShowPeriod = activeObject.get("layerShowPeriod");

                if (items[0].type == "group") {

                    const groupObj = items[0];
                    const rectObj = items[0]._objects[0];
                    const textObj = items[0]._objects[1];

                    groupObj.forEachObject((obj) => {
                        if(obj.type === 'group') {
                            obj.forEachObject((obj2) => {
                                if(obj2.type === 'image') {
                                    this.selectedImageUrl = obj2.getSrc();
                                }
                            });
                        }
                    });

                    //<!----------------- group property --------------->
                    this.fontAttr.position = groupObj.position;
                    this.fontAttr.fontLists = window.globalFonts;
                    this.fontAttr.selected_text_manage_type = groupObj.texthandle || "automatic";
                    //<!----------------- end group property --------------->

                    //<!----------------- rect property --------------->
                    this.fontAttr.rectFill = rectObj.get("fill") || "";
                    this.fontAttr.round = rectObj.get("ry") || 0;
                    this.fontAttr.stroke = rectObj.get("stroke") || "";
                    this.fontAttr.strokeWidth = rectObj.get("strokeWidth") || 0;
                    this.fontAttr.strokeLabel = rectObj.get("strokeLabel") || "solid";
                    //<!----------------- end rect property --------------->

                    //<!----------------- end text property --------------->
                    this.fontAttr.fill = textObj.get("fill") || "";
                    this.fontAttr.text = textObj.get("text") || "";
                    this.fontAttr.fontSize = textObj.get("fontSize");
                    this.fontAttr.fontFamily = textObj.get("fontFamily");
                    this.fontAttr.underline = textObj.get("underline");
                    this.fontAttr.overline = textObj.get("overline");
                    this.fontAttr.fontStyle = textObj.get("fontStyle");
                    this.fontAttr.fontWeight = textObj.get("fontWeight");
                    this.fontAttr.selected_fontfamily = textObj.fontFamily;

                    if (activeObject.customType == "productImage" || activeObject.customType == "extra_product") {

                        this.changeProductImageState = true;

                        switch (activeObject.bgState) {
                            case "productImage":
                                this.nonBgImageState = false;
                                this.trimImageState = false;
                                break;
                            case "nonAndTrimImage":
                                this.nonBgImageState = true;
                                this.trimImageState = true;
                                break;
                            case "nonBgImage":
                                this.nonBgImageState = true;
                                this.trimImageState = false;
                                break;
                            case "trimBgImage":
                                this.nonBgImageState = false;
                                this.trimImageState = true;
                                break;
                        }
                        this.changeProductImageState = false;
                    }

                    // //layerRestricion
                    this.setLayerShowPeriod();
                    setTimeout(() => {
                        this.generateLayerPeriod();
                    }, 300);
                    // //layerRestricion
                }
            }
        });
    },

    mounted() {
        // setInterval(() => {
        //   this.canvas.editor.checkLayerPeriod();
        // }, 1000);
        const activeObject = this.canvas.c.getActiveObject();
    },
    computed: {},
    methods: {
        handleDrop(event) {
            event.preventDefault();
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                const droppedFile = files[0];
                this.encodeImage(droppedFile);
            }
        },
        encodeImage(file) {

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                this.insertImgFile(base64String)
                // Here you can use the base64String as needed
            };
            reader.readAsDataURL(file);

            // Handle dropped files here
            // console.log('Files dropped:', files);
            // this.insertImgFile(files[0])
        },
        getExtraProducts() {
            http.get('editor/product-images/' + this.$route.params.token)
            .then((response) => {
                this.isProductImageLoaded = true;
                this.allProductImages = [];
                if(response.data.success) {
                    if(Array.isArray(response.data.image_fields) && response.data.image_fields.length) {
                        response.data.image_fields.forEach((field) => {
                            this.allProductImages.push({
                                value : field, name : field
                            });
                        });
                    }
                }
            })
            .catch((error) => {
                this.isProductImageLoaded = false;
                this.showToast('danger', 3000, 'Alert', error)
            });
        },
        findImageSrc(object) {
            if (object.type === 'image') {
                return object.src; // Return the src if the object is an image
            } else if (object.objects && object.objects.length) {
                // If the object contains nested objects, search within them
                for (let nestedObject of object.objects) {
                    let src = findImageSrc(nestedObject);
                    if (src) {
                        return src; // Return the src if found in a nested object
                    }
                }
            }
            return null; // Return null if no image object is found
        },
        selectProductImage(e) {

            const product_image = e.target.value;
            const activeObject = this.canvas.c.getActiveObject();

            if (activeObject) {
                // Clone the active object
                activeObject.clone((cloned) => { 

                    cloned.forEachObject((obj) => {
                        if(obj.type === 'group') {
                            obj.forEachObject((obj2) => {
                                if (obj2.type === 'i-text') {
                                    obj2.set('text', product_image);
                                }
                            })
                        }
                    });
                    
                    cloned.set({
                        id: product_image,
                        item_name: product_image,
                        layerShowPeriod: {
                            mode: '',
                            startDate: '',
                            endDate: ''
                        },
                        bgState: product_image,
                        customType: "extra_product",
                        objectCaching: false,
                        position: {
                            positionX: "xCenter",
                            positionY: "yCenter"
                        },
                        originPoistion: "xCenter",
                    });

                    this.canvas.c.add(cloned);
                    this.canvas.c.renderAll();
                });
            }

            // Delete the active object
            this.removeObject();
        },
        insertImg() {
            selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
                Array.from(fileList).forEach((item) => {
                    if(item.size > 1000000 ) {
                        this.showToast('warning', 3000, 'Alert', 'Max upload size is 1 MB');
                        return;
                    }
                    getImgStr(item).then((file) => {
                        this.insertImgFile(file, "normal");
                    });
                });
            });
        },
        removeObject() {
            const activeObject = this.canvas.c.getActiveObject();
            if(activeObject) {
                this.canvas.c.remove(activeObject);
                this.canvas.c.renderAll();
            }
        },
        insertImgFile(file) {

            const activeObject = this.canvas.c.getActiveObject();
            let positionX, positionY;

            if (activeObject) {
                // Get position of active object
                positionX = activeObject.left ;
                positionY = activeObject.top ;
                // Remove the active object
                this.removeObject();
            }

            const imgEl = document.createElement('img');
            imgEl.src = file || this.imgFile;

            // insert page
            document.body.appendChild(imgEl);

            imgEl.onload = () => {

                // Create a picture object
                var name = this.canvas.editor.getName("image");
                var product = this.canvas.c.getObjects().filter(arg => {
                    return arg.id == "productImage"
                });

                const imgInstance = new this.fabric.Image(imgEl, {
                    id: uuid(),
                    item_name: name,
                    nonBgImageState: false,
                    customType: "image",
                    layerShowPeriod: {
                        mode: '',
                        startDate: '',
                        endDate: ''
                    },
                    // position: {
                    //     positionX: positionX,
                    //     positionY: positionY
                    // },
                    left : positionX, 
                    top : positionY
                }).setCoords();

                this.canvas.c.add(imgInstance);
                this.canvas.c.setActiveObject(imgInstance);

                // // Remove image elements from the page
                imgEl.remove();
            };
        },
        handleReplace(e) {
             this._updateReplace(e);
        },
        controlProductImage(width = null, height = null) {

            const activeObject = this.canvas.c.getActiveObject(),
                w = activeObject.width * activeObject.scaleX,
                h = activeObject.height * activeObject.scaleY;
            activeObject
                .set({
                    height: h,
                    width: w,
                    scaleX: 1,
                    scaleY: 1,
                }).setCoords();

            var rectW = activeObject.width;

            if (activeObject.hasOwnProperty('_objects')) {
                
                var imageW = activeObject._objects[1].width;
                var image_scale_x = rectW / imageW;
                var rectH = activeObject.height;
                var imageH = activeObject._objects[1].height;
                var image_scale_y = rectH / imageH;

                if (activeObject.width <= activeObject.height) {
                    activeObject._objects[1].set({
                        left: 0 - (activeObject._objects[1].width * image_scale_x) / 2,
                    });

                    if (activeObject.position.positionY == "yCenter") {
                        activeObject._objects[1].set({
                            top: 0 - (activeObject._objects[1].height * image_scale_x) / 2,
                        });
                    }

                    if (activeObject.position.positionY == "top") {
                        activeObject._objects[1].set({
                            top: -(activeObject.height / 2),
                        });
                    }

                    if (activeObject.position.positionY == "bottom") {
                        activeObject._objects[1].set({
                            top:
                                activeObject.height / 2 -
                                activeObject._objects[1].height * image_scale_x,
                        });
                    }
                    activeObject._objects[1].set("scaleX", image_scale_x).setCoords();
                    activeObject._objects[1].set("scaleY", image_scale_x).setCoords();
                } else {
                    activeObject._objects[1].set({
                        top: 0 - (activeObject._objects[1].height * image_scale_y) / 2,
                    });

                    if (activeObject.position.positionX == "xCenter") {
                        activeObject._objects[1].set({
                            left: 0 - (activeObject._objects[1].width * image_scale_y) / 2,
                        });
                    }

                    if (activeObject.position.positionX == "left") {
                        activeObject._objects[1].set({
                            left: -(activeObject.width / 2),
                        });
                    }

                    if (activeObject.position.positionX == "right") {
                        activeObject._objects[1].set({
                            left:
                                activeObject.width / 2 -
                                activeObject._objects[1].width * image_scale_y,
                        });
                    }

                    activeObject._objects[1].set("scaleX", image_scale_y).setCoords();
                    activeObject._objects[1].set("scaleY", image_scale_y).setCoords();
                }
            }

            this.canvas.c.renderAll();
        },
        fixTextPosition() {
            const activeObject = this.canvas.c.getActiveObject();

            if (activeObject.customType == "productImage" || activeObject.customType == "extra_product") {
                const w = activeObject.width * activeObject.scaleX,
                    h = activeObject.height * activeObject.scaleY

                activeObject.set({
                    'height': h,
                    'width': w,
                    'scaleX': 1,
                    'scaleY': 1,
                });

                activeObject._objects[0].set({
                    'height': h,
                    'width': w,
                    'scaleX': 1,
                    'scaleY': 1,
                    "left": 0 - (activeObject.width) / 2,
                    "top": 0 - (activeObject.height) / 2
                });
                var rectW = activeObject.width;
                var textW = activeObject._objects[1].width;
                var textS = rectW / textW;
                if (textW > rectW) {
                    // activeObject.set({
                    //     position:{
                    //       "positionX":"left",
                    //       "positionY":activeObject.position.positionY
                    //     }
                    // });									
                    // activeObject._objects[1].set("scaleX",textS);
                    // activeObject._objects[1].set("scaleY",textS);			
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

                    if (textS < 1) {
                        activeObject._objects[1].set("scaleX", textS).setCoords();
                        activeObject._objects[1].set("scaleY", textS).setCoords();
                    }
                }
                var position = this.canvas.editor.getPosition(activeObject);
                if (activeObject.position.positionX == "right") {
                    activeObject._objects[1].set({
                        "left": position.left,
                        "top": position.top
                    });
                }

                if (activeObject.position.positionX == "left") {
                    activeObject._objects[1].set({
                        "left": position.left,
                        "top": position.top
                    });
                }

                if (activeObject.position.positionX == "xCenter") {
                    activeObject._objects[1].set({
                        "left": position.left,
                        "top": position.top
                    });
                }
                if (activeObject.position.positionY == "top") {
                    activeObject._objects[1].top = position.top
                }

                if (activeObject.position.positionY == "bottom") {
                    activeObject._objects[1].top = position.top
                }

                if (activeObject.position.positionY == "yCenter") {
                    activeObject._objects[1].top = position.top
                }
                this.canvas.c.renderAll();
            }
        },

        setLayerShowPeriod() {
            var state = this.baseAttr.layerShowPeriod;

            if (state.mode == "" && state.startDate == "" && state.endDate == "") {
                this.restrictionState = false;
            } else {
                this.restrictionState = true;
            }
        },

        changeLayerShowPeriod(key, value) {
            var activeObject = this.canvas.c.getActiveObject();
            switch (key) {
                case "mode":
                    activeObject.layerShowPeriod.mode = value;
                    this.baseAttr.layerShowPeriod.mode = value;
                    break;

                case "startDate":
                    activeObject.layerShowPeriod.startDate = value;
                    this.baseAttr.layerShowPeriod.startDate = value;
                    break;

                case "endDate":
                    activeObject.layerShowPeriod.endDate = value;
                    this.baseAttr.layerShowPeriod.endDate = value;
                    break;
            }
            this.generateLayerPeriod();
            this.canvas.c.renderAll();
        },

        generateLayerPeriod() {
            if (document.getElementById("genLayerPeriod") != null) {
                if (this.baseAttr.layerShowPeriod.startDate != "") {
                    if (this.baseAttr.layerShowPeriod.mode == "except") {
                        document.getElementById("genLayerPeriod").value =
                            "Generation stopped from " +
                            this.baseAttr.layerShowPeriod.startDate;
                    } else {
                        document.getElementById("genLayerPeriod").value =
                            "Generated from " + this.baseAttr.layerShowPeriod.startDate;
                    }
                }

                if (this.baseAttr.layerShowPeriod.endDate != "") {
                    if (this.baseAttr.layerShowPeriod.mode == "except") {
                        document.getElementById("genLayerPeriod").value =
                            "Generation stopped until " +
                            this.baseAttr.layerShowPeriod.endDate;
                    } else {
                        document.getElementById("genLayerPeriod").value =
                            "Generated until " + this.baseAttr.layerShowPeriod.endDate;
                    }
                }
                if (
                    this.baseAttr.layerShowPeriod.startDate != "" &&
                    this.baseAttr.layerShowPeriod.endDate != ""
                ) {
                    if (this.baseAttr.layerShowPeriod.mode == "except") {
                        document.getElementById("genLayerPeriod").value =
                            "Generation stopped from " +
                            this.baseAttr.layerShowPeriod.startDate +
                            " until " +
                            this.baseAttr.layerShowPeriod.endDate;
                    } else {
                        document.getElementById("genLayerPeriod").value =
                            "Generated from " +
                            this.baseAttr.layerShowPeriod.startDate +
                            " until " +
                            this.baseAttr.layerShowPeriod.endDate;
                    }
                }

                if (
                    this.baseAttr.layerShowPeriod.startDate == "" &&
                    this.baseAttr.layerShowPeriod.endDate == ""
                ) {
                    document.getElementById("genLayerPeriod").value =
                        "Generated all the time";
                }
            }
        },

        nonproductImageChange(evt) {
            if (evt == true) {
                this.nonBgImageState = true;
                return true;
            } else {
                this.nonBgImageState = false;
                return true;
            }
        },
        trimproductImageChange(evt) {

        },

        doView(isView) {
            isView ? this.view() : this.unView();
        },

        view() {
            this.isView = false;
            this.changeCommon("opacity", 0);
        },

        unView() {
            this.isView = true;
            this.changeCommon("opacity", 100);
        },

        doLock(isLock) {
            isLock ? this.lock() : this.unLock();
        },

        lock() {
            // Modify custom properties
            this.mSelectActive.hasControls = false;
            // Moify default properties
            lockAttrs.forEach((key) => {
                this.mSelectActive[key] = true;
            });

            this.mSelectActive.selectable = false;

            this.isLock = true;
            this.canvas.c.renderAll();
        },

        unLock() {
            // Modify custom properties
            this.mSelectActive.hasControls = true;
            // Modify default properties
            lockAttrs.forEach((key) => {
                this.mSelectActive[key] = false;
            });
            this.mSelectActive.selectable = true;
            this.isLock = false;
            this.canvas.c.renderAll();
        },

        imgWidthClip(width) {
            var imgW = this.canvas.c.getActiveObject()._objects[1].getElement().width;
            var imgH = this.canvas.c
                .getActiveObject()
                ._objects[1].getElement().height;

            const activeObject = this.canvas.c.getActiveObjects()[0];
            var scale = activeObject._objects[1].scaleX;
            activeObject.set("width", width);
            activeObject._objects[1].set("scaleX", scale);
            activeObject._objects[1].set("scaleY", scale);

            if (scale <= width / imgW) {
                scale = width / imgW;
                activeObject._objects[1].set("scaleX", scale);
                activeObject._objects[1].set("scaleY", scale);
                var top = 0 - (imgH * scale) / 2;
                var left = -(activeObject.width / 2);
                activeObject._objects[1].set("left", left);
                activeObject._objects[1].set("top", top);
            }

            var clipRect = new fabric.Rect({
                originX: "left",
                originY: "top",
                left: activeObject.left,
                top: activeObject.top,
                width: activeObject.width,
                height: activeObject.height,
                angle: activeObject.angle,
                absolutePositioned: true,
            });
            activeObject.clipPath = clipRect;
            this.canvas.c.renderAll();
            activeObject.clipPath = "";
            return;

        },

        imgHeightClip(height) {
            const activeObject = this.canvas.c.getActiveObjects()[0];
            var imgW = this.canvas.c.getActiveObject()._objects[1].getElement().width;
            var imgH = this.canvas.c
                .getActiveObject()
                ._objects[1].getElement().height;
            var scale = this.baseAttr.width / imgW;
            var top = 0 - (imgH * scale) / 2;
            var left = -(activeObject.width / 2);
            var diff = left + (activeObject.width / 2) * scale;

            if (scale <= height / imgH) {
                scale = height / imgH;
                top = 0 - (imgH * scale) / 2;
                left = -((activeObject._objects.width * activeObject.scaleX) / 2);
            }

            activeObject.set("height", height);
            activeObject._objects[1].set("scaleX", scale);
            activeObject._objects[1].set("scaleY", scale);
            activeObject._objects[1].set("left", left);
            activeObject._objects[1].set("top", top);

            var clipRect = new fabric.Rect({
                originX: "left",
                originY: "top",
                left: activeObject.left,
                top: activeObject.top,
                width: activeObject.width,
                height: activeObject.height,
                angle: activeObject.angle,
                absolutePositioned: true,
            });

            activeObject.clipPath = clipRect;
            this.canvas.c.renderAll();
            activeObject.clipPath = "";
            this.canvas.c.renderAll();
            return;
        },
        // Generic property changes
        changeCommon(key, evt) {

            const activeObject = this.canvas.c.getActiveObjects()[0];
            if (!activeObject) return;

            let value;
            if (evt && evt.target) {
                value = Number(evt.target.value);
            } else {
                value = Number(evt);
            }

            if (['fill', 'stroke'].includes(key)) {
                activeObject.set(key, value);
                this.canvas.c.renderAll();
                return;
            }

            // Handle left and top properties
            if (['left', 'top'].includes(key)) {
                activeObject.set(key, value + this.canvas.editor.editorWorkspace.workspace[key]);
                this.canvas.c.renderAll();
                return;
            }

            if (key === "width" && this.imageShowMode === "clip") {
                // this.imgWidthClip(value);
                this.controlProductImage();
                return;
            }

            if (key === "height" && this.imageShowMode === "clip") {
                
                this.controlProductImage();
                //this.imgHeightClip(value);
                return;
            }

            if (key === "opacity") {
                activeObject && activeObject.set(key, value / 100);
                this.canvas.c.renderAll();
                return;
            }

            if (key === "angle") {
                activeObject.rotate(value);
                this.canvas.c.renderAll();
                return;
            }

            if (key === "round") {
                activeObject.set({ ry: value, rx: value });
                this.canvas.c.renderAll();
                return;
            }

            activeObject && activeObject.set(key, value);
            this.controlProductImage();
            this.canvas.c.renderAll();
        },
        // border settings

        borderSet(key) {
            const activeObject = this.canvas.c.getActiveObjects()[0];
            if (activeObject) {
                const stroke = this.strokeDashList.find((item) => item.label === key);
                activeObject.set(stroke.value);
                this.canvas.c.renderAll();
            }
        },
        insertEmpty(file, bgState) {
            var id = this.canvas.c.getActiveObject().id;
            var customType = this.canvas.c.getActiveObject().customType;

            var originLeft = this.canvas.c.getActiveObject().left;
            var originTop = this.canvas.c.getActiveObject().top;
            var originHeight = this.canvas.c.getActiveObject().height;
            var originWidth = this.canvas.c.getActiveObject().width;
            var originScaleX = this.canvas.c.getActiveObject().scaleX;
            var originScaleY = this.canvas.c.getActiveObject().scaleY;

            var rectLeft = this.canvas.c.getActiveObject()._objects[0].left;
            var rectTop = this.canvas.c.getActiveObject()._objects[0].top;
            var rectHeight = this.canvas.c.getActiveObject()._objects[0].height;
            var rectWidth = this.canvas.c.getActiveObject()._objects[0].width;
            var rectScaleX = this.canvas.c.getActiveObject()._objects[0].scaleX;
            var rectScaleY = this.canvas.c.getActiveObject()._objects[0].scaleY;

            var imageLeft = this.canvas.c.getActiveObject()._objects[1].left;
            var imageTop = this.canvas.c.getActiveObject()._objects[1].top;

            var imageScaleX = this.canvas.c.getActiveObject()._objects[1].scaleX;
            var imageScaleY = this.canvas.c.getActiveObject()._objects[1].scaleY;


            var item_name = this.canvas.c.getActiveObject().item_name;
            var flipX = this.canvas.c.getActiveObject().flipX;
            var flipY = this.canvas.c.getActiveObject().flipY;
            var angle = this.canvas.c.getActiveObject().angle;
            var opacity = this.canvas.c.getActiveObject().opacity;
            var layerShowPeriod = this.canvas.c.getActiveObject().layerShowPeriod;
            var position = this.canvas.c.getActiveObject().position;
            var originPoistion = this.canvas.c.getActiveObject().originPoistion;
            const imgEl = document.createElement("img");
            imgEl.src = file;
            document.body.appendChild(imgEl);
            imgEl.onload = () => {
                // Create a product image
                var tempImageLeft = this.canvas.c.getActiveObject()._objects[1]._objects[0].left;
                var tempImageTop = this.canvas.c.getActiveObject()._objects[1]._objects[0].top;
                var tempImageScaleX = this.canvas.c.getActiveObject()._objects[1]._objects[0].scaleX;
                var tempImageScaleY = this.canvas.c.getActiveObject()._objects[1]._objects[0].scaleY;

                var textLeft = this.canvas.c.getActiveObject()._objects[1]._objects[1].left;
                var textTop = this.canvas.c.getActiveObject()._objects[1]._objects[1].top;
                var textScaleX = this.canvas.c.getActiveObject()._objects[1]._objects[1].scaleX;
                var textScaleY = this.canvas.c.getActiveObject()._objects[1]._objects[1].scaleY;

                var tempImage = new this.fabric.Image(imgEl, {
                    id: id,
                    name: item_name,
                    item_name: item_name,
                    left: tempImageLeft,
                    top: tempImageTop,
                    scaleX: tempImageScaleX,
                    scaleY: tempImageScaleY
                });
                if (bgState != "productImage") {
                    var text = new this.fabric.IText(item_name, {
                        fontFamily: 'Courier New',
                        fontSize: 20,
                        fontWeight: "bold",
                        fill: "black",
                        left: textLeft,
                        top: textTop,
                        scaleX: textScaleX,
                        scralY: textScaleY,
                    });
                } else {
                    var text = new this.fabric.IText(item_name, {
                        fontFamily: 'Courier New',
                        fontSize: 20,
                        fontWeight: "bold",
                        fill: "white",
                        left: textLeft,
                        top: textTop,
                        scaleX: textScaleX,
                        scralY: textScaleY,
                    });
                }

                var imgInstance = new this.fabric.Group([tempImage, text]);
                imgInstance.set({
                    id: id,
                    customType: customType,
                    item_name: item_name,
                    left: imageLeft,
                    top: imageTop,
                    scaleX: imageScaleX,
                    scaleY: imageScaleY,
                    opacity: opacity,
                    dirty: true
                });

                var rect = new fabric.Rect({
                    left: rectLeft,
                    top: rectTop,
                    width: rectWidth,
                    height: rectHeight,
                    scaleX: rectScaleX,
                    scaleY: rectScaleY,
                    fill: "",
                    strokeWidth: 0,
                    opacity: 100,
                });

                var group = new fabric.Group([rect, imgInstance], {
                    id: id,
                    bgState: bgState,
                    item_name: item_name,
                    left: originLeft,
                    top: originTop,
                    width: originWidth,
                    height: originHeight,
                    scaleX: originScaleX,
                    scaleY: originScaleY,
                    layerShowPeriod: layerShowPeriod,
                    angle: angle,
                    customType: customType,
                    objectCaching: false,
                    position: position,
                    originPoistion: originPoistion,
                    flipX: flipX,
                    flipY: flipY
                });
                group.setControlsVisibility({
                    tl: false, // Hide top left point
                    bl: false, // Hide bottom left point
                    mtr: false, // Hide rotation control button
                });
                var objects = this.canvas.c.getObjects();
                if (customType == "prodcutImage") {
                    var productIndex = objects.findIndex((el) => {
                        return el.customType == "productImage";
                    });
                } else {
                    var productIndex = objects.findIndex((el) => {
                        return el.item_name == this.canvas.c.getActiveObject().item_name;
                    });
                }

                productIndex = productIndex + 1;
                this.canvas.c.remove(this.canvas.c.getActiveObject());
                this.canvas.c.add(group);
                this.canvas.c.setActiveObject(group);

                for (var i = 0; i < objects.length - productIndex; i++) {
                    const activeObject = this.canvas.c.getActiveObject();
                    activeObject && activeObject.sendBackwards();
                }

                imgEl.remove();
                this.canvas.c.renderAll();
                this.controlProductImage();
                this.fixTextPosition();

            };
        },
    },
    watch: {
        nonBgImageState() {
            if (this.changeProductImageState == false) {
                if (this.trimImageState == true && this.nonBgImageState == true) {
                    this.insertEmpty(trimandremove, "nonAndTrimImage");
                }
                if (this.trimImageState == false && this.nonBgImageState == true) {
                    this.insertEmpty(nonBgImage, "nonBgImage");
                }
                if (this.trimImageState == true && this.nonBgImageState == false) {
                    this.insertEmpty(trimImage, "trimBgImage");
                }
                if (this.trimImageState == false && this.nonBgImageState == false) {
                    this.insertEmpty(productImage, "productImage");
                }
            }

        },
        trimImageState() {
            if (this.changeProductImageState == false) {
                if (this.trimImageState == true && this.nonBgImageState == true) {
                    this.insertEmpty(trimandremove, "nonAndTrimImage");
                }
                if (this.trimImageState == false && this.nonBgImageState == true) {
                    this.insertEmpty(nonBgImage, "nonBgImage");
                }
                if (this.trimImageState == true && this.nonBgImageState == false) {
                    this.insertEmpty(trimImage, "trimBgImage");
                }
                if (this.trimImageState == false && this.nonBgImageState == false) {
                    this.insertEmpty(productImage, "productImage");
                }
            }
        }
    },
};
</script>

<style scoped lang="less">
.input-size {
    width: 20%;
}

// Button {
//     padding: 0px 5px;
// }

.box {
    width: 100%;
}

.lock-icons {
    margin-left: auto;
}

.flex-item {
    display: inline-flex;
    flex: 1;

    .label {
        width: 32px;
        height: 32px;
        line-height: 32px;
        display: inline-block;
        font-size: 14px;
        color: #333333;
    }
}
</style>

<style scoped>
.image-editor-date-label label {
    padding-top: 0 !important;
}

.image-editor-select {
    height: 2.242rem !important;
    background-position: calc(100% - 12px) 9px, calc(100% - 20px) 13px, 100% 0 !important;
}

.drag-and-drop {
    border: 1px solid #ddd;
    padding: 20px;
    text-align: center;
    margin-bottom: 10px;
    font-style: italic;
    font-size: 13px;
    border-radius: 5px;
}

.replaced-image img {
    object-fit: contain;
}
</style>