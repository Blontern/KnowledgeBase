<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import LSFeatures from './LSFeatures.vue'

export interface SuperFeature {
  title: string
  items: Feature[]
}

export interface Feature {
  icon?: DefaultTheme.FeatureIcon
  title: string
  details: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
}

defineProps<{
  superfeatures: SuperFeature[]
}>()
</script>

<template>
  <div v-if="superfeatures" class="LSSuperFeatures">
    <div class="container">
      <div 
        v-for="(group, index) in superfeatures" 
        :key="index" 
        class="group"
      >
        <h2 class="title">{{ group.title }}</h2>
        <LSFeatures :features="group.items" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.LSSuperFeatures {
  position: relative;
  padding: 0 24px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.group {
  margin-bottom: 64px;
}

.title {
  padding-top: 24px;
  padding-bottom: 24px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider-light);
  margin-bottom: 32px;
}

@media (min-width: 640px) {
  .LSSuperFeatures {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .LSSuperFeatures {
    padding: 0 64px;
  }
  
  .title {
    font-size: 28px;
  }
}
</style>