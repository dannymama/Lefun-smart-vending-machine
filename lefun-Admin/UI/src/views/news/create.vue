<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/NewsDetail'

export default {
  name: 'CreateForm',
  components: { ArticleDetail }
}
</script>

