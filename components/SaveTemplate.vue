<template>
    <div class="save-box">
        <!-- <b-button variant="success" @click="saveJson" :disabled="isUpdating || !isTemplateLoaded"> -->
        <b-button variant="success" @click="saveJson">
            <feather-icon icon="SaveIcon" class="mr-50" /> Save Template
        </b-button>
    </div>
</template>

<script>
import select from '@editor/mixins/select';
import { http } from "@/services/requests";

export default {
    name: 'saveTemplate',
    mixins: [select],
    props : ['name', 'saveType', 'isTemplateLoaded'],
    data() {
        return {
            isUpdating : false,
            projectToken: null
        };
    },
    mounted() {
        this.havingToken();
    },
    methods: {
        saveJson() {

            var name = 'Demo Template';
            if (document.getElementById("canvasName") != null) {
                name = this.name;
            }

            var dataUrl         = this.canvas.editor.getJson();
            dataUrl.id          = this.param_id;
            dataUrl.name        = name;

            dataUrl.width       = this.canvas.editor.editorWorkspace.option.width;
            dataUrl.height      = this.canvas.editor.editorWorkspace.option.height;
            dataUrl.fontLists   = window.globalFonts;
            dataUrl.image_url   = this.canvas.editor.getImageUrl();

            if( 'update' == this.saveType ) {
               
                // Disabled the update button
                this.isUpdating     = true;
                this.$emit("updateTemplate", false );

                http.put('editor/update', { data: dataUrl, project_token : this.projectToken, id : this.$route.params.id })
                .then((response) => {
                    // Enable the update button
                    this.isUpdating = false;
                    this.$swal.close();
                    if(response.data.success) {
                        this.$emit("updateTemplate", true );
                        this.showToast('success', 3000, 'Success', response.data.message ? response.data.message : 'Successfully updated the template.')
                    } else {
                        this.$emit("updateTemplate", false );
                        this.showToast('danger', 3000, 'Alert', 'Something is wrong to update the template.')
                    }
                })
                .catch(() => {
                    // Enable the update button
                    this.isUpdating = false;
                    this.$emit("updateTemplate", true );
                });
            } else if ( 'create' == this.saveType ) {
                // Disabled the update button
                this.isUpdating     = true;
                this.$swal.close();
                http.post('editor/create', { data: dataUrl, project_token : this.projectToken })
                .then((response) => {
                    if(response.data.success) {
                        this.showToast('success', 3000, 'Success', response.data.message ? response.data.message : 'Successfully created a new template.');
                        this.$router.push({ name: 'image-builder' });
                    } else {
                        this.showToast('danger', 3000, 'Alert', response.data.message ? response.data.message : 'Opps, Something is wrong to create the template.');
                    }
                })
                .catch(() => {
                    // Enable the update button
                    this.isUpdating = false;
                });
            }
        }
    }
};
</script>

<style scoped lang="less">
.save-box {
    display: inline-block;
}
</style>
