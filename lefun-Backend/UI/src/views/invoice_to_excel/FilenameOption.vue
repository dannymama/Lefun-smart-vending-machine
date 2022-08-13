<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;">檔案名稱:</label>
    <el-input
      v-model="filename"
      placeholder="輸入檔案名稱 (預設檔名 invoice)"
      style="width:345px;"
      prefix-icon="el-icon-document"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>