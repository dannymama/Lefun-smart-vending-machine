<template>
  <div>
    <Nav />
    <Tappay
      ref="tappay"
      style="margin-top:.5em; height:100vh;"
      @update="check"
      @getPrimeResponse="getPrimeResponse"
      @onError="onError"
    />
    <md-action-bar :actions="buttonData"></md-action-bar>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import Tappay from '@/components/Tappay'
import { ActionBar, Toast, Dialog } from 'mand-mobile'
import { updateUserPayment } from '@/apis/User'
export default {
  name: 'BindCreditCardPage',
  components: {
    [ActionBar.name]: ActionBar,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    Nav,
    Tappay
  },
  props: {},
  data () {
    return {
      buttonData: [
        {
          text: '確認',
          disabled: true,
          onClick: this.getPrime
        }
      ],
      canGetPrime: false
    }
  },
  mounted () {},
  methods: {
    check (update) {
      this.canGetPrime = update.canGetPrime
      this.buttonData[0].disabled = !update.canGetPrime
    },
    async getPrimeResponse (data) {
      Dialog.confirm({
        title: '是否確認更換信用卡',
        content:
          '為確認您的信用卡為有效卡片，系統會自動試刷1元，但不會實際向銀行請款，請放心使用',
        confirmText: '確定',
        onConfirm: async () => {
          Toast.loading('處理中', 0)
          let res = await updateUserPayment(data.card.prime)
          await this.$store.dispatch('GetInfo')
          Toast.hide()
          if (res.resultCode === 1) {
            Toast.info('更換成功')
            this.$router.go(-1)
          }
        }
      })
      // this.$router.go(-1)
    },
    getPrime () {
      this.$refs.tappay.getPrime()
    },
    onError () {
      Dialog.confirm({
        title: '初始化異常',
        content: 'Tappay頁面初始化異常',
        confirmText: '確定',
        onConfirm: async () => {
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
