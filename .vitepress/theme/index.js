// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import "../utils/obsidianCallout.css"

import LSHomeFeatures from './components/LSHomeFeatures.vue'
import CodeSteps from './components/CodeSteps.vue'
import Table from './components/Table.vue'
import Strokes from './components/Strokes.vue'
import Card from './components/Card.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-features-after': () => h(LSHomeFeatures),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('CodeSteps', CodeSteps)
    app.component('Table', Table)
    app.component('Strokes', Strokes)
    app.component('Card', Card)
  }
}
