<template>
    <div style="display: inline-block">
        <!-- step back -->
        <b-button size="sm" v-b-tooltip.hover :title="'revocation' + `(${list.length})`" variant="outline-secondary" @click="undo" :disabled="!list.length">
            <svg width="15px" height="15px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 21.4199H15C16.8565 21.4199 18.637 20.6824 19.9497 19.3696C21.2625 18.0569 22 16.2764 22 14.4199C22 12.5634 21.2625 10.783 19.9497 9.47021C18.637 8.15746 16.8565 7.41992 15 7.41992H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 11.4199L2 7.41992L6 3.41992" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </b-button>

        <!-- redo -->
        <b-button size="sm" v-b-tooltip.hover :title="'redo' + `(${redoList.length})`" variant="outline-secondary" @click="redo" :disabled="!redoList.length">
            <svg width="15px" height="15px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 21.4199H9C7.14348 21.4199 5.36302 20.6824 4.05026 19.3696C2.73751 18.0569 2 16.2764 2 14.4199C2 12.5634 2.73751 10.783 4.05026 9.47021C5.36302 8.15746 7.14348 7.41992 9 7.41992H22" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 11.4199L22 7.41992L18 3.41992" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </b-button>

        <!-- <span class="time">
            {{ time }}
        </span> -->
    </div>
</template>

<script>
import select from '@editor/mixins/select';
import { keyNames, hotkeys } from '@editor/core/initHotKeys';
import { FeatherIcon } from 'vue-feather-icons';

const maxStep = 10;

export default {
    name: 'ToolBar',
    mixins: [select],
    data() {
        return {
            index: 0,
            redoList: [],
            list: [],
            time: '',
        };
    },
    created() {
        // Record progress when there is an update
        this.canvas.c.on({
            'object:modified': this.save,
            'selection:updated': this.save,
        });
        hotkeys(keyNames.ctrlz, this.undo);
    },
    methods: {
        // record keeping
        save(event) {
            // Filter select element events
            const isSelect = event.action === undefined && event.e;
            if (isSelect)
                return;
            const data = this.canvas.editor.getJson();
            if (this.list.length > maxStep) {
                this.list.shift();
            }
            this.list.push(data);
            this.getTime();
        },
        getTime() {
            const myDate = new Date();
            const str = myDate.toTimeString();
            const timeStr = str.substring(0, 8);
            this.time = timeStr;
        },
        // step back
        undo() {
            if (this.list.length) {
                const item = this.list.pop();
                this.redoList.push(item);
                this.renderCanvas(item);
            }
        },
        // redo
        redo() {
            if (this.redoList.length) {
                const item = this.redoList.pop();
                this.list.push(item);
                this.renderCanvas(item);
            }
        },
        // render from data
        renderCanvas(data) {
            this.canvas.c.clear();
            this.canvas.c.loadFromJSON(data, this.canvas.c.renderAll.bind(this.canvas.c));
            this.canvas.c.requestRenderAll();
        },
    },
    components: { FeatherIcon }
};
</script>

<style scoped lang="less">
span.active {
    svg.icon {
        fill: #2d8cf0;
    }
}

.time {
    color: #c1c1c1;
}
</style>
