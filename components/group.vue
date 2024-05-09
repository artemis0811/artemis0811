<template>
    <div class="group">
        <b-row>
            <b-col>
                <b-button variant="danger" :disabled="!isMultiple" @click="previewCustomImage">Group into Custom Image</b-button>
            </b-col>
        </b-row>

        <b-modal id="modal-center" v-model="groupState" centered title="Custom Image Creation" ok-title="Save" @ok="createCustomImage">
            <label>Name</label>
            <b-form-input v-model="customImageName"></b-form-input>
            <hr>
            <div>
                <img class="ivu-image-img" style=" height: auto; width:100%" alt="" id='previewCustomImageBox' src="" loading="eager">
            </div>
        </b-modal>
    </div>
</template>

<script>
import select from '@editor/mixins/select';

export default {
    name: 'ToolBar',
    mixins: [select],
    data() {
        return {
            customImageName: '',
            groupState: false,
        };
    },
    created() {
        this.event.on('selectMultiple', (e) => {
            this.mSelectMode = 'multiple';
            this.mSelectId = '';
            this.mSelectIds = e.map((item) => item.id);
        });
    },
    computed: {
        // Single select and equal to group element
        isGroup() {
            return this.mSelectMode === 'one' && this.mSelectOneType === 'group';
        },
        // Is it multiple choice
        isMultiple() {
            return this.mSelectMode == 'multiple';
        },
    },
    methods: {
        createCustomImage(bvModalEvent) {
            bvModalEvent.preventDefault()
            if (!this.customImageName.trim()) {
                this.showToast('danger', 3000, 'Alert', 'Please enter the name');
                return;
            } else {
                this.canvas.editor.group(this.customImageName);
                this.groupState = false;
            }
        },
        previewCustomImage() {
            var state = true;
            var jsonFile = this.canvas.editor.getJson();
            var tempArr = [];
            const activeObj = this.canvas.c.getActiveObject()._objects;
            jsonFile.objects.forEach((el, index) => {
                activeObj.forEach((item) => {
                    if (item.item_name == el.item_name || index == 0) {
                        if (el.id == "productImage" || el.id == "trimImage" || el.id == "nonBgImage") {
                            state = false;
                        }
                        tempArr.push(el);
                    }
                });
            });
            if (state == false) {
                alert("Product image can't be group");
                this.groupState = false;
                return false;
            }
            jsonFile.objects = tempArr;
            var canvas = document.createElement("CANVAS");
            canvas.id = "previewCustomImageCanvas";
            canvas.style.display = "none";
            var customImageCanvas = new fabric.Canvas("previewCustomImageCanvas", {
                fireRightClick: true,
                stopContextMenu: true,
                controlsAboveOverlay: true
            })
            customImageCanvas.loadFromJSON(jsonFile, () => {
                customImageCanvas.renderAll.bind(canvas.c);
                const workspace = customImageCanvas.getObjects().find((item) => item.id === 'workspace');
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
                var oldViewport = customImageCanvas.viewportTransform;
                customImageCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                const imgUrl = customImageCanvas.toDataURL(option);
                customImageCanvas.setViewportTransform(oldViewport);
                customImageCanvas.requestRenderAll();
                customImageCanvas.renderAll();
                document.getElementById("previewCustomImageBox").src = imgUrl;
            });
            this.groupState = true;
        },
    },
};
</script>
<style scoped lang="less">
.group {
    padding : 0 15px 15px 15px;
}
</style>
