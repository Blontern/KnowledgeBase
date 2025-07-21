# test
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Theme Data
<pre>{{ theme }}</pre>

## Page Data
<pre>{{ page }}</pre>

## Page Frontmatter
<pre>{{ frontmatter }}</pre>