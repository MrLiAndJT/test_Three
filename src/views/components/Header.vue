<template>
  <div class="header-wrap">Header</div>
</template>

<script lang="ts" setup name="Header"></script>

<style lang="scss" scoped>
@import '../style/var.scss';
.header-wrap {
  height: $headerHeight;
  border-bottom: 1px solid $borderColor;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
