<template>
  <div>
    <canvas ref="canvas" width="1000" height="600"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()

const img = new Image()
img.src = 'https://topo.thingjs.com/rsm/1672120633041/fcuq1g4y3ecyyt47-20221018.svg'

const img2 = new Image()
img2.src = 'https://topo.thingjs.com/rsm/1672120632799/yimgevesmxi6h47t-20221018.svg'

let rotate = 0
let offset = 40

const render = () => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  const draw = () => {
    // 清除画布
    ctx.clearRect(0, 0, 1000, 600)
    // 执行动画
    requestAnimationFrame(draw)
    // 风扇旋转角度增加
    rotate += 5

    // 水流流动
    offset -= 1
    if (offset <= 0) {
      offset = 40
    }

    // 绘画风扇
    ctx.save()
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
    ctx.translate(24 + 50 / 2, 8 + 50 / 2)
    ctx.rotate((Math.PI / 180) * rotate)
    ctx.drawImage(img2, 0, 0, img2.width, img2.height, -50 / 2, -50 / 2, 50, 50)
    ctx.restore()

    // 绘画水管
    ctx.save()
    const waterPipeWidth = 400
    const waterPipeHeight = 20
    const gradient = ctx.createLinearGradient(200, 200, 200, 220)
    gradient.addColorStop(0, 'rgb(206, 208, 211)')
    gradient.addColorStop(0.5, 'rgb(252, 252, 252)')
    gradient.addColorStop(1, 'rgb(206, 208, 211)')
    ctx.fillStyle = gradient
    ctx.fillRect(200, 200, waterPipeWidth, waterPipeHeight)

    // 水流
    ctx.setLineDash([20, 20])
    ctx.lineDashOffset = offset
    ctx.beginPath()
    ctx.moveTo(200, 210)
    ctx.lineWidth = 10
    ctx.strokeStyle = '#abcdef'
    ctx.lineTo(waterPipeWidth + 200, 210)
    ctx.stroke()
    ctx.restore()
  }

  draw()
}

onMounted(() => {
  img.onload = () => {
    console.log(img2.width)
    console.log(img2.height)
    img2.onload = () => {
      render()
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid #000;
}
</style>
