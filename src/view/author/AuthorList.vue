<template>
  <div>
    <Card :bordered="false">
      <p slot="title">博客作者列表</p>
      <author-list></author-list>
    </Card>
  </div>
</template>

<script>
import Index from '_c/author/Index'
export default {
  components: {
    AuthorList: Index
  }
}
</script>
