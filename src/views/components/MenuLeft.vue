<template>
  <div class="menu-left-wrap">
    <el-row>
      <el-col
        :span="4"
        v-for="item in menuList"
        :key="item.type"
        @dragstart="dragstart($event, item)"
      >
        <el-image :src="item.data.imgSrc"></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup name="MenuLeft">
import { tarnToStr } from '@/utils/index'
import { menuList } from '../data/menu'
import type { menuTtemType } from '../data/menu.d'

const dragstart = (event: DragEvent, data: menuTtemType) => {
  // console.log('data: ', data)
  if (event.dataTransfer) {
    // 复制组件信息
    event.dataTransfer.setData('screen/data', tarnToStr(data))
    // 保存拖拽开始鼠标的位置
    event.dataTransfer.setData('screen/startPosition', tarnToStr({ x: event.x, y: event.y }))
  }
}
</script>

<style lang="scss" scoped>
@import '../style/var.scss';
.menu-left-wrap {
  width: $menuWidth;
  border-right: 1px solid $borderColor;
}
</style>
