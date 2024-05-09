<template>
    <div class="flip">
        <div class="box attr-item">
            <b-button variant="outline-secondary" v-b-tooltip.hover :title="'flip.x'" @click="flip('X')" size="sm">
                <feather-icon icon="RotateCwIcon" />
            </b-button>
            <b-button variant="outline-secondary" v-b-tooltip.hover :title="'flip.y'" @click="flip('Y')"  size="sm">
                <feather-icon icon="RotateCcwIcon" />
            </b-button>
        </div>
    </div>
</template>

<script>
import select from '@editor/mixins/select';

export default {
    name: 'ToolBar',
    mixins: [select],
    data() {
        return {};
    },
    methods: {
        // When non-single selection, mirror operation is prohibited
        notSelectOneMode() {
            return this.mSelectMode !== 'one';
        },
        flip(type) {
            const activeObject = this.canvas.c.getActiveObject();
            activeObject.set(`flip${type}`, !activeObject[`flip${type}`]).setCoords();
            this.canvas.c.requestRenderAll();
        },
    },
};
</script>
<style scoped>
.input-size {
    width: 20%
}
</style>