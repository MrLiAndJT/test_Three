<template>
  <el-scrollbar class="render-container-wrap">
    <div class="container" ref="containerDiv" @drop="onDrop" @dragover="onDragover"></div>
  </el-scrollbar>
</template>

<script lang="ts" setup name="RenderContainer">
import { onMounted, ref } from 'vue'
import type { menuTtemType } from '../data/menu.d'
import { tranToObj } from '@/utils/index'
import * as PIXI from 'pixi.js'
import type { Text } from 'pixi.js'

//  canvas 父级div
const containerDiv = ref<HTMLDivElement>()
// 渲染的数组
const renderArr = ref<menuTtemType[]>([])
// 创建应用
const app = new PIXI.Application({ width: 1920, height: 1080, background: '#fff' })
app.stage.eventMode = 'dynamic'
let dragTarget: PIXI.Sprite | null = null // 拖拽中的元素

// 拖拽添加事件
const onDrop = (event: DragEvent) => {
  if (!event.dataTransfer) return
  const data = tranToObj<menuTtemType>(event.dataTransfer.getData('screen/data'))
  data.position.left = event.offsetX
  data.position.top = event.offsetY
  data.id = renderArr.value.length + ''
  renderArr.value.push(data)
  render(data)
}
// 拖拽完成
const onDragover = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    // event.dataTransfer.effectAllowed = 'uninitialized';
  }
}

// 全局舞台拖拽中
const appDragMove = (event: PIXI.FederatedPointerEvent) => {
  if (!dragTarget) return
  dragTarget.parent.toLocal(event.global, undefined, dragTarget.position)
}

// 全局舞台拖拽完成
const appDragEnd = () => {
  if (!dragTarget) return
  app.stage.off('pointermove', appDragMove)
  dragTarget.alpha = 1
  dragTarget = null
}

app.stage.on('pointerup', appDragEnd)
app.stage.on('pointerupoutside', appDragEnd)

const render = (item: menuTtemType) => {
  let bunny: PIXI.Text | PIXI.Sprite

  if (item.type === 'text') {
    bunny = new PIXI.Text('我是文本输入')
  } else {
    bunny = PIXI.Sprite.from(item.data.imgSrc)
  }

  bunny.anchor.set(0.5, 0.5)
  bunny.x = item.position.left
  bunny.y = item.position.top

  if (item.type === 'fan') {
    app.ticker.add((num) => {
      bunny.rotation += 0.03
    })
  }

  bunny.cursor = 'move'
  console.log('bunny: ', bunny)
  app.stage.addChild(bunny)

  // ===

  // bunny.interactive = true
  bunny.eventMode = 'static'

  bunny.addEventListener('pointerdown', (event) => {
    dragTarget = bunny
    bunny.alpha = 0.5
    console.log('click')
    // =====

    // =====
    app.stage.addEventListener('pointermove', appDragMove)
  })
}

onMounted(() => {
  containerDiv.value?.appendChild(app.view as HTMLCanvasElement)
})
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
