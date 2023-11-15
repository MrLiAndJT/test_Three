<template>
  <div class="configuration">
    <!-- a: {{ list }}
    <el-button @click="get">重新获取</el-button> -->
  </div>
</template>

<script lang="ts" setup name="Configuration">
import { computed } from 'vue'
// import useCanvas from '../data/render'

// const canvas = useCanvas()

// console.log('app: ', canvas.getApp())

// const list = computed(() => {
//   return canvas.getActiveData()
// })

// const get = () => {
//   console.log(canvas.getActiveData())
// }
</script>

<style lang="scss" scoped>
@import '../style/var.scss';
.configuration {
  width: $configWidth;
  border-left: 1px solid $borderColor;
}
</style>
