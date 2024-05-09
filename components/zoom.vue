<template>
    <div clas="zoom">
        <b-row>
            <b-col md="2">
                <save :name="name" v-if="isTemplateOwner"></save>
            </b-col>
            <b-col md="10" class="text-right"> 
                <history></history>
                <b-button size="sm" @click="big" variant="outline-secondary">
                    <feather-icon icon="ZoomInIcon" size="15" class="text-body align-middle mr-25"/>
                </b-button>
                <b-button size="sm" @click="small" variant="outline-secondary">
                    <feather-icon icon="ZoomOutIcon" size="15" class="text-body align-middle mr-25"/>
                </b-button>
                <b-button size="sm" @click="rSet" variant="outline-secondary">1:1</b-button>
                <b-button size="sm" @click="setViewport" variant="outline-secondary">
                    <feather-icon icon="Maximize2Icon" size="15" class="text-body align-middle mr-25"/>
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import select from '@editor/mixins/select';
import save from "./save.vue"
import history from "./history.vue"

export default {
    name: 'ToolBar',
    mixins: [select],
    props : ['name', 'projectToken', 'isTemplateOwner'],
    data() {
        return {
            zoom: 0,
        };
    },
    components: {
        save,
        history
    },
    computed: {
        unShow() {
            return this.mSelectMode === 'one' && this.mSelectOneType === 'group';
        },
        createShow() {
            return this.mSelectMode === 'multiple';
        },
    },
    methods: {
        rSet() {
            this.canvas.editor.editorWorkspace.one();
        },
        big() {
            this.canvas.editor.editorWorkspace.big();
        },
        small() {
            this.canvas.editor.editorWorkspace.small();
        },
        setViewport() {
            this.canvas.editor.editorWorkspace.auto();
        },
    },
};
</script>
<style scoped lang="less">
.box {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
</style>
