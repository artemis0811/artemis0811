<template>
    <div class="right-header"> 
        <div class="d-flex" v-if="textType.includes(mSelectOneTypeProps[0])">
            <b-button variant="secondary" @click="mainPanel()" class="btn-icon mr-1" size="sm">
                <feather-icon icon="ArrowLeftIcon"/>
            </b-button>
            <h2 class="mr-1">T</h2>
            <b-form-input @on-change="changeName" v-model="baseAttr.item_name"></b-form-input>
        </div>
        <div class="d-flex" v-if="imgType.includes(mSelectOneTypeProps[0])">
            <b-button variant="secondary" @click="mainPanel()" class="btn-icon mr-1" size="sm">
                <feather-icon icon="ArrowLeftIcon" />
            </b-button>
            <b-button variant="outline-secondary" class="btn-icon mr-1" size="sm">
                <feather-icon icon="ImageIcon" />
            </b-button>
            <b-form-input @on-change="changeName" v-model="baseAttr.item_name"></b-form-input>
        </div>
        <div class="d-flex" v-if="rectType.includes(mSelectOneTypeProps[0])">
            <b-button variant="secondary" @click="mainPanel()" class="btn-icon mr-1" size="sm">
                <feather-icon icon="ArrowLeftIcon"/>
            </b-button>
            <b-button variant="outline-secondary" class="btn-icon mr-1" size="sm">
                <feather-icon icon="SquareIcon"/>
            </b-button>
            <b-form-input @on-change="changeName" v-model="baseAttr.item_name"></b-form-input>
        </div> 
        <div class="d-flex" v-if="circleType.includes(mSelectOneTypeProps[0])">
            <b-button variant="secondary" @click="mainPanel()" class="btn-icon mr-1" size="sm">
                <feather-icon icon="ArrowLeftIcon"/>
            </b-button>
            <b-button variant="outline-secondary" class="btn-icon mr-1" size="sm">
                <feather-icon icon="CircleIcon"/>
            </b-button>
            <b-form-input @on-change="changeName" v-model="baseAttr.item_name"></b-form-input>
        </div>
    </div>    
</template>

<script>
import select from '@editor/mixins/select';

export default {
    name: 'ToolBar',
    mixins: [select],
    props:['mSelectOneTypeProps'],
    data(){
        return{
            baseAttr: this.mSelectOneTypeProps[1],
            rectType:["rect"],
            circleType:["circle"],            
            imgType: ['image'],
            textType: ['i-text', 'textbox', 'text'],
        }        
    },
    methods:{
        changeName(){
            var activeObject = this.canvas.c.getActiveObject();
            if(activeObject){
                activeObject.item_name = this.baseAttr.item_name;
            }
        },
        mainPanel(){
            this.canvas.c.discardActiveObject();
            this.canvas.c.requestRenderAll();
        }

    }
}
</script>
<style scoped lang="less">
Button {
  padding: 0px 5px;
}
.box {
  width: 100%;
}

.flex-item {
  display: inline-flex;
  flex: 1;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
}
</style>