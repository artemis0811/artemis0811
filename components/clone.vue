<template>
    <b-dropdown-item  @click="clone()">
        <feather-icon icon="CopyIcon"/>
        Duplicate layer
    </b-dropdown-item>
</template>

<script>
import select from '@editor/mixins/select';
import { v4 as uuid } from 'uuid';

export default {
    name: 'ToolBar',
    mixins: [select],
    data() {
        return {};
    },
    methods: {

        clone() {
            var activeObject = this.canvas.c.getActiveObject();
            if (activeObject.id == "productImage" || activeObject.id == "trimImage" || activeObject.id == "nonBgImage") {
                return false;
            }
            activeObject.clone((cloned) => {
                this.canvas.c.discardActiveObject();
                // Spacing settings
                const grid = 10;
                var item_name = this.canvas.editor.getNameClone(activeObject.item_name);
                cloned.set({
                    left: cloned.left + grid,
                    top: cloned.top + grid,
                    id: uuid(),
                    layerShowPeriod: activeObject.layerShowPeriod,
                    item_name: item_name,
                });

                this.canvas.c.add(cloned);
                this.canvas.c.setActiveObject(cloned);
                this.canvas.c.requestRenderAll();
            });

        },
    },
};
</script>

<style scoped lang="less"></style>
