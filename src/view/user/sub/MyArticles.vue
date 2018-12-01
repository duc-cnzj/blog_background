<template>
    <div>
        <article-index :all="false"></article-index>
    </div>
</template>

<script>
import Index from '_c/article/Index'
export default {
  components: {
    ArticleIndex: Index
  }

}
</script>
