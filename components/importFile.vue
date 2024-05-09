<template>
    <div>
        <b-dropdown-item href="#" @click="insertImg">Upload image</b-dropdown-item>
        <b-dropdown-item href="#" @click="loadTemplate">Templates</b-dropdown-item>
        <b-dropdown-item href="#" @click="loadElement">Elements</b-dropdown-item>
        <b-dropdown-item href="#" @click="loadProductImage">Product image</b-dropdown-item>

        <b-modal id="template" centered v-model="template" title="Choose the Template" :footer-hide="true" size="lg" :hide-footer="true">
            <header class="mb-1">
                <b-row>
                    <b-col>
                        <b-form-input placeholder="Enter word for search" v-model="keyword_template"></b-form-input>
                    </b-col>
                    <b-col>
                        <select class="form-control" v-model="selected_template_type" @change="groupChange">
                            <option v-for="item in group_types_template" :value="item" :key="item">{{ item }}</option>
                        </select>
                    </b-col>
                </b-row>
            </header>
            <b-overlay :show="loading" rounded="sm">
                <b-row>
                    <b-col md="2" v-for="(item, index) in filterResultDemoLists" :key="index">
                        <div class="image-box" :imgId="item.id" @click="() => insertDemoTemplate(item.id_template)">
                            <img v-bind:src="item.image_url" id="images0" />
                            <h5 v-if="item.template_name" class="text-left mt-1">{{ item.template_name }}</h5>
                            <p v-if="item.template_des" class="text-sm mb-0 text-left">{{ item.template_des }}</p>
                        </div>
                    </b-col>
                </b-row>
            </b-overlay>
        </b-modal>

        <b-modal id="elements" centered v-model="element" title="Choose the Element" :footer-hide="true" size="lg" :hide-footer="true">
            <header class="mb-1">
                <b-row>
                    <b-col>
                        <b-form-input placeholder="Enter word for search" v-model="keyword_element"></b-form-input>
                    </b-col>
                    <b-col>
                        <select class="form-control" v-model="selected_element_type" @change="elementChange" size="sm">
                            <option v-for="item in group_types_element" :value="item" :key="item">{{ item }}</option>
                        </select>
                    </b-col>
                </b-row>
            </header>
            <b-overlay :show="loading" rounded="sm">
                <b-row>
                    <b-col md="2" v-for="(item, index) in filterResultElementLists" :key="index" class="align-self-start">
                        <div class="image-box" :imgId="item.id" @click="() => insertElement(item.id_element)">
                            <img v-bind:src="item.image_url" style="width:150px;height:150px;" id="images0" />
                            <h5 v-if="item.element_name" class="text-left mt-1">{{ item.element_name }}</h5>
                            <p v-if="item.element_des" class="text-sm mb-0 text-left">{{ item.element_des }}</p>
                        </div>
                    </b-col>
                </b-row>
            </b-overlay>
        </b-modal>

        <b-modal id="product-image" centered v-model="product" title="Choose the Product" :footer-hide="true" size="lg" :hide-footer="true">
            <header class="mb-1">
                <b-row>
                    <b-col>
                        <b-form-input placeholder="Enter word for search" v-model="keyword_product"></b-form-input>
                    </b-col>
                </b-row>
            </header>

            <Loader :active="loading" class="child" />
        
            <b-row>
                <b-col md="3" v-for="(item, index) in filterResultProductLists" :key="index" class="align-self-start">
                    <div v-if="item.active === true" class="image-box" :imgId="item.id"
                        @click="() => insertProduct(item)">
                        <img v-bind:src="item.image_url" id="images0" />
                        <h5 class="text-left mt-1">{{ item.name }}</h5>
                    </div>
                    <div v-if="item.active === false" class="image-box" :imgId="item.id"
                        style="background-color: #c7c7c7;cursor:no-drop">
                        <img v-bind:src="item.image_url" id="images0" />
                        <h5 class="text-left mt-1">{{ item.name }}</h5>
                    </div>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>
<script>

import { getImgStr, selectFiles } from '@editor/utils/utils';
import select from '@editor/mixins/select';
import { v4 as uuid } from 'uuid';
import { productImage } from '@editor/utils/imgConstant';
import Loader from "./loader1.vue";
import OpenType from 'opentype.js'
import { http } from '@/services/requests';

export default {
    name: 'ToolBar',
    mixins: [select],
    inject: ["path", "param_id"],
    data() {
        return {
            element: false,
            template: false,
            product: false,
            loading: false,
            border: true,
            hover: true,
            selected_template_type: 'All templates',
            selected_element_type: 'All elements',
            keyword_template: '',
            keyword_element: '',
            keyword_product: '',
            group_types_template: '',
            group_types_element: '',
            demoTempLists: '',
            filterResultDemoLists: '',
            elementLists: '',
            filterResultElementLists: '',
            productLists: '',
            filterResultProductLists: '',
            loaderActive: true, 
            allTemplates : [],
            allElements : [],
        };
    },
    components: {
        Loader
    },

    created() {
        this.event.on('selectOne', (items) => {
            this.isLock = !items[0].hasControls;
            this.mSelectActive = items[0];
        });
    },

    mounted() {

        const image_id = this.$route.params.id;
        if (this.path.includes('create')) {
            this.insertProductImage(productImage, {
                id: uuid(),
                name:"image_link",
                item_name:"image_link",
                image_url:"image_link",
                customType:"productImage"
            });
        } else {
            this.insertFileFromJSON(image_id);
        }
    },

    methods: {
        groupChange(evt) {
           
            let selected_value = evt.target.value;

            if (selected_value == "All templates") {
                this.filterResultDemoLists = this.demoTempLists;
            } else {
                this.filterResultDemoLists = this.filterDemoTempLists('type', selected_value);
            }
        },
        elementChange(evt) {
            let selected_value = evt.target.value;

            if (selected_value == "All elements") {
                this.filterResultElementLists = this.elementLists;
            } else {
                this.filterResultElementLists = this.filterElementLists('type', selected_value);
            }
        },
        filterElementLists(search_type, value) {
            if (this.elementLists != '') {
                if (search_type == 'keyword') {
                    let filteredElementLists = this.elementLists.filter((el) => {
                        return el.name.toLowerCase().includes(value);
                    })
                    let orderedElementLists = filteredElementLists.sort((a, b) => {
                        return b.upvoted - a.upvoted;
                    })
                    return orderedElementLists;
                } else {
       
                    let filteredElementLists = this.elementLists.filter((el) => {
                        if(el.group_type) {
                            return el.group_type.toLowerCase().includes(value);
                        }
                    })
                    let orderedElementLists = filteredElementLists.sort((a, b) => {
                        return b.upvoted - a.upvoted;
                    });
                    return orderedElementLists;
                }
            }
        },
        filterProductLists(value) {
            if (this.productLists != '') {
                let filteredProductLists = this.productLists.filter((el) => {
                    return el.name.toLowerCase().includes(value);
                })
                let orderedProductLists = filteredProductLists.sort((a, b) => {
                    return b.upvoted - a.upvoted;
                })
                return orderedProductLists;
            }
        },
        filterDemoTempLists(search_type, value) {

            if (this.demoTempLists != '') {
                if (search_type == 'keyword') {
                    let filteredDemoLists = this.demoTempLists.filter((el) => {
                        return el.name.toLowerCase().includes(value);
                    })
                    let orderedDemoLists = filteredDemoLists.sort((a, b) => {
                        return b.upvoted - a.upvoted;
                    })
                    return orderedDemoLists;
                } else {
                    let filteredDemoLists = this.demoTempLists.filter((el) => {
                        return el.group_type.toLowerCase().includes(value);
                    })
                    let orderedDemoLists = filteredDemoLists.sort((a, b) => {
                        return b.upvoted - a.upvoted;
                    });
                    return orderedDemoLists;
                }
            }
        },
        canvasUpdateByJson(jsonFile) {
            this.canvas.c.loadFromJSON(jsonFile, () => {
                this.canvas.c.renderAll.bind(canvas.c);
                const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
                const { left, top, width, height } = workspace;
                workspace.set('selectable', false);
                workspace.set('hasControls', true);
                this.canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
                this.canvas.c.renderAll();
                this.canvas.c.requestRenderAll();
            });

        },
        loadFonts(fontLists) {
            
            if (!window.globalFonts) {
                window.globalFonts = fontLists;
            } else {
                var temp = [...window.globalFonts, ...fontLists];
                window.globalFonts = Array.from(new Set(temp.map(JSON.stringify)), JSON.parse);
            }
            window.globalFonts.forEach(el => {
                if (el.ttf_base64 && el.ttf_base64 !== '') {
                    const charArray = el.ttf_base64.split('').map(function (char) {
                        return char.charCodeAt(0);
                    });

                    const uint8Array = new Uint8Array(charArray);
                    const fontBuffer = uint8Array.buffer;
                    const font = OpenType.parse(fontBuffer);
                    var fontName = font.names.fontFamily.en;
                    var fontFace = new FontFace(fontName, fontBuffer);
                    document.fonts.add(fontFace);
                }
            });
        },
        async get_user_template_by_id(id) {

            if (!id) {
                this.showToast('danger', 3000, 'Alert', 'Template id is missing.');
                return Promise.reject('Template id is missing.');
            }

            if (!this.$route.params.token) {
                this.showToast('danger', 3000, 'alert', 'Project token is missing.');
                return Promise.reject('Project token is missing.');
            }

            return await http.get('editor/user-template/' + this.$route.params.token + '/' + id)
            .then((response) => {
                if (response.data.success && response.data.user_template) {

                    let templateData = response.data.user_template;
                    
                    let templateJson    = JSON.parse(templateData.template_json);
                    let templateName    = templateData.template_name;
                    let templaeSize     = templateData.template_size;
                    let role            = templateData.role;
                    
                    this.$emit('templateInfo', {
                        isTemplateOwner : role === 'owner' ? true : false,
                        templateName    : templateName, 
                        templateSize    : templaeSize, 
                        isLoaded        : true,
                    })
                    return templateJson;
                } else {
                    this.showToast('warning', 3000, 'Alert', 'Could not found any image builder.');
                    setTimeout(() => {
                        this.$router.push({ name: 'image-builder' });
                    }, 3000);
                    return Promise.reject('No user template found.');
                }
            })
            .catch((error) => {
                // Handle errors
                return Promise.reject(error);
            });
        },
        async insertFileFromJSON(id) {
            let data = await this.get_user_template_by_id(id);

            if(!data) {
                this.showToast('danger', 3000, 'Alert', 'Template data is missing.');
                return;
            };

            document.getElementById("canvasName").value = data.name;
            
            if (data.fontLists) {
                this.loadFonts(data.fontLists);
            }

            var jsonFile = JSON.stringify(data);

            console.log(jsonFile)

            this.canvas.c.loadFromJSON(jsonFile, () => {
                this.canvas.c.renderAll.bind(canvas.c);
                const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
                const { left, top, width, height } = workspace;
                workspace.set('selectable', false);
                workspace.set('hasControls', true);
                this.canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
                this.canvas.c.requestRenderAll();
                this.canvas.c.renderAll();
            });
            
        },
        async get_template_by_id(id) {
            if (!id) return null;
            try {
                this.loading  = true;
                const response = await http.get('editor/get-templates/' + this.$route.params.token + '/' + id);
                if (response.data.success) {
                    let template_json = response.data.template_json.template_json;
                    if (template_json) {
                        this.loading  = false;
                        return JSON.parse(template_json);
                    } else {
                        this.loading  = false;
                        return null;
                    }
                } else {
                    this.loading  = false;
                    return null;
                }
            } catch (error) {
                this.showToast('danger', 3000, 'Alert', error);
                return null;
            }
        },
        async insertDemoTemplate(id) {

            const data      = await this.get_template_by_id(id);
            if(!data) {
                this.showToast('danger', 3000, 'Alert', 'Template data is missing.');
                return;
            }

            var jsonFile    = JSON.stringify(data);
            if(data.hasOwnProperty('fontLists')) {
                this.loadFonts(data.fontLists);
            }

            this.canvasUpdateByJson(jsonFile);
            document.getElementById("canvasName").value = 'test';
            this.template = false;
        },
        async get_element_by_id(id) {

            if (!id) return null;

            try {
                this.loading  = true;
                const response = await http.get('editor/get-elements/' + this.$route.params.token + '/' + id);
                if (response.data.success) {
                    let element_json = response.data.element_json.element_json;
                    if (element_json) {
                        this.loading  = false;
                        return JSON.parse(element_json);
                    } else {
                        this.loading  = false;
                        return null;
                    }
                } else {
                    this.loading  = false;
                    return null;
                }
            } catch (error) {
                this.showToast('danger', 3000, 'Alert', error);
                return null;
            }
        },
        async insertElement(id) {

            if(!id) return;

            var data    = await this.get_element_by_id(id)

            if(!data) {
                this.showToast('danger', 3000, 'Alert', 'Element data is missing.');
                return;
            }

            var index   = 0;
            var dataUrl = this.canvas.editor.getJson();

            if (data.type == "background") {
                var data = data.objects.forEach((item) => {
                    if (item.id != "workspace") {
                        dataUrl.objects = [
                            ...dataUrl.objects.slice(0, index),
                            item,
                            ...dataUrl.objects.slice(index)
                        ];
                    }
                    index++;
                });
            } else {
                
                data.objects.forEach((item) => {
                    if (item.id != "workspace") {
                        dataUrl.objects.push(item);
                    }
                });
            }

            this.loadFonts(data.fontLists);
            this.canvasUpdateByJson(dataUrl);
            setTimeout(() => {
                var temp = [];
                var objs = this.canvas.c.getObjects();
               
                for (var i = objs.length - 1; i > objs.length - data.objects.length; i--) {
                    temp.push(objs[i]);
                }
                var gfg = new fabric.ActiveSelection(temp, {
                    canvas: this.canvas.c,
                });
                this.canvas.c.centerObject(gfg);
                this.canvas.c.setActiveObject(gfg);
                this.canvas.c.requestRenderAll();
                this.element = false;
            }, 200);
        },

        insertProduct(obj) {
            obj.customType = "extra_product";
            this.insertProductImage(productImage, obj);
            this.product = false;
        },
        async loadTemplate() {

            this.template       = true;
            this.loading        = true;
            this.allTemplates   = [];

            // const data = get_all_temps();
            await http.get('editor/get-templates/' + this.$route.params.token )
            .then((response) => {
                if(response.data.success) {
                    if(Array.isArray(response.data.templates) && response.data.templates.length) {
                        response.data.templates.forEach((template) => {
                            this.allTemplates.push(template);
                        });
                    }
                } else {
                    this.showToast('warning', 3000, 'Alert', response.data.message ? response.data.message : 'Could not found any templates.')
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error);
            });

            var data = this.allTemplates;
            var templist = new Array();
            var tempTypes = [];

            if (data) {
                data.forEach((e, i) => {

                    if (i == 0) {
                        tempTypes.push("All templates");
                    }

                    var id              = e.id;
                    var id_template     = e.id_template;
                    var name            = e.name;
                    var image_url       = e.template_preview_image;

                    var template_name   = e.template_name;
                    var template_des    = e.template_description;
                    var group_type      = e.group_type;

                    if(group_type) {
                        if (tempTypes.includes(group_type) == false) {
                            tempTypes.push(group_type)
                        }
                    }
                    
                    templist.push({
                        id: id,
                        id_template : id_template,
                        group_type: group_type,
                        name: name,
                        image_url: image_url, 
                        template_name : template_name,
                        template_des : template_des
                    });
                });

                this.group_types_template = tempTypes;
                this.demoTempLists = templist;
                this.filterResultDemoLists = templist;
                this.loading = false;
            }
            this.loading = false;
        },

        async loadElement() {

            this.element        = true;
            this.loading        = true;
            this.allElements    = [];
            
            let data = await http.get('editor/get-elements/' + this.$route.params.token)
            .then((response) => {
                if(response.data.success) {
                    if(Array.isArray(response.data.elements) && response.data.elements.length) {
                        response.data.elements.forEach((element) => {
                            this.allElements.push(element);
                        });
                    }
                } else {
                    this.showToast('warning', 3000, 'Alert', response.data.message ? response.data.message : 'Could not found any elements.')
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error);
            });

            data            = this.allElements;
            var templist    = new Array();
            var tempTypes   = [];

            if (data) {
                data.forEach((e, i) => {
                    
                    if (i == 0) {
                        tempTypes.push("All elements");
                    }
                    
                    var id          = e.id;
                    var id_element  = e.id_element; 
                    var name        = e.name;
                    var image_url   = e.element_preview_image;
                    
                    var group_type      = e.group_type;
                    var element_name    = e.element_name;
                    var element_des     = e.element_description;

                    if(group_type) {
                        if (tempTypes.includes(group_type) == false) {
                            tempTypes.push(group_type)
                        }
                    }
                    
                    templist.push({
                        id              : id,
                        id_element      : id_element,
                        name            : name,
                        image_url       : image_url,
                        group_type      : group_type,
                        element_name    : element_name,
                        element_des     : element_des
                    });

                });

                this.group_types_element        = tempTypes;
                this.elementLists               = templist;
                this.filterResultElementLists   = templist;
            }
            this.loading = false

            await (this.loading = false);
        },
        async loadProductImage() {

            this.product = true;
            this.loading = true;

            let data = await http.get('editor/product-images/' + this.$route.params.token)
            .then((response) => {
                if(response.data.success) {
                    return response.data.image_fields;
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error)
            });

            var templist = new Array();

            if (data) {
                data.forEach((e) => {
   
                    var id = e;
                    var name = e;
                    var image_url = productImage;
                    var active = true;

                    // var extra_product = this.canvas.c.getObjects().filter(arg => {
                    //     return arg.customType == "extra_product";
                    // });

                    // if (extra_product) {
                    //     extra_product.forEach(arg => {
                    //         if (arg.id == data[i].id) {
                    //             active = false;
                    //             return;
                    //         }
                    //     });
                    // }

                    templist.push({
                        id: id,
                        name: name,
                        image_url: image_url,
                        active: active
                    });
                });
                this.productLists = templist;
                this.filterResultProductLists = templist;
            }

            await (this.loading = false);

        },
        insert() {
            selectFiles({ accept: '.json' }).then((files) => {
                const [file] = files;
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = () => {
                    this.insertSvgFile(reader.result);
                };
            });
        },

        // insert picture
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

        // insert empty file
        insertProductImage(file, obj) {
            setTimeout(() => {

                const imgEl = document.createElement('img');
                imgEl.src   = file || this.imgFile;
                document.body.appendChild(imgEl);
                imgEl.onload = () => {

                    var tempImage = new this.fabric.Image(imgEl, {
                        id: uuid(),
                        name: obj.name,
                        left: 0,
                        top: 0, 
                        originX: 'left', 
                        originY: 'top',
                        hasControls: true,
                    });

                    var default_image_name = new this.fabric.IText(obj.name, {
                        fontFamily: 'Courier New',
                        fontSize: 20,
                        fontWeight: "bold",
                        fill: "white",
                        hasControls: true,
                    });

                    // Set the text's position to the center of the image
                    default_image_name.left = tempImage.left + tempImage.width / 2 - default_image_name.width / 2;
                    default_image_name.top = tempImage.height - 30;
                    var imgInstance = new fabric.Group([tempImage, default_image_name]);

                    imgInstance.set({
                        id: obj.id,
                        name: obj.name,
                        customType: "extra_product",
                        dirty: true,
                        hasControls: true,
                    });

                    // Call setCoords to update the coordinates of the text
                    imgInstance.setCoords();

                    var rect = new fabric.Rect({
                        height: 0,
                        width: 0,
                        fill: '',
                        strokeWidth: 0,
                        opacity: 100,
                        id: "virtural",
                        hasControls: true,
                    });

                    var group = new fabric.Group([rect, imgInstance]);
                    group.set({
                        id: obj.id,
                        item_name: obj.name,
                        layerShowPeriod: {
                            mode: '',
                            startDate: '',
                            endDate: ''
                        },
                        bgState: "productImage",
                        customType: obj.customType,
                        left: 0 - group.width,
                        objectCaching: false,
                        position: {
                            positionX: "xCenter",
                            positionY: "yCenter"
                        },
                        originPoistion: "xCenter",
                        hasControls: true,
                    });

                    // Set rotation controls for the group
                    group.set({
                        hasControls: true,         // Enable resizing controls
                        // hasRotatingPoint: true     // Enable rotation control
                    });
                    
                    group.setControlsVisibility({
                        tl: false, // Hide top left point
                        bl: false, // Hide bottom left point
                        mtr: true, // Hide rotation control button
                        tr: true, // Hide delete control
                    });

                    this.canvas.c.add(group);
                    rect.set("width", group.width * group.scaleX);
                    rect.set("height", group.height * group.scaleY);
                    this.canvas.c.centerObject(group);
                    this.canvas.c.setActiveObject(group);
                    group.setOptions({ dirty: true });
                    this.canvas.c.renderAll();
                    // set zoom
                    imgEl.remove();
                };
            }, 100);
        },

        // insert image file
        insertImgFile(file) {
            
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
                    position: {
                        positionX: "xCenter",
                        positionY: "yCenter"
                    },
                    cornerColor : 'red', 
                    cornerStrokeColor : '#496eea', 
                    cornerStyle : 'circle'
                }).setCoords();
                this.canvas.c.add(imgInstance);
                this.canvas.c.setActiveObject(imgInstance);

                // // Remove image elements from the page
                imgEl.remove();
            };
        },
    },
    watch: {
        keyword_template() {
            var result = this.filterDemoTempLists("keyword", this.keyword_template);
            this.filterResultDemoLists = result;
        },
        keyword_element() {
            var result = this.filterElementLists("keyword", this.keyword_element);
            this.filterResultElementLists = result;
        },
        keyword_product() {
            var result = this.filterProductLists(this.keyword_product);
            this.filterResultProductLists = result;
        }
    }

};
</script>

<style scoped lang="less">
#main {
    display: flex;
    flex-wrap: wrap;
    float: left;
    margin-top: 20px;
}

.image-box {
    width: fit-content;
    border-radius: 10px;
    border: 1px solid #c3c3c3;
    cursor: pointer;
    text-align: center;
    padding: 10px;
    margin-bottom: 20px;
    width : 100%;
}

.image-box {
    img {
        width: 100% !important;
    }
}
.image-item {
    width: 178px;
    height: 178px;
    margin-left: auto;
}

.template-style {
    border-radius: 10px;
    cursor: pointer;
}

.child {
    // width: 50px;
    // height: 50px;
    /* Center vertically and horizontally */
    z-index: 10000;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    /* Apply negative top and left margins to truly center the element */
}
</style>
