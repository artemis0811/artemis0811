<template>
    <div class="shape-type">
        <div v-show="shapeType.includes(mSelectOneTypeProps[0])" style="">
            <!-- control part -->
            <b-row class="mb-1">
                <b-col md="2">Size</b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="width">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.width" @change="(value) => changeCommon('width', value)"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="height">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.height" @change="(value) => changeCommon('height', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            
            <!-- --------------------- Position ----------------------->
            <b-row class="mb-1">
                <b-col md="2">Position</b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="horizontal(X)">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.left" @change="(value) => changeCommon('left', value)"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col md="5">
                    <b-input-group size="sm" append="vertical(Y)">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.top" @change="(value) => changeCommon('top', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <!-- --------------------- End Position ----------------------->
        
            <!-- control part -->
            <b-row class="mb-1">
                <b-col>Rotate</b-col>
                <b-col>
                    <b-input-group size="sm" append="px">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.angle" :max="360" @change="(value) => changeCommon('angle', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <b-row v-show="rectType.includes(mSelectOneTypeProps[0])" class="mb-1">
                <b-col>Round Corner</b-col>
                <b-col>
                    <b-input-group size="sm" append="px">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.round" :max="360" @change="(value) => changeCommon('round', value)"></b-form-input>
                    </b-input-group>
                    <!-- <b-input-group size="md" append="y">
                        <b-form-input
                            autocomplete="off"
                            type="number"
                            v-model="baseAttr.top"
                            @change="newValue => changeCommon('top', newValue)"
                        ></b-form-input>
                    </b-input-group> -->

                </b-col>
                </b-col>
            </b-row>

            <!-- shape fill -->
            <b-row class="mb-1">
                <b-col md="2">Fill</b-col>
                <b-col md="3" class="text-right">
                    <!-- this is for checkbox (swtich) -->
                    <b-form-checkbox v-model="fillState" @change="changeFillState" class="custom-control-success mr-0" name="fill" switch inline></b-form-checkbox>
                </b-col>
                <b-col md="2" v-if="fillState" >Color</b-col>
                <b-col md="5" v-if="fillState" >
                    <b-form-input type="color" v-model="baseAttr.fill" @change="(value) => changeCommon('fill', value)" size="sm"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="mb-1">
                <b-col md="2">Border</b-col>
                <b-col md="3" class="text-right">
                    <b-form-checkbox v-model="borderState" @change="changeBorderState" class="custom-control-success mr-0" name="border" switch inline></b-form-checkbox>
                </b-col>
                <b-col md="2" v-if="borderState">Color</b-col>
                <b-col md="5" v-if="borderState">
                    <b-form-input type="color" v-model="baseAttr.stroke" @change="(value) => changeCommon('stroke', value)" size="sm"></b-form-input>
                </b-col>
            </b-row> 
            <!-- shape fill -->
            <!-- shape border -->
            <b-row class="mb-1">
                <b-col>Line thickness</b-col>
                <b-col>
                    <b-input-group size="sm" append="px">
                        <b-form-input autocomplete="off" type="number" v-model="baseAttr.strokeWidth" :max="360" @change="(value) => changeCommon('strokeWidth', value)"></b-form-input>
                    </b-input-group>
                </b-col>
            </b-row>
            <!-- <b-row class="mb-1">
                <b-col>Replace</b-col>
                <b-col class="text-right">
                    <b-form-checkbox v-model="replace" @change="handleReplace" class="custom-control-success mr-0" name="fill" switch inline></b-form-checkbox>
                </b-col>
            </b-row> -->
            <!-- <b-row>
                <b-col>Light On</b-col>
                <b-col class="text-right">
                    <b-form-checkbox v-model="lightOn" @change="handleLightOn" class="custom-control-success mr-0" name="fill" switch inline></b-form-checkbox>
                </b-col>
            </b-row> -->
            <!-- shape border -->
        </div>
    </div>
</template>

<script>
import select from '@editor/mixins/select';
import Color from './color.vue';
import background from './background.vue'

export default {
    mixins: [select],
    props: ['mSelectOneTypeProps'],
    components: {
        Color, background
    },
    data() {
        return {
            lightOn : null, 
            replace : null,
            loading1: false,
            borderState: false,
            fillState: false,
            showState: false,
            borderState: false,
            // common element
            baseType: [
                'text',
                'i-text',
                'textbox',
                'triangle',
                'image',
                'group',
                'line',
                'arrow',
                "rect",
                "circle"
            ],
            shapeType: ["rect", "circle", "ellipse", "triangle", "polygon", "line", "path"],
            rectType: ["rect"],
            circleType: ["circle"],
            triangleType: ["triangle"],

            // general properties
            baseAttr: this.mSelectOneTypeProps[1],
        };
    },
    mounted() {
        this.canvas.c.on("object:scaling", (opt) => {
            var currObj = this.canvas.c.getActiveObject();
           
            if (currObj.type === 'rect') {
                var newWidth    = currObj.width * currObj.scaleX,
                    newHeight   = currObj.height * currObj.scaleY;

                currObj.set({
                    'width': newWidth,
                    'height': newHeight,
                    scaleX: 1,
                    scaleY: 1
                });

                this.baseAttr.width     = newWidth;
                this.baseAttr.height    = newHeight;

            } else if (currObj.type === 'circle') { 

                var newRadius = currObj.radius * currObj.scaleX; // Assuming uniform scaling
                currObj.set({
                    'radius': newRadius,
                    scaleX: 1,
                    scaleY: 1
                });

                // Update baseAttr for circle (width and height are twice the radius)
                this.baseAttr.width = newRadius * 2;
                this.baseAttr.height = newRadius * 2;
            }
            this.canvas.c.renderAll();
        });

        this.canvas.c.on("object:moving", (opt) => {
            this.baseAttr.left = this.canvas.c.getActiveObject().left - this.canvas.editor.editorWorkspace.workspace.left;
            this.baseAttr.top = this.canvas.c.getActiveObject().top - this.canvas.editor.editorWorkspace.workspace.top;
        });
        this.event.on('selectOne', (items) => {
            // base
            var activeObject = this.canvas.c.getActiveObjects()[0];
            this.baseAttr.round = activeObject.get('rx');
            this.baseAttr.height = activeObject.get('height');
            this.baseAttr.width = activeObject.get('width');
            this.baseAttr.opacity = activeObject.get('opacity') * 100;

            if(activeObject.customType === 'text'){
                // get rect element from group for border and fill properties
                const rectObject = activeObject.getObjects().filter((obj)=> obj.type === 'rect')[0];
                if(rectObject){
                    this.baseAttr.fill = rectObject.get('fill');
                    this.baseAttr.stroke = rectObject.get('stroke');
                    this.baseAttr.strokeWidth = rectObject.get('strokeWidth');
                }
            } else {
                this.baseAttr.fill = activeObject.get('fill');
                this.baseAttr.stroke = activeObject.get('stroke');
                this.baseAttr.strokeWidth = activeObject.get('strokeWidth');
            }
        
            this.baseAttr.left = activeObject.get("left") - this.canvas.editor.editorWorkspace.workspace.left;
            this.baseAttr.top = activeObject.get("top") - this.canvas.editor.editorWorkspace.workspace.top;
            
            this.baseAttr.shadow = activeObject.get('shadow') || {};
            this.baseAttr.angle = activeObject.get('angle') || 0;

            // Update fillState and borderState
            this.fillState = !!this.baseAttr.fill;
            this.borderState = !!this.baseAttr.stroke && this.baseAttr.strokeWidth > 0;
            
            // this.initSet()
        });
    },
    methods: {
        handleLightOn() {

        },
        handleReplace(e) {
            this.replace = e;
            this._updateReplace();
            this.$emit('selectCancel');
        },
        initSet() {
            var activeObject = this.canvas.c.getActiveObject();
            if (activeObject != null) {

                //<---------------fill of rect setting ------------->
                if (activeObject.fill == "#ffffff") {
                    this.fillState = false

                } else {
                    this.fillState = true;
                    this.baseAttr.fill = activeObject.fill;
                }
                //<---------------fill of rect setting ------------->

                // if(activeObject.)  filter portion

                // <---------border of rect setting ---------->
                if (activeObject.stroke != null) {
                    this.borderState = true;
                    this.baseAttr.stroke = activeObject.stroke;
                } else {
                    this.borderState = false
                }
                if (activeObject.strokeWidth != 0) {
                    this.borderState = true;
                    this.baseAttr.strokeWidth = activeObject.strokeWidth;
                } else {
                    this.borderState = false
                }
                // <---------border of rect setting ---------->
            }
        },
        changeFillState(value) {
            if (value == false) {
                const activeObject = this.canvas.c.getActiveObject();
                activeObject.set('fill', 'transparent');
                this.baseAttr.fill = '';
                this.canvas.c.renderAll();
            }
        },

        changeBorderState(value) {
            if (value == false) {
                const activeObject = this.canvas.c.getActiveObject();
                activeObject.set('stroke', '');
                activeObject.set('strokeWidth', 0);
                this.baseAttr.strokeWidth = 0;
                this.baseAttr.stroke = '';
                this.canvas.c.renderAll();
            }
        },

        showBorder() {
            this.baseAttr.borderState ? this.baseAttr.borderState = false : this.baseAttr.borderState = true;
            const activeObject = this.canvas.c.getActiveObjects()[0];
            activeObject.set("borderState", this.baseAttr.borderState);
            this.canvas.c.renderAll();
        },
        showFill() {
            this.baseAttr.fillState ? this.baseAttr.fillState = false : this.baseAttr.fillState = true;
            const activeObject = this.canvas.c.getActiveObjects()[0];
            activeObject.set("fillState", this.baseAttr.fillState);
            this.canvas.c.renderAll();
        },
        changeCommon(key, value) {
    const activeObject = this.canvas.c.getActiveObjects()[0];
    
    if (!activeObject) {
        return;
    }

    if (key === 'fill' || key === 'stroke') {
        activeObject.set(key, value);
    } else if (key === 'opacity') {
        const opacityValue = typeof value === 'number' ? value / 100 : Number(value) / 100;
        activeObject.set(key, opacityValue);
    } else if (key === 'angle') {
        activeObject.rotate(Number(value));
    } else if (key === 'round') {
        activeObject.set("ry", Number(value))
        activeObject.set("rx", Number(value))
    } else if (key === 'strokeWidth') {
        activeObject.set('strokeWidth', Number(value));
    } else if (['left', 'top'].includes(key)) {
        activeObject.set(key, Number(value) + this.canvas.editor.editorWorkspace.workspace[key]);
    } else {
        activeObject.set(key, Number(value));
    }
    
    this.canvas.c.renderAll();
},

    }
}
</script>
<style scoped>
.input-size {
    width: 20%
}
</style>