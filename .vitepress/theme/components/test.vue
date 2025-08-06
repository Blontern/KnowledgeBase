<script setup>  
import {reactive} from "vue";  
  
//鸡汤语录  
//这里是写的固定内容，也可以改为使用接口获取数据
// fetch('https://example.com/api/data')
const saying = [  
    "心若有所向往，何惧道阻且长。",  
    "你只管努力，剩下的交给时间。",  
    "如今我努力奔跑，不过是为了追上那个曾经被寄予厚望的自己。 —— 约翰.利文斯顿",  
    "成功的秘诀就是每天都比别人多努力一点。",  
    "选一个方向，定一个时间；剩下的只管努力与坚持，时间会给我们最后的答案。",  
    "你可以走慢点，但千万别后退",  
    "你的压力来源于无法自律只是假装努力"  
]  
  
const $data = reactive({   saying  })  
  
function randomSay() {  
    return saying[getRandomInt(0, saying.length - 1)]  
}  
  
function getRandomInt(min, max) {  
    min = Math.ceil(min);  
    max = Math.floor(max);  
    return Math.floor(Math.random() * (max - min + 1)) + min;  
}
</script>  
  
<!-- 随机显示 -->  
<template>  
  <div class="saying" v-html="randomSay()"></div>  
</template>  
  
<style scoped>  
  
.saying {  
  border-color: var(--vp-custom-block-tip-border);  
  color: var(--vp-custom-block-tip-text);  
  background-color: var(--vp-custom-block-tip-bg);  
  
  border: 1px solid var(--vp-custom-block-tip-border);  
  border-radius: 8px;  
  padding: 16px 16px 8px;  
  line-height: 24px;  
  font-size: var(--vp-custom-block-font-size);  
}  
  
</style>