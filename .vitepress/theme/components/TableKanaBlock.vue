<template>
  <div class="kana-block" @click="playAudio">
    <div class="character">{{ character }}</div>
    <div class="pronunciation">{{ pronunciation }}</div>
    <audio ref="audioEl" :src="audioUrl" hidden></audio>
  </div>
</template>

<script>
export default {
  name: 'KanaBlock',
  props: {
    character: String,     // 日文字形 (如 "あ")
    pronunciation: String, // 罗马音 (如 "a")
    audioUrl: String       // 音频文件路径
  },
  methods: {
    playAudio() {
      if (this.$refs.audioEl) {
        this.$refs.audioEl.currentTime = 0;
        this.$refs.audioEl.play().catch(e => console.log("播放失败:", e));
      }
    }
  }
}
</script>

<style scoped>
.kana-block {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.kana-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.character {
  font-size: 14px;
  margin-bottom: -5px;
  font-weight: 500;
}

.pronunciation {
  font-size: 14px;
  color: #666;
  letter-spacing: 0.5px;
}
</style>