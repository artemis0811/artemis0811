<template>
    <div>
        <b-dropdown-item href="#" @click="() => addText()" :draggable="true" @dragend="onDragend('text')">Text</b-dropdown-item>
        <b-dropdown-item href="#" v-b-modal.shape-modal>Shapes</b-dropdown-item>

        <b-modal id="shape-modal" centered title="All shapes" size="md" hide-footer>
            <b-row>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/ellipse.png')" @click="addEllipse" alt="Ellips" width="50">
                    <h6>Ellips</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/polygon.png')" @click="addPolygon" alt="Polygon" width="50">
                    <h6>Polygon</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/triangle.png')" @click="addTriangle" alt="Triangle" width="50">
                    <h6>Triangle</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/remove.png')" @click="addLine" alt="Line" width="50">
                    <h6>Line</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/circle.png')" @click="addCircle" alt="Circle" width="50">
                    <h6>Circle</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/rectangle.png')" @click="addRect" alt="Rectnagle" width="50">
                    <h6>Rectangle</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/star.png')" @click="addStar" alt="Star" width="50">
                    <h6>Star</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/moon.png')" @click="addMoon" alt="Moon" width="50">
                    <h6>Moon</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/spiral.png')" @click="addSpiral" alt="Spiral" width="50">
                    <h6>Spiral</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/arrow.png')" @click="addArrow" alt="Arrow" width="50">
                    <h6>Arrow</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/right-arrow.png')" @click="rightArrows" alt="Right arrows" width="50">
                    <h6>Right Arrows</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/left-arrow.png')" @click="leftArrows" alt="Left arrows" width="50">
                    <h6>Left Arrows</h6>
                </b-col>
                <b-col md="3 text-center">
                    <img :src="require('@editor/assets/img/frame.png')" @click="addFrame" alt="Frame" width="50">
                    <h6>Frame</h6>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import { v4 as uuid } from 'uuid';
import initializeLineDrawing from '@editor/core/initializeLineDrawing';
import select from '@editor/mixins/select';

// default property
const defaultPosition = { shadow: '', fontFamily: 'arial' };
// drag properties
const dragOption = {
    left: 0,
    top: 0,
};
export default {
    name: 'ToolBar',
    mixins: [select],
    inject: ['canvas', 'fabric'],
    data() {
        return {
            isDrawingLineMode: false,
            isArrow: false,
        };
    },
    created() {
        // line drawing
        this.drawHandler = initializeLineDrawing(this.canvas.c, defaultPosition);
        this.canvas.c.on('drop', (opt) => {
            // The distance of the canvas element from the left and top of the browser
            const offset = {
                left: this.canvas.c.getSelectionElement().getBoundingClientRect().left,
                top: this.canvas.c.getSelectionElement().getBoundingClientRect().top,
            };

            // Convert mouse coordinates to canvas coordinates (unscaled and translated coordinates)
            const point = {
                x: opt.e.x - offset.left,
                y: opt.e.y - offset.top,
            };

            // Transformed coordinates, restorePointerVpt is not affected by viewport transformation
            const pointerVpt = this.canvas.c.restorePointerVpt(point);
            dragOption.left = pointerVpt.x;
            dragOption.top = pointerVpt.y;
        });
    },

    methods: {
        addFrame() {
            this.$bvModal.hide('shape-modal');

            // Create a snake-like wavy path for the frame
            var wavyPathData = 'M 50, 50 ' + 
                            'q 50, -50, 100, 0 ' + 
                            'q 50, 50, 100, 0 ' +
                            'q 50, -50, 100, 0 ' +
                            'q 50, 50, 100, 0 ' +
                            'l 0, 200 ' + 
                            'q -50, 50, -100, 0 ' + 
                            'q -50, -50, -100, 0 ' + 
                            'q -50, 50, -100, 0 ' + 
                            'q -50, -50, -100, 0 ' +
                            'l 0, -200 ' +
                            'z';

            var wavyFrame = new fabric.Path(wavyPathData, {
                fill: 'transparent',
                stroke: 'black',
                strokeWidth: 8,
                selectable: true,
                id: uuid(),
                item_name: 'frame',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });

            this.canvas.c.add(wavyFrame);
            this.canvas.c.centerObject(wavyFrame);
            this.canvas.c.setActiveObject(wavyFrame);
        },
        upArrow() {
            

return;


            // Outer curved frame border
var outerFrameBorder = new fabric.Rect({
  left: 50,
  top: 50,
  fill: 'transparent',  // No fill, showing only the border
  stroke: '#000',       // Color of the outer border
  strokeWidth: 10,      // Width of the outer border
  width: 300,
  height: 200,
  rx: 25,               // Horizontal radius of the corners of the outer border
  ry: 25,               // Vertical radius of the corners of the outer border
  selectable: false
});

// Inner curved frame border
var innerFrameBorder = new fabric.Rect({
  left: outerFrameBorder.left + outerFrameBorder.strokeWidth, // Position inside the outer border
  top: outerFrameBorder.top + outerFrameBorder.strokeWidth,   // Position inside the outer border
  fill: 'transparent',  // No fill, showing only the border
  stroke: '#555',       // Color of the inner border
  strokeWidth: 6,       // Width of the inner border
  width: outerFrameBorder.width - outerFrameBorder.strokeWidth * 2,   // Width minus the outer border
  height: outerFrameBorder.height - outerFrameBorder.strokeWidth * 2, // Height minus the outer border
  rx: 15,               // Horizontal radius of the corners of the inner border
  ry: 15,               // Vertical radius of the corners of the inner border
  selectable: false
});

var group = new fabric.Group([outerFrameBorder, innerFrameBorder]);

group.set({
                id: uuid(),
                customType: "frmae",
                item_name: "frame",
                angle: 0,
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                texthandle: "automatic",
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                originPoistion: "left",
                objectCaching: false,
            });
            this.canvas.c.add(group);

            this.canvas.c.centerObject(group);
            this.canvas.c.setActiveObject(group);

        },
        leftArrows() {
            this.$bvModal.hide('shape-modal');
            // Define the SVG path for three leftward-pointing arrows
            var arrowPath = 
            'M 20 20 L 40 0 L 80 0 L 60 20 L 80 40 L 40 40 L 20 20 Z ' +  // First arrow
            'M 80 20 L 100 0 L 140 0 L 120 20 L 140 40 L 100 40 L 80 20 Z ' +  // Second arrow
            'M 140 20 L 160 0 L 200 0 L 180 20 L 200 40 L 160 40 L 140 20 Z ';   // Third arrow
    

            var path = new fabric.Path(arrowPath);
            path.set({
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1,
                selectable: true,
                id: uuid(),
                item_name: 'left_arrows',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });

            this.canvas.c.add(path);
            this.canvas.c.centerObject(path);
            this.canvas.c.setActiveObject(path);
        },
        rightArrows() {

            this.$bvModal.hide('shape-modal');
            var pathData = 'M 60 20 L 40 40 L 0 40 L 20 20 L 0 0 L 40 0 L 60 20 ' + // First arrow
            'M 120 20 L 100 40 L 60 40 L 80 20 L 60 0 L 100 0 L 120 20 ' + // Second arrow (offset by the width of the first arrow)
            'M 180 20 L 160 40 L 120 40 L 140 20 L 120 0 L 160 0 L 180 20';  // Third arrow (offset by the width of two arrows)

            var path = new fabric.Path(pathData);
            path.set({
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1,
                selectable: true,
                id: uuid(),
                item_name: 'right_arrows',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });

            this.canvas.c.add(path);
            this.canvas.c.centerObject(path);
            this.canvas.c.setActiveObject(path);
        },
        addArrow() {
            var arrowPoints = [
                { x: 50, y: 100 },  // Start at the tail bottom
                { x: 200, y: 100 }, // Straight line to head start bottom
                { x: 200, y: 50 },  // Line to point tip
                { x: 300, y: 150 }, // Tip of the arrow head
                { x: 200, y: 250 }, // Bottom right of the arrow head
                { x: 200, y: 200 }, // Line to head end bottom
                { x: 50, y: 200 },  // Line back to the tail bottom
                { x: 50, y: 100 }   // Close the polygon back at the start
            ];

            var arrow = new fabric.Polygon(arrowPoints, {
                stroke: '#000',
                fill: null, // no fill
                strokeWidth: 6,
                selectable: true,
                id: uuid(),
                item_name: 'spiral',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });

            this.canvas.c.add(arrow);
            this.canvas.c.centerObject(arrow);
            this.canvas.c.setActiveObject(arrow);
        },
        drawSpiral(centerX, centerY, innerRadius, outerRadius, angle, loops) {
            var path = [];
            var angleIncrement = (2 * Math.PI) / angle;
            var radiusIncrement = (outerRadius - innerRadius) / (angle * loops);
            var radius, x, y;

            for (var i = 0; i < angle * loops; i++) {
                radius = innerRadius + i * radiusIncrement;
                x = centerX + radius * Math.cos(i * angleIncrement);
                y = centerY + radius * Math.sin(i * angleIncrement);
                path.push({ x: x, y: y });
            }

            return path;
        },
        addSpiral() {
            this.$bvModal.hide('shape-modal');

            var spiralPoints = this.drawSpiral(250, 250, 10, 100, 100, 3);
            var spiralPath = new fabric.Path('M ' + spiralPoints.map(p => `${p.x} ${p.y}`).join(' L '));

            spiralPath.set({
                stroke: '#000',
                fill: null, // no fill
                strokeWidth: 6,
                selectable: true,
                id: uuid(),
                item_name: 'spiral',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });

            this.canvas.c.add(spiralPath);
            this.canvas.c.centerObject(spiralPath);
            this.canvas.c.setActiveObject(spiralPath);

        },
        generateStarburstPoints(centerX, centerY, innerRadius, outerRadius, pointsCount) {
            var points = [];
            for (var i = 0; i < pointsCount; i++) {
                var angle = Math.PI * 2 / pointsCount * i;
                var dx = (i % 2 === 0 ? outerRadius : innerRadius) * Math.cos(angle);
                var dy = (i % 2 === 0 ? outerRadius : innerRadius) * Math.sin(angle);
                points.push({x: centerX + dx, y: centerY + dy});
            }
            return points;
        },
        addMoon() {
            this.$bvModal.hide('shape-modal'); 

            var starburst = new fabric.Polygon(this.generateStarburstPoints(200, 200, 150, 180, 24), {
                fill: '#000',
                stroke: 'black',
                strokeWidth: 1,
                selectable: true,
                id: uuid(),
                item_name: 'moon',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });
            this.canvas.c.add(starburst);
            this.canvas.c.centerObject(starburst);
            this.canvas.c.setActiveObject(starburst);
        },
        addStar() {
            this.$bvModal.hide('shape-modal'); 

            // Initiating a points array
            var points = [
                { x: 349.9, y: 75, },
                { x: 379, y: 160.9,},
                { x: 469, y: 160.9,},
                { x: 397, y: 214.9,},
                { x: 423, y: 300.9,},
                { x: 350, y: 249.9,},
                { x: 276.9, y: 301,},
                { x: 303, y: 215,},
                { x: 231, y: 161,},
                { x: 321, y: 161,},
            ];

            // Initiating a polygon object
            var star = new fabric.Polygon(points, {
                left: 100,
                top: 10,
                fill: "#000", 
                strokeWidth: 4,
                stroke: "#000",
                cornerColor: "blue",
                selectable: true,
                id: uuid(),
                item_name: 'star',
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'
            });

            this.canvas.c.add(star);
            this.canvas.c.centerObject(star);
            this.canvas.c.setActiveObject(star);
        },
        onDragend(type) {
            // todo drag and drop optimization this.canvas.editor.dragAddItem(event, item);
            switch (type) {
                case 'text':
                    this.addText(dragOption);
                    break;
                case 'textBox':
                    this.addTextBox(dragOption);
                    break;
                case 'rect':
                    this.addRect(dragOption);
                    break;
                case 'circle':
                    this.addCircle(dragOption);
                    break;
                case 'circle':
                    this.addEllipse(dragOption);
                    break;
                case 'triangle':
                    this.addTriangle(dragOption);
                    break;
                default:
            }
        },

        addText(option) {
            const text = new this.fabric.IText("Tidy Shopping", {
                ...defaultPosition,
                ...option,
                fontFamily: 'Courier New',
                fontSize: 60,
                id: uuid()
            });
            text.set("width", text.width);
            var rect = new fabric.Rect({
                height: 0,
                width: 0,
                fill: '',
                strokeWidth: 0,
                opacity: 100,
                id: "virtural",
                hasControls: true,
                hasRotatingPoint: true
            });
            var group = new fabric.Group([rect, text], {
                hasControls: true,
                hasRotatingPoint: true,
            });
            group.set({
                id: uuid(),
                left: 0 - group.width,
                customType: "text",
                item_name: this.canvas.editor.getName("text"),
                angle: 0,
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                texthandle: "automatic",
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                originPoistion: "left",
                objectCaching: false,
            });

            group.setCoords();
            this.canvas.c.add(group);
            rect.set("width", group.width * group.scaleX);
            rect.set("height", group.height * group.scaleY);
            this.canvas.c.centerObject(group);
            this.canvas.c.setActiveObject(group);
        },

        addImg(e) {
            const imgEl = e.target.cloneNode(true);
            const imgInstance = new this.fabric.Image(imgEl, {
                ...defaultPosition,
                id: uuid(),
                name: 'picturedefault',
            });
            this.canvas.c.add(imgInstance);
            this.canvas.c.renderAll();
        },

        addTextBox(option) {
            const text = new this.fabric.Textbox('everything_goes_well', {
                ...defaultPosition,
                ...option,
                splitByGrapheme: true,
                width: 400,
                fontSize: 80,
                id: uuid(),
            });
            this.canvas.c.add(text);
            if (!option) {
                text.center();
            }
            this.canvas.c.centerObject(text);
            this.canvas.c.setActiveObject(text);
        },
        addCircle(option) {
            this.$bvModal.hide('shape-modal'); 
            var name = this.canvas.editor.getName("circle");
            // this.getName('circle');
            const circle = new this.fabric.Circle({
                left: -200,
                radius: 150,
                fill: '#ffff05',
                id: uuid(),
                item_name: name,
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'

            });
            this.canvas.c.add(circle);
            this.canvas.c.centerObject(circle);
            this.canvas.c.setActiveObject(circle);
        },
        addTriangle() {
            this.$bvModal.hide('shape-modal'); 
            var name = this.canvas.editor.getName("triangle");
            const triangle = new this.fabric.Triangle({
                width: 150, 
                height: 100, 
                fill: '', 
                stroke: 'green', 
                strokeWidth: 3, 
                cornerColor: 'blue', 
                id: uuid(),
                item_name: name,
                objectCaching: false,
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                customType : 'shape'
            });
            this.canvas.c.add(triangle);
            this.canvas.c.centerObject(triangle);
            this.canvas.c.setActiveObject(triangle);
        },
        addPolygon() {
            this.$bvModal.hide('shape-modal'); 
            var name = this.canvas.editor.getName("polygon");
            const polygon = new this.fabric.Polygon([ 
                { x: 200, y: 10 }, 
                { x: 250, y: 50 }, 
                { x: 250, y: 180}, 
                { x: 150, y: 180}, 
                { x: 150, y: 50 }], { 
                    fill: '#000',
                    id: uuid(),
                    item_name: name,
                    position: {
                    positionX: "left",
                    positionY: "top"
                },
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                customType : 'shape'
            });
            this.canvas.c.add(polygon);
            this.canvas.c.centerObject(polygon);
            this.canvas.c.setActiveObject(polygon); 
        },
        addLine() {
            this.$bvModal.hide('shape-modal'); 
            var name = this.canvas.editor.getName("line");
            const line = new this.fabric.Line([
                    50, 10, 200, 150
                ],
                {
                    id: uuid(),
                    item_name: name,
                    stroke: '#000',
                    strokeWidth: 2,
                    objectCaching: false,
                    position: {
                        positionX: "left",
                        positionY: "top"
                    },
                    layerShowPeriod: {
                        mode: '',
                        startDate: '',
                        endDate: ''
                    },
                    customType : 'shape'
                }
            );
            this.canvas.c.add(line);
            this.canvas.c.centerObject(line);
            this.canvas.c.setActiveObject(line);
        },
        addEllipse() {
            // Hide the modal
            this.$bvModal.hide('shape-modal'); 

            var name = this.canvas.editor.getName("ellipse");
            const ellipse = new this.fabric.Ellipse({
                id: uuid(),
                item_name: name,
                rx: 80, 
                ry: 40, 
                fill: '', 
                stroke: '#4caf50', 
                strokeWidth: 3, 
                objectCaching: false,
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                customType : 'shape'
            });
            this.canvas.c.add(ellipse);
            this.canvas.c.centerObject(ellipse);
            this.canvas.c.setActiveObject(ellipse);
        },
        addRect(option) {
            this.$bvModal.hide('shape-modal'); 
            var name = this.canvas.editor.getName("rect");
            const rect = new this.fabric.Rect({
                left: -200,
                fill: '#1100ff',
                width: 400,
                height: 400,
                id: uuid(),
                item_name: name,
                tempValueForPadding: 0,
                layerShowPeriod: {
                    mode: '',
                    startDate: '',
                    endDate: ''
                },
                position: {
                    positionX: "left",
                    positionY: "top"
                },
                objectCaching: false,
                customType : 'shape'

            });
            this.canvas.c.add(rect);
            this.canvas.c.centerObject(rect);
            this.canvas.c.setActiveObject(rect);
        },

        drawingLineModeSwitch(isArrow) {
            this.isArrow = isArrow;
            this.isDrawingLineMode = !this.isDrawingLineMode;
            this.drawHandler.setMode(this.isDrawingLineMode);
            this.drawHandler.setArrow(isArrow);

            this.canvas.c.forEachObject((obj) => {
                if (obj.id !== 'workspace') {
                    obj.selectable = !this.isDrawingLineMode;
                    obj.evented = !this.isDrawingLineMode;
                }
            });
        },

    },
};
</script>

<style scoped lang="less">
.tool-box {
    display: flex;
    justify-content: space-around;

    span {
        flex: 1;
        text-align: center;
        padding: 5px 0;
        background: #f6f6f6;
        margin-left: 2px;
        cursor: pointer;

        &:hover {
            background: #edf9ff;

            svg {
                fill: #2d8cf0;
            }
        }
    }

    .bg {
        background: #d8d8d8;

        &:hover {
            svg {
                fill: #2d8cf0;
            }
        }
    }
}

.img {
    width: 20px;
}

#shape-modal {
    img {
        cursor: pointer;
    }
}
</style>
