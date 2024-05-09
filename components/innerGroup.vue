<template>
    <div>
        <div class="d-flex justify-content-center mb-3" v-if="!isLoaded">
            <b-spinner label="Loading..."></b-spinner>
        </div>
        <div v-else>
            <div class="back" @click="handleBack">
                <feather-icon icon="ArrowLeftIcon" class="mr-50 back-icon"/> <strong>{{ data }}</strong>
            </div>
            <div class="inner-image-container">
                <div class="inner-image" v-for="(inner, innerIndex) in innerData" :key="innerIndex">
                    <b-img :src="inner.image_full" @click="addTexture(inner.image_full)" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import select from '@editor/mixins/select';
import { v4 as uuid } from 'uuid';
import { http } from '@/services/requests';
export default {
    name: 'innerGroup',
    mixins: [select],
    props : [
        'data'
    ],
    data() {
        return  {
            backgrounds : [], 
            isShowingInnerGroup : false,
            innerData : null,
            isLoaded : false,
        }
    },
    watch : {
        data(newData) {
            if(newData) {
                this.getInnerGroup(newData);
            }
        }
    },
    methods: {
        removeObject() {
            const allObjects = this.canvas.c.getObjects(); 
            const backgroundImages = allObjects.filter(obj => obj.customType === 'background_image');

            // Check if backgroundImages has any objects
            if (backgroundImages.length > 0) {
                // Iterate over the filtered objects and remove each one from the canvas
                backgroundImages.forEach(backgroundImage => {
                    this.canvas.c.remove(backgroundImage);
                });

                // Re-render the canvas after removals
                this.canvas.c.renderAll();
            }
        },
        addTexture(image_url) {

            // Remove existing background from the canvabs
            this.removeObject();

            const imgEl = document.createElement('img');
            imgEl.crossOrigin = "anonymous"; // Handle CORS
            imgEl.src = image_url;

            // Insert the image element into the document to ensure it loads
            document.body.appendChild(imgEl);

            imgEl.onload = () => {
                // Create a Fabric Image object from the loaded image element
                let imgInstance = new this.fabric.Image(imgEl, {
                    selectable: true, // Make sure the image is selectable if needed
                    evented: true, // Allow events on the image
                });

                // Calculate the scale to make the image fill the canvas
                const canvasAspect = this.canvas.c.width / this.canvas.c.height;
                const imgAspect = imgInstance.width / imgInstance.height;
                let left, top, scaleFactor;

                if (canvasAspect >= imgAspect) {
                    // Canvas is wider than the image
                    scaleFactor = this.canvas.c.width / imgInstance.width;
                    left = 0;
                    top = (this.canvas.c.height - imgInstance.height * scaleFactor) / 2;
                } else {
                    // Canvas is taller than the image
                    scaleFactor = this.canvas.c.height / imgInstance.height;
                    top = 0;
                    left = (this.canvas.c.width - imgInstance.width * scaleFactor) / 2;
                }

                // Calculate the scale factors to match the canvas size
                const scaleX = this.canvas.c.width / imgInstance.width;
                const scaleY = this.canvas.c.height / imgInstance.height;

                // Apply the calculated scale and position
                imgInstance.set({
                    scaleX: 2.5,
                    scaleY: 2.5,
                    // left: 0,
                    // top: 0,
                    originX: 'left',
                    originY: 'top',
                    id: uuid(), 
                    item_name: 'Background (' +  this.data + ')',
                    nonBgImageState: false,
                    customType: "background_image",
                    layerShowPeriod: {
                        mode: '',
                        startDate: '',
                        endDate: ''
                    },
                    position: {
                        positionX: "xCenter",
                        positionY: "yCenter"
                    },
                });

                // Add the image to the canvas
                this.canvas.c.add(imgInstance);

                // Move the image to the back of all other objects
                this.canvas.c.sendToBack(imgInstance);
                this.canvas.editor.down(imgInstance);
                this.canvas.c.centerObject(imgInstance);

                this.canvas.c.renderAll();

                // Remove the temporary image element from the document
                document.body.removeChild(imgEl);
            };

            imgEl.onerror = () => {
                console.error("Failed to load image:", image_url);
                document.body.removeChild(imgEl);
            };
        },
        handleBack() {
            this.$emit("handleBack", true);
        },
        getInnerGroup(data) {
            this.isLoaded =  false;
            http.get('editor/backgrounds/' + data + '/' + this.$route.params.token)
            .then((response) => {
                this.isLoaded =  true;
                if(response.data.success) {
                    if(Array.isArray(response.data.inner_group) && response.data.inner_group.length) {
                        this.innerData = response.data.inner_group;
                    }
                }
            })
            .catch((error) => {
                this.isLoaded =  false;
                this.showToast('danger', 3000, 'Warning', error);
            });
        },
    },
}
</script>
<style scoped>
.inner-image-container {
    display : flex;
    flex-wrap: wrap;
}

.inner-image {
    width : 33.33%;
}

.inner-image img {
    width : 100%;
    border-radius : 10px;
    padding : 5px;
    cursor : pointer;
}

.back {
    padding : 10px; 
    cursor : pointer;
}
</style>