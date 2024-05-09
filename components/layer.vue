<template>
    <div class="layer">
        <draggable class="dragArea list-group w-full" :list="list" @change="log" :animation="300">
            <div v-for="(element, index) in list" :key="element.id" class="layer-row">
                <b-row >
                    <b-col md="6" class="d-flex align-items-center text-left">
                        <!-- Icon and Label -->
                        <pre>{{ element.text }}</pre>
                        <feather-icon icon="GridIcon" size="15" class="mr-1" />
                        <b-form-checkbox :id="'checkbox' + element.id" v-model="element.select" @change="changeSelect(element)">
                            <span @click="selectElem(element)">
                                {{ element.item_name }}
                                {{ element.customName }}
                            </span>
                        </b-form-checkbox>
                    </b-col>
                    <b-col md="6">
                        <div class="text-right">
                            <b-button variant="outline-secondary" v-b-tooltip.hover title="Click to unlock or lock" v-if="element.lock" @click="doLock(element.id)" size="sm">
                                <feather-icon icon="LockIcon"/>
                            </b-button>
                            <b-button variant="outline-secondary" v-b-tooltip.hover title="Click to unlock or lock" v-else @click="doLock(element.id)" size="sm">
                                <feather-icon icon="UnlockIcon"/>
                            </b-button>

                            <b-button variant="outline-secondary" v-b-tooltip.hover title="Click to view or unview" v-if="element.view" @click="doView(element.id)" size="sm">
                                <feather-icon icon="EyeIcon" />
                            </b-button>
                            <b-button variant="outline-secondary" v-b-tooltip.hover title="Click to view or unview" v-else @click="doView(element.id)" size="sm">
                                <feather-icon icon="EyeOffIcon"/>
                            </b-button>

                            <b-dropdown id="dropdown-1" text="..." size="sm">
                                <b-dropdown-item @click="clone(element.id)">
                                    <feather-icon icon="CopyIcon" size="15"/>&nbsp; Duplicate layer
                                </b-dropdown-item>
                                <b-dropdown-item @click="del(element.id)">
                                    <feather-icon icon="DeleteIcon" size="15"/>&nbsp; Delete</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </draggable>
        <!-- <group></group> -->
    </div>
</template>
<style scoped>
.layerBox {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    border-radius: 5px;
    border: solid 1px rgb(214, 213, 213);
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    cursor: pointer;
}

.hover_class {
    visibility: hidden;
}

.layerBox:hover .hover_class {
    visibility: visible;
    color: red;
}

.layer-row {
    border: 1px solid #ddd;
    margin-bottom: 15px;
    padding-left: 15px;
}
</style>
<script>
import select from '@editor/mixins/select';
import draggable from 'vuedraggable'
import dele from "./del.vue";
import clone from "./clone.vue";
// import group from "./group.vue";

import { v4 as uuid } from 'uuid';
const lockAttrs = [
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
];
export default {
    name: 'ToolBar',
    mixins: [select],
    props: ['mSelectOneTypeProps'],
    components: {
        draggable: draggable,
        dele,
        clone,
        // group
    },
    data() {
        return {
            isLock: false,
            isView: true,
            enabled: true,
            list: [],
            tempList: '',
            dragging: false,
        }
    },
    created() {
        // When selecting an object in the canvas, the object does not appear on top.
        this.canvas.c.preserveObjectStacking = true;
        this.canvas.c.on('after:render', this.getList);

    },
    mounted() {
        setTimeout(() => {
            this.tempList = this.list.map(item => {
                return item;
            });
        }, 500);
    },
    methods: {
        changeSelect(item) {
            this.canvas.c.discardActiveObject();
            var aaa = this.list.filter(item => {
                if (item.select == true) {
                    return item;
                }
            });
            var c = [];
            this.canvas.c.getObjects().forEach(arg => {
                aaa.forEach(arg1 => {
                    if (arg.id == arg1.id) {
                        c.push(arg);
                    }
                })
            })

            if (c.length == 1) {
                return false;
            } else {
                var gfg = new fabric.ActiveSelection(c, {
                    canvas: this.canvas.c,
                });
                this.canvas.c.setActiveObject(gfg);
                this.canvas.c.requestRenderAll();
            }


        },
        selectElem(item) {
            this.canvas.c.setActiveObject(item);
            this.canvas.c.requestRenderAll();
        },
        checkLock() {
            return true;
        },
        doView(id) {
            this.list.forEach((arg) => {
                if (arg.id == id) {
                    arg.view ? this.view(arg) : this.unView(arg);
                }
            });
        },
        view(item) {
            item.set('opacity', (0 / 100));
            this.canvas.c.renderAll();
        },
        unView(item) {
            item.set('opacity', (100 / 100));
            this.canvas.c.renderAll();
        },
        doLock(id) {
            this.list.forEach((arg) => {
                if (arg.id == id) {
                    arg.lock ? this.unLock(arg) : this.lock(arg);
                }
            });

        },
        lock(item) {
            // Modify custom properties
            item.hasControls = false;
            // Modify default properties
            lockAttrs.forEach((key) => {
                item[key] = true;
            });
            item.selectable = false;
            this.canvas.c.renderAll();
        },
        unLock(item) {
            // Modify custom properties
            item.hasControls = true;
            // Modify default properties
            lockAttrs.forEach((key) => {
                item[key] = false;
            });
            item.selectable = true;
            this.canvas.c.renderAll();
        },

        clone(id) {
            if (id == "productImage" || id == "trimImage" || id == "nonBgImage") {
                return false;
            }

            var item = this.list.filter((arg) => {
                return arg.id == id;
            });

            item[0].clone((cloned) => {

                // Spacing settings
                const grid = 10;
                var item_name = this.canvas.editor.getNameClone(item[0].item_name);
                cloned.set({
                    left: cloned.left + grid,
                    top: cloned.top + grid,
                    id: uuid(),
                    layerShowPeriod: item[0].layerShowPeriod,
                    item_name: item_name
                });

                this.canvas.c.add(cloned);
                this.canvas.c.discardActiveObject();
                this.canvas.c.setActiveObject(cloned);
                this.canvas.c.requestRenderAll();
            })
        },
        del(id) {
            if (id == "productImage" || id == "trimImage" || id == "nonBgImage") {
                return false;
            } else {
                const activeObject = this.canvas.c.getObjects();
                if (activeObject) {
                    activeObject.map((item) => {
                        if (item.id == id) {
                            this.canvas.c.remove(item);
                        }
                    });
                }
            }

            this.canvas.c.requestRenderAll();
            this.canvas.c.discardActiveObject();
        },
        //for drag and drop
        onMoveCallback(evt, originalEvent) {
        },
        log(event, original) {
            var arr = { id: '', index: 0, direction: "", moveCount: 0 };
            //after search element's move and re-render
            for (var i = 0; i < this.tempList.length; i++) {
                var tempIn = this.list.findIndex(arg => this.tempList[i].id == arg.id);
                if (Math.abs(tempIn - i) > arr.index) {
                    arr.index = tempIn;
                    arr.id = this.tempList[i];
                    arr.moveCount = Math.abs(tempIn - i)

                    if (tempIn - i > 0) {
                        arr.direction = "down";
                    } else {
                        arr.direction = "up"
                    }
                }
            };

            if (arr.direction == "up") {
                for (var i = 0; i < arr.moveCount; i++) {
                    this.tempList = this.list.map(item => item);
                    this.canvas.editor.up(arr.id);
                }
            } else {
                for (var i = 0; i < arr.moveCount; i++) {
                    this.tempList = this.list.map(item => item);
                    this.canvas.editor.down(arr.id);
                }
            }
        },
        getList() {

            if (this.mSelectMode == "one") {
                this.list = [...this.canvas.c.getObjects()]
                .reverse()
                .map((item, index) => {
                    
                    item.select = false;
                    if (item.opacity == 0) {
                        item.view = false;
                    } else {
                        item.view = true;
                    }
                    if (item.hasControls == false && item.selectable == false) {
                        item.lock = true;
                    } else {
                        item.lock = false;
                    }
                    
                    return item;
                })
                .filter((item) => {
                    return item.id !== 'workspace'
                });
                
            } else {

                //multiple mode
                this.list = [...this.canvas.c.getObjects()]
                .reverse()
                .map((item) => {

                    if(item.customType === 'text') {
                        item.customName = item._objects[1].get('text');
                    }

                    item.select = false;
                    this.canvas.c.getActiveObjects().forEach(arg => {
                        if (arg.id == item.id) {
                            item.select = true;
                        }
                    })
                    if (item.opacity == 0) {
                        item.view = false;
                    } else {
                        item.view = true;
                    }
                    if (item.hasControls == false && item.selectable == false) {
                        item.lock = true;
                    } else {
                        item.lock = false;
                    }
                    
                    return item;
                })
                .filter((item) => {
                    return item.id !== 'workspace'
                });
                    
            }
        },
        //for drag and drop
    }
}
</script>

<style lang="less" scoped>
.ivu-select-dropdown {
    z-index: 1000;
}

.layer-row {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom : 15px;
    cursor: pointer;
}
</style>