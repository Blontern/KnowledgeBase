<template>
  <div class="title-block" :style="{ backgroundColor: color }">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'TitleBlock',
  props: {
    title: String,        // 标题文本
    color: {              // 背景色 (默认浅蓝色)
      type: String,
      default: '#e3f2fd'
    }
  }
}
</script>

<style scoped>
.title-block {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 6px;
  font-size: 16px;
  box-shadow: 0 2px 3px rgba(0,0,0,0.1);
}
</style>