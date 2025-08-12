<template>
  <div 
    class="card" 
    :class="[layout, { 'has-profile': profile }, { 'has-list': hasList }]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="card-header">
      <div v-if="profile" class="avatar-container" :class="layout">
        <img 
          :src="profile" 
          alt="Profile" 
          class="avatar"
          :class="{ 'avatar-hover': isHovered }"
        />
      </div>
      <div class="title-container">
        <h3 class="name">{{ name }}</h3>
      </div>
    </div>

    <div class="card-content">
      <p class="desc">{{ desc }}</p>
    </div>

    <div v-if="hasList" class="card-footer">
      <ul class="feature-list">
        <li v-for="(item, index) in list" :key="index" class="feature-item">
          <svg class="list-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  profile: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  list: {
    type: Array,
    default: () => []
  },
  layout: {
    type: String,
    default: 'vertical', // 或 'horizontal'
    validator: value => ['vertical', 'horizontal'].includes(value)
  }
});

const hasList = computed(() => props.list && props.list.length > 0);
const isHovered = ref(false);
</script>

<style scoped>
.card {
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider-light);
  overflow: hidden;
  position: relative;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-light);
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

/* 垂直布局样式 */
.vertical .avatar-container {
  flex-shrink: 0;
}

.vertical .title-container {
  flex-grow: 1;
}

/* 水平布局样式 */
.horizontal .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.horizontal .avatar-container {
  order: 2;
}

.horizontal .title-container {
  order: 1;
  flex-grow: 1;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  transition: all 0.3s ease;
  border: 2px solid var(--vp-c-bg);
}

.avatar-hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-light);
}

.name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
  position: relative;
  display: inline-block;
}

.name::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--vp-c-brand);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.card:hover .name::after {
  width: 100%;
}

.desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 16px;
  font-size: 1rem;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--vp-c-divider-light);
}

.feature-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.feature-item:hover {
  color: var(--vp-c-text-1);
  transform: translateX(5px);
}

.list-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  fill: var(--vp-c-brand);
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .horizontal .avatar-container {
    order: 1;
    margin-bottom: 16px;
  }
  
  .horizontal .title-container {
    order: 2;
  }
  
  .avatar {
    width: 56px;
    height: 56px;
  }
  
  .name {
    font-size: 1.3rem;
  }
}
</style>