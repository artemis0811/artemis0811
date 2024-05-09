<template>
    <div class="image-builder">
        <b-row class="mb-2">
            <b-col md="6">
                <h3>Image Builder</h3>
            </b-col>
            <b-col md="6 text-right">
                <router-link class="text-white" :to="{ name : 'create-image-builder', params : { token : projectToken } }">
                    <b-button :disabled="!isCheckedDone" :class="{ 'hide-btn' : !userCanImport }" v-b-tooltip.hover :title="computedTitle" variant="success" v-b-modal.new-image-builder>
                        <feather-icon icon="ImageIcon" class="mr-50" />
                        <span class="align-middle">
                            New Image Template
                        </span>
                    </b-button>
                </router-link>
                <b-button variant="secondary" v-b-modal.guide>
                    <feather-icon icon="FileTextIcon" class="mr-50" />
                    <span class="align-middle">Guide</span>
                </b-button>
            </b-col>
        </b-row>

        <!-- list of all image ditor -->
        <b-row>
            <b-col md="12" class="align-self-start">
                <div style="display:none">
                    <div id="workspace" style="width: 920px;height:500px; position: relative; background: #f1f1f1;">
                        <div class="canvas-box">
                            <div class="inside-shadow"></div>
                            <div class="coordinates-bar coordinates-bar-top" style="width: 100%"></div>
                            <div class="coordinates-bar coordinates-bar-left" style="height: 100%"></div>
                            <canvas id="canvas"></canvas>
                        </div>
                    </div>
                </div>
            </b-col>
            <template  v-if="loading">
                <b-col md="12">
                    <div class="d-flex justify-content-center mb-3">
                        <b-spinner label="Loading..."></b-spinner>
                    </div>
                </b-col>
            </template>
            <template v-else >
                <b-col v-if="userTemplates.length === 0" class="alert alert-warning p-1 ml-1 mr-1">
                    <p>No template is found.</p>
                </b-col>
                <b-col md="3" id="main" class="template-content" v-for="(item, index) in userTemplates" :key="index">
                    <div class="image-box" :imgId="item.id_template">
                        <b-img-lazy v-bind="imageSettings" :src="item.image_url"></b-img-lazy>
                        <div class="template-update-btn">
                            <router-link :to="{ name : 'update-image-builder', params : { token : projectToken, id : item.id_template}}">
                                <b-button variant="success" size="sm">
                                    <feather-icon icon="EditIcon" class="mr-50" /> Edit
                                </b-button>
                            </router-link>
                            <b-button class="mt-1" variant="primary" size="sm" @click="handleDuplicate(item.id_template)">
                                <feather-icon icon="CopyIcon" class="mr-50" /> Duplicate
                            </b-button>
                            <b-button class="mt-1" variant="danger" size="sm" v-b-modal.delete-template @click="deleteBtnClicked(item.id_template)">
                                <feather-icon icon="DeleteIcon" class="mr-50" /> Delete
                            </b-button>
                        </div>
                        <h6 class="mt-1 ml-1">{{ item.name }}</h6>
                    </div>
                </b-col>
            </template>
        </b-row>
        <!-- list of all image ditor -->

        <!-- Delete template modal -->
        <b-modal id="delete-template" centered title="Delete template">
            <p class="mb-0">Are you sure to delete this template?</p>
            <template #modal-footer>
                <b-button @click="confirmDelete" :disabled="isDeleting" variant="danger">Yes, Delete the template</b-button>
            </template>
        </b-modal>
        <!-- Delete template modal -->

        <!-- Guide popup -->
        <b-modal id="guide" cancel-variant="secondary" hide-footer centered size="lg" no-close-on-backdrop>
            <template #modal-title class="mr-auto ml-2 mt-2 d-inline" vertical-align="bottom">
                Guide
            </template>
            <b-row>
                <b-col md="4">
                    <b-embed
                        type="iframe"
                        aspect="16by9"
                        src="https://www.youtube.com/embed/53kB0GKAd2k?si=r0vnGsdPkmxYCb4s"
                        allowfullscreen
                    ></b-embed>
                </b-col>
                <b-col md="8">
                    <h4>Enhance your images in Facebook Dynamic Product Ads with image editor.</h4>
                    <p>Some dummy text will goes to here. </p>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>

import { http } from "@/services/requests";
    
export default {
    data() {
        return {
            loading : true,
            projectToken : null, 
            userTemplates : [],
            imageSettings : {
                center: true,
                fluidGrow: true,
                blank: false,
                blankColor: '#bbb',
            },
            deletingIdTemplate : null, 
            userRole : null,
            isDeleting : false, 
            userCanImport : true, 
            userCanImportMessage : '', 
            isCheckedDone : false, 

        }
    }, 
    computed: {
        computedTitle() {
            return this.userCanImport ? '' : this.userCanImportMessage;
        }
    },
    mounted() {
        this.havingToken();
        this.remainingImageBuilder();
    },
    methods: {
        remainingImageBuilder() {
            http.get('remaining-image-templates/' + this.projectToken)
            .then((response) => {
                this.isCheckedDone = true;
                this.prepareCanvas();
                
                if(!response.data.success) {
                    this.userCanImport          = false;
                    this.loading                = false;
                    this.userCanImportMessage   = response.data.message;
                    // this.showToast('warning', 3000, 'Alert', response.data.message);
                    return;
                }
                this.userCanImport = true;
                
            })
            .catch((error) => {
                this.isCheckedDone  = true;
                this.userCanImport  = false;
                this.showToast('danger', 3000, 'Alert', 3000);
            });
        },
        handleDuplicate(id_template) {
            http.post('editor/duplicate', {
                project_token   : this.projectToken, 
                id_template     : id_template
            })
            .then((response) => {
                if(response.data.success) {
                    this.showToast('success', 3000, 'Success', 'Successfully duplicated the template.')
                    this.userTemplates = [];
                    this.getUserTemplates();
                } else {
                    this.showToast('danger', 3000, 'Alert', 'Opps! Could not duplicate the template.')
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Alert', error)
            });
        },
        deleteBtnClicked(idTemplate) {
            this.deletingIdTemplate = idTemplate;
        },  
        confirmDelete(bvModalEvent) {
            bvModalEvent.preventDefault();
            this.isDeleting = true;
            http.delete('editor/delete/' +  this.projectToken + '/' + this.deletingIdTemplate)
            .then((response) => {
                if(response.data.success) {
                    this.showToast('success', 3000, 'Success', response.data.message ?  response.data.message : 'Successfully deleted the template');

                    // Close the modal after 3 seconds
                    setTimeout(() => {
                        this.$bvModal.hide('delete-template');
                    }, 100);

                    this.userTemplates = this.userTemplates.filter((template) => {
                        return template.id_template !== this.deletingIdTemplate;
                    });
                    
                } else {
                    this.isDeleting = false;
                    this.showToast('danger', 3000, 'Alert', response.data.message ? response.data.message : 'Opps! Something wen\'t wrong');
                }
            })
            .catch(() => {
                this.isDeleting = false;
            })
            .finally(() => {
                this.isDeleting = false;
            });
        },
        prepareCanvas() {
            this.getUserTemplates();
        },
        getUserTemplates() {
            this.loading = true;
            http.get('editor/user-templates/' + this.projectToken)
            .then((response) => {
                if(response.data.success) {
                    //set the user role
                    this.userRole = response.data.role;
                    // Get all the user templates
                    if(Array.isArray(response.data.user_templates) && response.data.user_templates.length) {
                        response.data.user_templates.forEach((template) => {
                            this.userTemplates.push({
                                id_template: template.id_template,
                                name: template.template_name,
                                image_url: template.template_preview_image
                            })
                            this.loading = false;
                        });
                    }
                } else {
                    this.loading = false;
                }
            })
            .catch((error) => {
                this.loading = false;
            });
        },
    },
}
</script>
<style scopped>
.image-box {
    position: relative;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    margin-bottom: 30px;
    padding: 5px;
    border-radius: 5px;
    height : 250px;
    box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
}

.image-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); 
    opacity: 0;
    transition: opacity 0.3s ease;
}

.image-box:hover::before {
    opacity: 1;
}

.image-box img {
    width: auto !important;
    height: 200px;
    object-fit: cover;
}

.template-update-btn {
    display : none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    z-index: 1; 
    width: max-content;
}

.image-box:hover .template-update-btn  {
    display: flex;
    flex-direction: column;
}

.template-update-btn:hover {
    cursor: pointer;
}

.hide-btn {
    opacity: .6;
}
/* .image-builder {
    background-color: #fff;
    padding: 15px;
    border: 1px solid #ebe9f1;
} */
</style>