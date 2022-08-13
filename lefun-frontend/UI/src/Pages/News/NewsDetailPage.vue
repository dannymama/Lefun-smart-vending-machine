<template>
  <div v-if="NewsObj !== null">
    <Nav :title="NewsObj.title" />
    <md-field>
      <md-field-item :content="NewsObj.title">
        <div
          id="context"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
          slot="children"
          v-html="NewsObj.context"
        ></div>
      </md-field-item>
    </md-field>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import { Field, FieldItem, CellItem } from 'mand-mobile'
import { getNewsContent } from '@/apis/News'
export default {
  name: 'NewsDetailPage',
  components: {
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [CellItem.name]: CellItem,
    Nav
  },
  data () {
    return {
      list: 5,
      isFinished: false,
      isPopupShow: false,
      NewsObj: null
    }
  },
  async mounted () {
    let res = await getNewsContent(this.$route.params.newsID)
    this.NewsObj = res.resultData
  },
  methods: {}
}
</script>

<style>
.holder {
  display: block;
  width: 88px;
  height: 88px;
  background-color: #e6e6e6;
}
#context img {
  width: 100%;
}
</style>