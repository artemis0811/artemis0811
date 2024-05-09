
import EventEmitter from 'events';
// import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';

// alignment guidelines
import initAligningGuidelines from '@editor/core/initAligningGuidelines';
import initControlsRotate from '@editor/core/initControlsRotate';
import InitCenterAlign from '@editor/core/initCenterAlign';
import initHotkeys from '@editor/core/initHotKeys';
import initControls from '@editor/core/initControls';
import axios from "axios";
import { fabric } from 'fabric';

class Editor extends EventEmitter {
    constructor(canvas) {
        super();

        this.canvas = canvas;
        this.editorWorkspace = null;

        initAligningGuidelines(canvas);
        initHotkeys(canvas);

        fabric.Object.prototype.set({
            transparentCorners: false,
            borderColor: '#ddd',
            cornerColor: '#0053b8',
            borderScaleFactor: 1,
            cornerStyle: 'circle',
            cornerStrokeColor: '#ddd',
            borderOpacityWhenMoving: 1,
        });
        
        //initControls(canvas);
        this.deleteControl(canvas);

        //initControlsRotate(canvas);
        this.centerAlign = new InitCenterAlign(canvas);
    }

    deleteControl(canvas) {

        const deleteIcon =
            "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
        
        const delImg = document.createElement('img');
        delImg.src = deleteIcon;
    
        function renderDelIcon(ctx, left, top, styleOverride, fabricObject) {
            const size = this.cornerSize;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    
            ctx.drawImage(delImg, -size / 2, -size / 2, size, size);
            ctx.restore();
        }
    
        // delete selected elements
        function deleteObject() {
            const activeObject = canvas.getActiveObjects();
            if (activeObject) {
                activeObject.map((item) => {
                    if (item.id == "trimImage" || item.id == "nonBgImage") {
                        return false;
                    } else {
                        canvas.remove(item);
                    }
                });
                canvas.renderAll();
                canvas.discardActiveObject();
            }
        }
    
        // delete icon
        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -16,
            offsetX: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderDelIcon,
            cornerSize: 24,
        });
    }

    getName(type) {

        var items = this.canvas.getObjects().filter(arg => {
            if (arg.id != "workspace") {
                return arg.type == type;
            }
        });
        if (type == "rect") {
            return type + "#" + (items.length);
        } else {
            return type + "#" + (items.length);
        }
    }

    getPosition(obj) {
        var positionX;
        var positionY;
        if (obj.position.positionX == "left") {
            positionX = 0 - (obj.width) / 2;
        }
        if (obj.position.positionX == "right") {
            positionX = obj.width / 2 - obj._objects[1].width * obj._objects[1].scaleX;
        }
        if (obj.position.positionX == "xCenter") {
            positionX = 0 - (obj._objects[1].width * obj._objects[1].scaleX) / 2;
        }
        if (obj.position.positionY == "yCenter") {
            positionY = 0 - (obj._objects[1].height * obj._objects[1].scaleY) / 2;
        }

        if (obj.position.positionY == "top") {
            positionY = -(obj.height / 2);
        }
        if (obj.position.positionY == "bottom") {
            positionY = obj.height / 2 - obj._objects[1].height * obj._objects[1].scaleY;
        }

        var position = {
            left: positionX,
            top: positionY
        };
        return position
    }
    
    getNameClone(name) {
        var items = this.canvas.getObjects().filter(arg => {
            if (arg.id != "workspace") {
                return arg.item_name.split("#")[0] == name.split("#")[0];
            }
        });

        return name.split("#")[0] + '#' + items.length;

    }
    
    clone() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject.id == "showBg") {
            return true;
        }
        if (activeObject.length === 0) return;
        activeObject.clone((cloned) => {
            this.canvas.discardActiveObject();
            // Spacing settings
            const grid = 10;
            cloned.set({
                left: cloned.left + grid,
                top: cloned.top + grid,
                id: uuid(),
            });
            this.canvas.add(cloned);
            this.canvas.setActiveObject(cloned);
            this.canvas.requestRenderAll();
        });
    }

    // split group
    unGroup() {
        // Get the currently selected object first, and then break it up
        this.canvas.getActiveObject().toActiveSelection();
        this.canvas
            .getActiveObject()
            .getObjects()
            .forEach((item) => {
                item.set('id', uuid());
            });
        this.canvas.discardActiveObject().renderAll();
    }

    group(name) {
        // composite element
        const activeObj = this.canvas.getActiveObject();
        const activegroup = activeObj.toGroup();
        const objectsInGroup = activegroup.getObjects();
        activegroup.clone((newgroup) => {
            newgroup.set('id', uuid());
            newgroup.set({
                id: uuid(),
                item_name: "group",
                customType: "real-group",
                item_name: name,
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
            });
            this.canvas.remove(activegroup);
            objectsInGroup.forEach((object) => {
                this.canvas.remove(object);
            });
            this.canvas.add(newgroup);
            this.canvas.setActiveObject(newgroup);
        });
    }

    up(list = '') {
        if (list != '') {
            list.bringForward();
            this.canvas.renderAll();
            this._workspaceSendToBack();
        } else {
            const actives = this.canvas.getActiveObjects();
            if (actives && actives.length === 1) {
                const activeObject = this.canvas.getActiveObjects()[0];
                activeObject && activeObject.bringForward();
                this.canvas.renderAll();
                this._workspaceSendToBack();
            }
        }
    }

    upTop() {
        const actives = this.canvas.getActiveObjects();
        if (actives && actives.length === 1) {
            const activeObject = this.canvas.getActiveObjects()[0];
            activeObject && activeObject.bringToFront();
            this.canvas.renderAll();
            this._workspaceSendToBack();
        }
    }

    down(list = '') {
        if (list != '') {
            list.sendBackwards();
            this.canvas.renderAll();
            this._workspaceSendToBack();
        } else {
            const activeObject = this.canvas.getActiveObjects()[0];
            activeObject && activeObject.sendBackwards();
            this.canvas.renderAll();
            this._workspaceSendToBack();
        }
    }

    downTop() {
        const actives = this.canvas.getActiveObjects();
        if (actives && actives.length === 1) {
            const activeObject = this.canvas.getActiveObjects()[0];
            activeObject && activeObject.sendToBack();
            this.canvas.renderAll();
            this._workspaceSendToBack();
        }
    }

    getWorkspace() {
        const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
        return workspace;
    }

    _workspaceSendToBack() {
        const workspace = this.getWorkspace();
        workspace && workspace.sendToBack();
    }

    getJson() {
        return this.canvas.toJSON(['id', 'bgState', 'originPoistion', 'fontLists', 'strokeLabel', 'ttf_base64', 'fontFamilyList', 'name', 'texthandle', 'scaling', 'item_name', 'position', 'layerShowPeriod', 'customType', 'gradientAngle', 'selectable', 'hasControls', "fillState", "borderState"]);
    }

    /**
     * @description: Drag and drop to add to canvas
     * @param {Event} event
     * @param {Object} item
     */
    dragAddItem(event, item) {

        const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
        if (event.x < left || event.y < top) return;

        const point = {
            x: event.x - left,
            y: event.y - top,
        };
        const pointerVpt = this.canvas.restorePointerVpt(point);
        item.left = pointerVpt.x - item.width / 2;
        item.top = pointerVpt.y;

            // Set rotation control for the added item
        item.set({
            hasRotatingPoint: true
        });

        this.canvas.add(item);
        this.canvas.requestRenderAll();
    }

    checkLayerPeriod(items) {
        // var items = this.canvas.getObjects();
        var nowDate = new Date();
        var date = nowDate.getDate();
        var month = nowDate.getMonth() + 1;

        var year = nowDate.getFullYear();
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (date.toString().length == 1) {
            date = '0' + date;
        }
        var today = `${year}-${month}-${date}`;
        var isShow = true;

        items.forEach(item => {
            if (item.layerShowPeriod) {

                if (item.layerShowPeriod.startDate != '') {

                    if (item.layerShowPeriod.mode == "except") {
                        if (item.layerShowPeriod.startDate >= today) {
                            isShow = true;
                        } else {
                            isShow = false;
                        }
                    } else {
                        if (item.layerShowPeriod.startDate <= today) {
                            isShow = true;
                        } else {
                            isShow = false;
                        }
                    }
                }

                if (item.layerShowPeriod.endDate != "") {
                    if (item.layerShowPeriod.mode == "except") {
                        if (item.layerShowPeriod.endDate >= today) {
                            isShow = false;
                        } else {
                            isShow = true;
                        }
                    } else {

                        if (item.layerShowPeriod.endDate <= today) {
                            isShow = true;
                        } else {
                            isShow = false;
                        }



                    }
                }
                if (item.layerShowPeriod.startDate != "" && item.layerShowPeriod.endDate != "") {

                    if (item.layerShowPeriod.mode == "except") {

                        if (item.layerShowPeriod.startDate <= today && item.layerShowPeriod.endDate >= today) {
                            isShow = false;
                        } else {
                            isShow = true;
                        }

                    } else {
                        if (item.layerShowPeriod.startDate <= today && item.layerShowPeriod.endDate >= today) {
                            isShow = true;
                        } else {
                            isShow = false;
                        }
                    }
                }

                if (item.layerShowPeriod.startDate == "" && item.layerShowPeriod.endDate == "") {
                    isShow = true;
                }

                if (isShow == true) {
                    item.set("visible", true);
                } else {
                    item.set("visible", false);
                }

            }

        });
    }

    getImageUrl() {
        const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
        const { left, top, width, height } = workspace;
        const option = {
            name: 'New Image',
            format: 'png',
            quality: 1,
            left,
            top,
            width,
            height,
        };
        var oldViewport = this.canvas.viewportTransform;

        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const imgUrl = this.canvas.toDataURL(option);
        this.canvas.setViewportTransform(oldViewport);
        return imgUrl;

    }
    //change short tag
    changeTags(jsonFile, tags, final_product_image) {
        var obj = jsonFile.objects.map((item) => {
            if (item.customType == "text" && item.type == "group") {
                tags.forEach((el) => {
                    if (item.objects[1].text.includes(el)) {
                        item.objects[1].text = item.objects[1].text.replace('[' + el + ']', final_product_image[el]);

                    }
                });
            }

            return item;
        });
        jsonFile.objects = obj;
        return jsonFile;
    }

    removeBg(url) {

        const image = new Image();
        image.src = url;
        image.onload = ({ target }) => {

            const w = Math.round(target.width);
            const h = Math.round(target.height);
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const canvasContext = canvas.getContext("2d");
            canvasContext.drawImage(target, 0, 0, target.width, target.height, 0, 0, w, h);
            const canvasImageData = canvasContext.getImageData(0, 0, w, h);

            for (let index = 0, dataLength = canvasImageData.data.length; index < dataLength; index += 4) {
                const r = canvasImageData.data[index];
                const g = canvasImageData.data[index + 1];
                const b = canvasImageData.data[index + 2];

                if ([r, g, b].every((item) => item > 240))
                    canvasImageData.data[index + 3] = 0;
            }

            target.width = w;
            target.height = h;
            canvasContext.putImageData(canvasImageData, 0, 0);
            return canvas.toDataURL();
        }
    }

    async changeProductImageLists(final_product_image, tags, index) {
        return new Promise(resolve => {

            // console.log("!!!",final_product_image);
            var jsonFile = JSON.stringify(this.changeTags(this.getJson(), tags, final_product_image));
            var canvas = document.createElement("CANVAS");
            canvas.id = "tempCanvas";
            // canvas.style.display = "none";
            // document.body.insertBefore(canvas, document.body.firstChild);

            var canvasClone = new fabric.Canvas("tempCanvas", {
                fireRightClick: true,
                stopContextMenu: true,
                controlsAboveOverlay: true,
            });

            canvasClone.loadFromJSON(jsonFile, async () => {

                canvasClone.renderAll.bind(canvasClone);
                this.checkLayerPeriod(canvasClone.getObjects());
                // add extra image 
                var product_extra_image = canvasClone.getObjects().filter((el, index) => {

                    // console.log('el type ', el.customType)
                    if (el.customType == "extra_product") {
                        var keys = Object.keys(final_product_image);
                        keys.forEach(arg => {
                            if (arg == el.item_name) {
                                el.image_link = final_product_image[el.item_name]
                                return;
                            }
                        });
                        el.index = index;
                        return el;
                    }
                });

                // console.log(canvasClone.getObjects())

                let productImage = canvasClone.getObjects().find((item, index) => {
                   
                    if (item.customType === "productImage") {
                        item.index = index;
                        item.image_link = final_product_image.image_link;
                        return item;
                    }
                });

                if(!productImage) productImage = [];

                const product_images = [productImage, ...product_extra_image];

                // const promises = [];
                // start change product image
                var promises = product_images.map(async obj => {
                    
                    if (obj.image_link === undefined) {
                        canvasClone.remove(obj);
                        canvasClone.renderAll();
                    } else {
                        // console.log('obj', obj)
                        return new Promise((resolve, reject) => {
                            var index = obj.index;
                            var removeBg;
                            if (obj.bgState === "nonBgImage" || obj.bgState === "nonAndTrimImage" || obj.bgState === "trimBgImage") {
                                removeBg = new Promise((resolve) => {
                                    var config = {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                            "Access-Control-Allow-Origin": "*",
                                            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                                            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
                                        },
                                        responseType: 'arraybuffer'
                                    }

                                    axios.get("https://images.tidy.shopping/removebg" + "?imgurl=" + obj.image_link, config).then(async res => {
                                        var arrayBufferView = res.data;
                                        var blob = new Blob([arrayBufferView], { type: "image/png" });
                                       
                                        var urlCreator = window.URL || window.webkitURL;
                                        var imageUrl = urlCreator.createObjectURL(blob);
                                        obj.image_link = imageUrl;
                                        resolve();
                                    });

                                });

                            } else {
                                removeBg = new Promise((resolve) => {
                                    resolve();
                                });
                            }
                            removeBg.then(() => {
                                var product_index = obj.index;
                                fabric.Image.fromURL(`${window.origin}/${obj.image_link}`, async (final_product_image) => {
                                    final_product_image._element.crossOrigin = 'Anonymous';
                                    if (obj.width >= obj.height) {
                                        final_product_image.set({
                                            scaleY: obj.height / final_product_image.height,
                                            scaleX: obj.height / final_product_image.height,
                                            layerShowPeriod: obj.layerShowPeriod,
                                            id: obj.id,
                                            angle: obj.angle,
                                            item_name: "final_product_image"
                                        }).setCoords();

                                    } else {
                                        final_product_image.set({
                                            scaleY: obj.width / final_product_image.width,
                                            scaleX: obj.width / final_product_image.width,
                                            layerShowPeriod: obj.layerShowPeriod,
                                            id: obj.id,
                                            angle: obj.angle,
                                            item_name: "final_product_image",
                                            flipX: obj.flipX,
                                            flipY: obj.flipY
                                        }).setCoords();
                                    }
                                    if (final_product_image.width * final_product_image.scaleX > obj._objects[1].width && final_product_image.height * final_product_image.scaleY > obj._objects[1].height) {
                                        final_product_image.set({
                                            scaleY: obj._objects[1].height / final_product_image.width,
                                            scaleX: obj._objects[1].width / final_product_image.width,
                                            layerShowPeriod: obj.layerShowPeriod,
                                            id: obj.id,
                                            angle: obj.angle,
                                            item_name: "final_product_image",
                                            left: obj.left,
                                            top: obj.top,
                                            flipX: obj.flipX,
                                            flipY: obj.flipY
                                        }).setCoords();
                                    }
                                    final_product_image.setPositionByOrigin(new fabric.Point(obj.left + obj.width * obj.scaleX / 2, obj.top + obj.height * obj.scaleX / 2))

                                    //Check image position in the wrapper.
                                    var final_product_image_left = final_product_image.left;
                                    var final_product_image_top = final_product_image.top;

                                    if (obj.position.positionX == "right") {
                                        final_product_image_left = final_product_image.left + (final_product_image.left - obj.left);
                                    }
                                    if (obj.position.positionX == "left") {
                                        final_product_image_left = final_product_image.left - (final_product_image.left - obj.left);
                                    }

                                    if (obj.position.positionY == "top") {
                                        final_product_image_top = final_product_image.top - (final_product_image.top - obj.top);
                                    }
                                    if (obj.position.positionY == "bottom") {
                                        final_product_image_top = final_product_image.top + (final_product_image.top - obj.top);
                                    }
                                    final_product_image.set({
                                        left: final_product_image_left,
                                        top: final_product_image_top
                                    }).setCoords();
                                    const currentindex = obj.index;
                                    canvasClone.remove(obj);
                                    canvasClone.add(final_product_image);
                                    final_product_image.moveTo(currentindex);
                                    // for (var i = 0; i < canvasClone.getObjects().length - product_index - 1; i++) {
                                    //     // final_product_image.sendBackwards();
                                    // }
                                    resolve();
                                });
                            });
                        })

                    }
                });
                Promise.all(promises).then(response => {
                    var cloneJson = canvasClone.toJSON(['id', 'bgState', 'originPoistion', 'fontLists', 'strokeLabel', 'ttf_base64', 'fontFamilyList', 'name', 'texthandle', 'scaling', 'item_name', 'position', 'layerShowPeriod', 'customType', 'gradientAngle', 'selectable', 'hasControls', "fillState", "borderState"])
                    var jsonFile = JSON.stringify(cloneJson);
                    canvasClone.loadFromJSON(jsonFile, async () => {
                        canvasClone.renderAll.bind(canvasClone);
                        const workspace = canvasClone.getObjects().find((item) => item.id === 'workspace');
                        const { left, top, width, height } = workspace;
                        const option = {
                            name: 'New Image',
                            format: 'png',
                            quality: 1,
                            left,
                            top,
                            width,
                            height,
                        };
                        var oldViewport = canvasClone.viewportTransform;
                        canvasClone.setViewportTransform([1, 0, 0, 1, 0, 0]);
                        const imgUrl = canvasClone.toDataURL(option);
                        canvasClone.setViewportTransform(oldViewport);
                        canvasClone.requestRenderAll();
                        canvasClone.renderAll(); 
                        document.getElementById("preview" + (index)).src = imgUrl;
                        resolve();
                    });
                })
            });
        })

    }

}

export default Editor;
