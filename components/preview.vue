<template>
    <div class="preview">
        <Loader :active="loaderActive" class="preview-loader" />
        <b-row>
            <b-col><b>Preview</b></b-col>
            <b-col cols="auto">
                <b-input-group>
                    <b-input-group-prepend is-text>
                        <feather-icon icon="SearchIcon" />
                    </b-input-group-prepend>
                    <b-form-input autocomplete="off" v-model="keyword" spellcheck="false" placeholder="Search phrase"
                        size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col cols="auto" class="align-self-center">
                <b-button variant="primary" @click="showPreview" size="sm">
                    <feather-icon icon="RefreshIcon" /> &nbsp; Refresh
                </b-button>
            </b-col>
        </b-row>

        <hr />

        <b-row v-for="(item, index) in publicImageUrl" :key="index" class="template-content" id="main">
            <b-col md="12">
                <div class="image-size">
                    <img :src="item" class="ivu-image-img" style="visibility:visible; width : 100%" alt="" :id="'preview' + index" loading="eager">
                </div>
            </b-col>
        </b-row>

        <!-- <b-row v-for="(item, index) in product_images" :key="index" class="template-content" id="main">
            <b-col md="12"><h5>{{ item.name }}</h5></b-col>
            <b-col md="12">
                <div class="image-size">
                    <img class="ivu-image-img" style="visibility:visible; width : 100%" alt="" :id="'preview' + index"
                        src="@editor/assets/img/preview.png" loading="eager">
                </div>
                <hr/>
            </b-col>
        </b-row> -->
        
    </div>
</template>
<script>

import select from '@editor/mixins/select';
import { getPreviewImage, getShortTags } from "@editor/service/endpoint.js";
import Loader from "./loader.vue";
import { http } from "@/services/requests";

export default {
    name: 'ToolBar',
    mixins: [select],
    components: {
        Loader,
    },
    data() {
        return {
            keyword: '',
            product_images: '',
            loaderActive: false,
            projectToken : null,
            hashKey : null, 
            publicImageUrl : [], 
            timeCount : 0,
        }
    },
    mounted() {
        this.product_images = [1, 2, 3, 4, 5];
        this.projectToken = this.$route.params.token;
    },
    methods: {
        deletePreviewTemplate(projectToken, idTemplate) {
            http.delete('editor/delete-preview/' + projectToken + '/' + idTemplate)
            .then((response) => {
                if(!response.data.success) {
                    if(Array.isArray(response.data.message) && response.data.message.length) {
                        response.data.message.forEach((error) => {
                            this.showToast('warning', 5000, 'Alert', error);
                        });
                    }
                    return;
                }
            })
            .catch((error) => {
                this.showToast('warning', 3000, 'Alert', error);
            });
        },
        getPreviewImage(hash_key) {
            http.get('editor/get-preview-images/' + hash_key + '/' + this.projectToken)
            .then((response) => {
                if(response.data.success) {
                    if(Array.isArray(response.data.response) && response.data.response.length) {

                        const totalImage = response.data.response.length;
                        const willRun = response.data.response.every(obj => obj.status === 1 && obj.to_be_processed === 0 && obj.public_image_url !== '');

                        if(this.timeCount > 40 && !willRun) {
                            this.showToast('warning', 3000, 'Alert', 'Preview could not be generated, please try again later.');
                            this.loaderActive = false;
                            this.timeCount = 0;

                            let id_template = response.data.response[0].id_image_builder;;
                            this.deletePreviewTemplate(this.projectToken, id_template);
                            return;
                        }

                        response.data.response.forEach((result, key) => {
                            if(result.public_image_url !== null) {
                                if(!this.publicImageUrl.includes(result.public_image_url)) {
                                    this.publicImageUrl.push(result.public_image_url);
                                }
                            }
                        });

                        this.loaderActive = false;
                        
                        if(totalImage !== this.publicImageUrl.length) {
                            this.loaderActive = true;
                            setTimeout(() => {
                                this.getPreviewImage(hash_key);
                            }, 3000);
                            this.timeCount+=3;
                        }
                    }
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error);
            });
        },
        showPreview() {

            this.loaderActive = true;
            this.timeCount = 0;

            var templateJson        = this.canvas.editor.getJson();
            var dataUrl             = {}
            dataUrl.json            = templateJson;
            dataUrl.width           = this.canvas.editor.editorWorkspace.option.width;
            dataUrl.height          = this.canvas.editor.editorWorkspace.option.height;
            dataUrl.fontLists       = window.globalFonts;
            dataUrl.image_url       = this.canvas.editor.getImageUrl();

            http.post('editor/show-preview', {
                project_token   : this.projectToken, 
                data            : dataUrl, 
                keyword         : this.keyword
            })
            .then((response) => {
                if(response.data.success) {
                    if(response.data.hash_key) {
                        this.hashKey = response.data.hash_key;
                        this.getPreviewImage(this.hashKey);
                    }
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error);
                this.loaderActive = false;
            });
        },
    }
};
</script>
<style scoped lang="less">

.preview {
    position: relative;
}
.refresh-btn {
    color: #fff;
    border-color: #0053b8 !important;
    background-color: #0053b8 !important;
    padding: 5px 10px !important;
    border-radius: 8px;
}
.preview-loader {
    position: absolute;
    left: 50%; 
    z-index: 9; 
    -webkit-transform: translateX(-50%); 
    transform: translateX(-50%);
    top : 100%;
}

.image-size {
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
}
</style>
