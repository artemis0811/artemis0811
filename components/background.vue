<template>
    <div class="d-flex justify-content-center mb-3" v-if="!isLoaded">
        <b-spinner label="Loading..."></b-spinner>
    </div>
    <div v-else>
        <div class="background" v-show="!isShowingInnerGroup">
            <b-row v-for="(background, category) in backgrounds" :key="category">
                <b-col md="12">
                    <strong>{{ category }}</strong>
                </b-col>
                <b-col md="12">
                    <div class="texture" v-for="(inner, innerGroup) in background" :key="innerGroup">
                        <small>{{ innerGroup }}</small>
                        <div class="texture-image">
                            <!-- <b-img v-for="(image, imageIndex) in inner" :key="imageIndex" @click="addTexture(image.image_preview)" :src="image.image_preview"/> -->
                            <b-img v-for="(image, imageIndex) in inner" :key="imageIndex" @click="handleInnerGroup(innerGroup)" :src="image.image_preview"/>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </div>
        <inner-group v-show="isShowingInnerGroup" :data="passingData" @handleBack="handleBack" v-if="isLoaded"></inner-group>
    </div>
</template>
<script>
import select from '@editor/mixins/select';
import { v4 as uuid } from 'uuid';
import { http } from '@/services/requests';
import innerGroup from '@editor/components/innerGroup.vue';

export default {
    name: 'BackGround',
    mixins: [select],
    inject: ["path", "param_id"],
    data() {
        return  {
            backgrounds : [], 
            isShowingInnerGroup : false,
            isLoaded : false,
            passingData : null,
        }
    },
    components : {
        innerGroup
    },
    mounted() {
        this.getBackground();
    },
    methods: {
        handleBack() {
            this.isShowingInnerGroup = false;
        },
        handleInnerGroup(innerGroup) {
            this.isShowingInnerGroup = true;
            this.passingData = innerGroup;
        },
        getBackground() {
            this.isLoaded = false;
            http.get('editor/backgrounds/' + this.$route.params.token)
            .then((response) => {
                if(response.data.success) {
                    this.isLoaded = true;
                    const backrounds = Object.entries(response.data.backgrounds);
                    this.backgrounds = response.data.backgrounds
                }
            })
            .catch((error) => {
                this.showToast('danger', 3000, 'Warning', error);
            });
        },
    },
}
</script>
<style scoped>

.texture {
    float: left;
    margin-right: 10px;
    width: calc(170px0% - 10px);
    margin-bottom : 10px;
}

.texture-image {
    background: #f8f8f8;
    border-radius: 5px;
    box-shadow: 1px 1px 1px #ddd;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    border-radius: 5px;
}

.texture-image img {
    width: 63px;
    object-fit: contain;
    height: auto;
    border-radius: 5px;
    cursor: pointer;
    flex-grow: 0;
    flex-basis: 0;
    padding : 5px;
}

</style>