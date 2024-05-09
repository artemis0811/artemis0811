<template>
  <div class="home">
    <!-- <div style="width:100%">
      <div style="width:400px;height:400px;background-color:yellow;position:fixed;z-index:10000;margin-left:auto">
      <loader :active="true" style="z-index:100000;width:200px;height:200px;"></loader>
      </div>
    </div>     -->
<!-- <div class="container"> -->
<!-- </div>     -->
    <header class="header text-center row" style="width: 100%;z-index:100000">
      <div class="">

        <div style="text-align: left; cursor:pointer" @click="modal = true">
            <Icon type="ios-create-outline" style="font-weight: bolder;"/>
            <span style="font-weight: bolder;" id="canvasName">{{canvasName}}</span>
        </div>

        <Modal
          v-model="modal"
          title="Change Name"
          >
          <div class="row">
            <label class="col-md-3">Name</label>
            <input class="col-md-8 form-control form-control-sm" v-model="canvasName" id="inputCanvasName"></input>
          </div>
        </Modal>          

      </div>
      <div class="col-6">
        <!-- <Button class="ivu-btn ivu-btn-text" icon="ios-flash" size="small">Liver Preview</Button>
        <Button class="ivu-btn ivu-btn-text" icon="md-grid" size="small">Design Mode</Button> -->
      </div>
      <!-- <div class="col-3" style="text-align: right;"> -->
        <!-- <button class="ivu-btn ivu-btn-primary ivu-btn-circle ivu-btn-icon-only" type="button">
            <Icon type="md-person" />
        </button>
      </div> -->
    </header>
    <div>


      <Content style="display: flex; height: calc(100vh - 64px);" id="content">
        <!-- <loader class="child" :active="true"></loader> -->
        
        <!-- --------------------------------- Import Button(+) ----------------------------------- -->
        <Dropdown class="m-md-4 plus-btn" v-if="show" trigger="click" placement="bottom-start">
            <Button type="primary" icon="md-add" />
            <template #list>
              <DropdownMenu>
                  <import-file></import-file>
                  <tools></tools>
              </DropdownMenu>
            </template>
        </Dropdown>
        <!-- --------------------------------- End Import Button(+) ----------------------------------- -->

        <!-- --------------------------------- Left Side ----------------------------------- -->
        <div id="workspace">
          <div>
            <div class="inside-shadow">
            
            </div>
            <div v-if="ruler" class="coordinates-bar coordinates-bar-top" style="width: 100%">
            
            </div>
            <div v-if="ruler" class="coordinates-bar coordinates-bar-left" style="height: 100%">
            
            </div>

            <!-- --------------------------------- Main Content ----------------------------------- -->
            <canvas id="canvas"></canvas>
            <!-- --------------------------------- End Main Content ----------------------------------- -->

            <!-- --------------------------------- Footer ----------------------------------- -->
            <footer class="bottomBar" v-if="show">
              <zoom></zoom>
            </footer>
            <!-- --------------------------------- End Footer ----------------------------------- -->
          </div>
        </div>
        <!-- --------------------------------- End Left Side ----------------------------------- -->
         <!-- --------------------------------- Right Side ----------------------------------- -->
        <div class="right-box">
          <div v-if="show">
            <set-size></set-size> 
            <group></group>

          </div>
            <attribute v-if="show"></attribute>            
        </div>
        <!-- --------------------------------- End Right Side ----------------------------------- -->
      </Content>
    </div>
  </div>
</template>

<script>

// import Jimp from 'jimp';
// import element
import importFile from '@editor/components/importFile';

// top assembly
import save from '@editor/components/save';
import zoom from '@editor/components/zoom';
// left component
import tools from '@editor/components/tools';
import setSize from '@editor/components/setSize';
import group from '@editor/components/group';

// right side component
import attribute from '@editor/components/attribute';

// functional components
import EventHandle from '@editor/utils/eventHandler';

import loader from "@editor/components/loader"
import "@editor/assets/css/main.css"
import { fabric } from 'fabric';
import Editor from '@editor/core';
import $ from "jquery";
const event = new EventHandle();
event.setMaxListeners(0)
const canvas = {};
export default {
  name: 'Editor',
  provide() {
    
    return {
      "canvas":canvas,
      "fabric":fabric,
      "event":event,
      "path":this.$route.path,
      "param_id":this.$route.params.id,
    }

  },

  data() {
    return {
      canvasName:'New template',
      modal: false,
      show: false,
      select: null,
      ruler: true,
      param_id:this.$route.params.id
    };
  },

  components: {
    setSize,
    tools,
    attribute,
    importFile,
    save,
    zoom,
    loader,
    group
  },

  mounted() {
    this.canvas = new fabric.Canvas('canvas', {
      fireRightClick: true,
      stopContextMenu: true,
      controlsAboveOverlay: true,
      perPixelTargetFind: true,               
      targetFindTolerance: 4,                 
      preserveObjectStacking: true         
    });

    canvas.c = this.canvas;
    event.init(canvas.c);
    canvas.editor = new Editor(canvas.c);
    this.show = true;
    this.$Spin.hide();      
    canvas.c.renderAll();
    setTimeout(() => {

      if(canvas.c.name == undefined || canvas.c.name == ''){
        this.canvasName = "New template"
      }else{
        this.canvasName = canvas.c.name;
      }

      //when delete keyboard press, select element is deleted
      $(document).keydown(e=>{
        if(e.originalEvent.code == "Delete"){
          const activeObject = this.canvas.getActiveObjects();
          if (activeObject) {
            activeObject.map((item) => {
              if(item.id == "productImage" || item.id == "trimImage" || item.id == "nonBgImage"){
                return false;
              }else{
                this.canvas.remove(item)
              }
            });
          }
          this.canvas.requestRenderAll();
          this.canvas.discardActiveObject();          
        }
      });      
      const windowObj = window;
      windowObj.addEventListener('resize', this.handleResize);
      // call the handler once to get the initial width and height values
      this.handleResize(this);      
    },1000);


  },
  methods:{
      handleResize() {
        canvas.editor.editorWorkspace.setSize(900,900);    
      },
      testclick(){
        console.log('test work')
      }
  }
  
};
</script>

<style>
  
#canvas {
  filter: drop-shadow(0px 5px 10px #d1d1d1);
  overflow-y: scroll;
}
span {
  font-size: 12px !important;
}
.bottomBar {
  margin: auto; 
  background-color: white;
  position: absolute;
  right: 10px;
  bottom: 10px;
  width:95%;
  padding: 10px;
  border-radius:10px
}
.child {
  background-color: red;
  /* Center vertically and horizontally */
  z-index: 10000;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px; /* Apply negative top and left margins to truly center the element */
}
.ivu-dropdown .ivu-select-dropdown {
    overflow: visible;
    max-height: none;
    min-width: 150px;
    padding: 0;
}
.ivu-dropdown .ivu-select-dropdown .list-group-item {
    cursor: pointer;
}
.ivu-dropdown .ivu-select-dropdown .list-group-item:hover{
  background-color: #ddd;
}
</style>