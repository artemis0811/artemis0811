<template>
    <div class="save-box">
        <b-dropdown id="save-json" text="Export" size="sm" variant="primary">
            <b-dropdown-item  @click="(value) => exportJson('template')">Quick Export Template JSON</b-dropdown-item>
            <b-dropdown-item  @click="(value) => exportJson('element')">Quick Export Element JSON</b-dropdown-item>
        </b-dropdown>
    </div>
</template>

<script>
import select from '@editor/mixins/select';
import { v4 as uuid } from "uuid";

export default {
    name: 'saveBar',
    inject: ["path", "param_id"],
    mixins: [select],
    props : ['name'],
    data() {
        return {
            saveType: "Save User Template",
            projectToken: null
        };
    },

    mounted() {
        this.havingToken();
        if(this.path.includes('create')) {
            this.saveType = "Save User Template"
        } else {
            this.saveType = "Edit User Template"
        }
    },
    methods: {
        saveWith(type) {
            this[type]();
        },
        exportJson(type) {
            const tempUrl       = this.canvas.editor.getJson();
            tempUrl.id          = uuid();
            tempUrl.image_url   = this.canvas.editor.getImageUrl();
            tempUrl.fontLists   = window.globalFonts;
            tempUrl.name        = this.name ? this.name : 'Demo ' + type;
            tempUrl.group_type        = this.name ? this.name : 'Demo ' + type;
          
            var dataUrl = tempUrl;
            if (type == "element") {
                if (tempUrl.objects.length > 2) {
                    var canvas = document.createElement("CANVAS");
                    canvas.id = "tempCanvas";
                    canvas.style.display = "none";
                    var canvasClone = new fabric.Canvas("tempCanvas", {
                        fireRightClick: true,
                        stopContextMenu: true,
                        controlsAboveOverlay: true,
                    });
                    var jsonFile = JSON.stringify(tempUrl);
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
                        canvasClone.setViewportTransform([1, 0, 0, 1, 0, 0]);
                        const imgUrl = canvasClone.toDataURL(option);
                        dataUrl = tempUrl.objects.slice(2);
                        dataUrl = {
                            "element": dataUrl,
                            "base64Url": imgUrl
                        }
                        const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(dataUrl, null)
                        )}`;
                        this.downFile(fileStr, 'json', type);
                    });

                }
            } else {
                const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(dataUrl, null)
                )}`;
                this.downFile(fileStr, 'json', type);
            }

            // const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
            //     JSON.stringify(dataUrl, null)
            // )}`;
            // this.downFile(fileStr, 'json', type);

        },
        downFile(fileStr, fileType, type) {
            const anchorEl = document.createElement('a');
            anchorEl.href = fileStr;
            anchorEl.download = `${type + '  ' + uuid()}.${fileType}`;
            document.body.appendChild(anchorEl); // required for firefox
            anchorEl.click();
            anchorEl.remove();
        },
    }
};
</script>

<style scoped lang="less">
.save-box {
    display: inline-block;
}
</style>
