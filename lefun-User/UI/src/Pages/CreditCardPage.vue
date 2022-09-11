<template>
  <div style="height:90vh;  background-color: #f5f5f5">
    <Nav />
    <CreditCard />
  </div>
</template>

<script>
import { Field, ActionBar, CellItem, Button, NoticeBar } from 'mand-mobile'
import Nav from '@/components/Nav.vue'
import CreditCard from '@/components/CreditCard'

export default {
  name: 'CreditCardPage',
  components: {
    [Field.name]: Field,
    [ActionBar.name]: ActionBar,
    [CellItem.name]: CellItem,
    [Button.name]: Button,
    [NoticeBar.name]: NoticeBar,
    Nav,
    CreditCard
  },
  props: {},
  data () {
    return {
      isActive: false,
      buttonData: [
        {
          text: '更換信用卡',
          disabled: false,
          onClick: this.handleClick
        }
      ]
    }
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'BindCreditCardPage' })
    }
  }
}
</script>
<style scoped>
</style>
