<script setup lang="ts">
import { useData } from 'vitepress'
import LSSuperFeatures from './LSSuperFeatures.vue'

const { frontmatter: fm } = useData()
</script>

<template>
  <LSSuperFeatures
    v-if="fm.superfeatures"
    class="VPHomeFeatures"
    :superfeatures="fm.superfeatures"
  />
</template>