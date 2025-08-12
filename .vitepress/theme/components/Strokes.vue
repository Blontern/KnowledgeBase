<template>
  <div class="strokes-container">
    <div class="input-container">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="text"
          placeholder="请输入假名读音 (如: a, ka, shi)"
          @keyup.enter="loadImages"
          @blur="loadImages"
          class="search-input"
        />
        <button @click="loadImages" class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>
    <div class="images-container">
      <div class="image-section">
        <h3 class="section-title">平假名</h3>
        <div class="image-wrapper">
          <div v-if="loadingHira" class="loading">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
          <div v-else-if="hiraError" class="error">
            <div class="error-icon">!</div>
            <p>未找到对应的平假名动画</p>
          </div>
          <img
            v-else-if="hiraUrl"
            :src="hiraUrl"
            alt="平假名笔画动画"
            class="stroke-image"
          />
          <div v-else class="placeholder">
            <p>输入假名读音查看笔画动画</p>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="image-section">
        <h3 class="section-title">片假名</h3>
        <div class="image-wrapper">
          <div v-if="loadingKata" class="loading">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
          <div v-else-if="kataError" class="error">
            <div class="error-icon">!</div>
            <p>未找到对应的片假名动画</p>
          </div>
          <img
            v-else-if="kataUrl"
            :src="kataUrl"
            alt="片假名笔画动画"
            class="stroke-image"
          />
          <div v-else class="placeholder">
            <p>输入假名读音查看笔画动画</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Strokes",
  data() {
    return {
      inputValue: "",
      hiraUrl: "",
      kataUrl: "",
      loadingHira: false,
      loadingKata: false,
      hiraError: false,
      kataError: false,
    };
  },
  methods: {
    // 修正假名读音输入
    correctPronunciation(input) {
      const correctionMap = {
        si: "shi",
        xi: "shi",
        ti: "chi",
        tu: "tsu",
        cu: "tsu",
        hu: "fu",
      };
      const normalized = input.trim().toLowerCase();
      return correctionMap[normalized] || normalized;
    },

    loadImages() {
      if (!this.inputValue.trim()) return;

      // 重置状态
      this.hiraError = false;
      this.kataError = false;
      this.hiraUrl = "";
      this.kataUrl = "";
      // 获取修正后的读音

      const correctedValue = this.correctPronunciation(this.inputValue);
      this.loadHiragana(correctedValue);
      this.loadKatakana(correctedValue);
    },

    loadHiragana(pronunciation) {
      this.loadingHira = true;
      this.hiraError = false;
      const img = new Image();
      img.src = `image/hira/${pronunciation}.gif`;
      img.onload = () => {
        this.hiraUrl = img.src;
        this.loadingHira = false;
      };
      img.onerror = () => {
        this.hiraError = true;
        this.loadingHira = false;
      };
    },

    loadKatakana(pronunciation) {
      this.loadingKata = true;
      this.kataError = false;
      const img = new Image();
      img.src = `image/kata/${pronunciation}.gif`;
      img.onload = () => {
        this.kataUrl = img.src;
        this.loadingKata = false;
      };
      img.onerror = () => {
        this.kataError = true;
        this.loadingKata = false;
      };
    },
  },
};
</script>

<style scoped>
.strokes-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.input-container {
  margin: 2rem 0;
}

.input-group {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.input-group:focus-within {
  box-shadow: 0 6px 16px rgba(66, 133, 244, 0.3);
  transform: translateY(-2px);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1.1rem;
  outline: none;
  background: #f8f9fa;
}

.search-button {
  padding: 0 1.8rem;
  border: none;
  background: #4285f4;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: #3367d6;
}

.images-container {
  display: flex;
  margin-top: 2rem;
  gap: 2rem;
}

.image-section {
  flex: 1;
  text-align: center;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 3px;
  background: #4285f4;
  border-radius: 3px;
}

.image-wrapper {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.stroke-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  animation: fadeIn 0.6s ease;
}

.placeholder,
.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.loading .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(66, 133, 244, 0.2);
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

.error .error-icon {
  width: 60px;
  height: 60px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.divider {
  width: 1px;
  background: #e0e0e0;
  margin: 0 1rem;
}

@media (max-width: 768px) {
  .images-container {
    flex-direction: column;
    gap: 3rem;
  }

  .divider {
    width: 100%;
    height: 1px;
    margin: 1rem 0;
  }

  .input-group {
    max-width: 100%;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
