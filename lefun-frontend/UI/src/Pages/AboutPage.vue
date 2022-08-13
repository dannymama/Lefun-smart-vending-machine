<template>
  <div style="height:90vh;  background-color: #f5f5f5">
    <Nav />
    <About />
  </div>
</template>

<script>
import { Field, ActionBar, CellItem, Button } from 'mand-mobile'
import Nav from '@/components/Nav.vue'
import About from '@/components/About'

export default {
  name: 'AboutPage',
  components: {
    [Field.name]: Field,
    [ActionBar.name]: ActionBar,
    [CellItem.name]: CellItem,
    [Button.name]: Button,
    Nav,
    About
  },
  props: {},
  data () {
    return {}
  },
  methods: {}
}
</script>
<style scoped>
</style>
