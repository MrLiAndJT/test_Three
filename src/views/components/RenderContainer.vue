<template>
  <el-scrollbar class="render-container-wrap">
    <v-stage
      :config="stageConfig"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
      ref="stage"
    >
      <v-layer ref="layer">
        <template v-for="item in rectangles" :key="item.name">
          <v-shape
            v-if="typeof item.sceneFunc === 'function'"
            :config="item"
            @transformend="handleTransformEnd"
            @dragend="handleTransformEnd"
          />
          <v-rect
            v-else
            :config="item"
            @transformend="handleTransformEnd"
            @dragend="handleTransformEnd"
          />
        </template>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </el-scrollbar>
</template>

<script lang="ts" setup name="RenderContainer">
import Konva from 'konva'
import { onMounted, reactive, ref } from 'vue'
import type { ShapeConfig } from 'konva/lib/Shape'
import type { RectConfig } from 'konva/lib/shapes/Rect'
import type { ImageConfig } from 'konva/lib/shapes/Image'
import type { KonvaPointerEvent } from 'konva/lib/PointerEvents'
import type { KonvaNodeEvent } from 'konva/lib/types'

const stage = ref()
const layer = ref()
const transformer = ref()

const stageConfig = reactive({
  width: 1920,
  height: 1080
})

const rectangles = reactive<(ShapeConfig | RectConfig | ImageConfig)[]>([
  {
    rotation: 0,
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: 'red',
    name: 'rect1',
    draggable: true
  },
  {
    x: 200,
    y: 200,
    width: 100,
    height: 50,
    sceneFunc(context, shape) {
      // const x = shape.getAttr('x')
      // const y = shape.getAttr('y')
      const x = 0
      const y = 0
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      context.beginPath()
      context.fillStyle = '#abcdef'
      // context.fill()
      context.fillRect(x, y, width, height)
      context.closePath()
    },
    hitFunc(context, shape) {
      // const x = shape.getAttr('x')
      // const y = shape.getAttr('y')
      const x = 0
      const y = 0
      context.beginPath()
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      context.rect(x, y, width, height)
      context.closePath()
      context.fillStrokeShape(shape)
    },
    name: 'shape1',
    draggable: true
  },
  {
    rotation: 0,
    x: 350,
    y: 50,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    // fill: 'pink',
    name: 'rect2',
    draggable: true,
    strokeWidth: 2,
    stroke: '#5e5e5e',
    lineCap: 'round',
    lineJoin: 'round'
  }
])

let selectedShapeName = ''
const handleTransformEnd = (e: KonvaPointerEvent) => {
  const rect = rectangles.find((r) => r.name === selectedShapeName)
  // update the state
  if (!rect) {
    return
  }
  rect.x = e.target.x()
  rect.y = e.target.y()
  rect.rotation = e.target.rotation()
  rect.scaleX = e.target.scaleX()
  rect.scaleY = e.target.scaleY()

  // // change fill
  // rect.fill = Konva.Util.getRandomColor()
}

const handleStageMouseDown = (e: KonvaPointerEvent) => {
  // clicked on stage - clear selection
  if (e.target === e.target.getStage()) {
    selectedShapeName = ''
    updateTransformer()
    return
  }
  // clicked on transformer - do nothing
  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) {
    return
  }

  // find clicked rect by its name
  const name = e.target.name()
  const rect = rectangles.find((r) => r.name === name)
  if (rect) {
    selectedShapeName = name
  } else {
    selectedShapeName = ''
  }
  updateTransformer()
}

const updateTransformer = () => {
  const transformerNode = transformer.value.getNode()
  const stage = transformerNode.getStage()
  const selectedNode = stage.findOne('.' + selectedShapeName)
  // do nothing if selected node is already attached
  if (selectedNode === transformerNode.node()) {
    return
  }

  if (selectedNode) {
    // attach to another node
    transformerNode.nodes([selectedNode])
  } else {
    // remove transformer
    transformerNode.nodes([])
  }
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.render-container-wrap {
  flex: 1;
  .container {
    width: 1920px;
    height: 1080px;
  }
}
</style>
