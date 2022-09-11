<template>
  <div class="codeAuth">
    <md-popup v-model="showPop" :mask-closable="false" position="bottom">
      <md-popup-title-bar
        title="請輸入安全密碼"
        ok-text="取消"
        @confirm="onCancelClick"
      ></md-popup-title-bar>
      <div class="popup">
        <md-codebox
          ref="codebox"
          v-model="code"
          :maxlength="6"
          autofocus
          mask
          is-view
          justify
          @submit="submit"
        >
          <div class="md-captcha-footer" style="height:15px">
            <div class="md-captcha-error" style="padding-left:.5em;">
              {{ returnMsg }}
            </div>
            <button
              style="text-align: right;"
              class="md-captcha-btn"
              v-text="'忘記密碼？'"
              @click="forgetVerifyCode"
            ></button>
          </div>
        </md-codebox>
      </div>
    </md-popup>
  </div>
</template>

<script>
import {
  Popup,
  Button,
  Codebox,
  PopupTitleBar,
  Field,
  Toast
} from 'mand-mobile'
import { createTransaction } from '@/apis/LefunTrans'
export default {
  name: 'VerifyCodeAuth',
  components: {
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Codebox.name]: Codebox,
    [PopupTitleBar.name]: PopupTitleBar,
    [Field.name]: Field,
    [Toast.name]: Toast
  },
  props: {},
  watch: {},
  data () {
    return { showPop: false, code: '', returnMsg: '' }
  },
  methods: {
    showVerifyCodeAuth () {
      this.showPop = true
    },
    async submit (code) {
      if (code.length === 6) {
        Toast.info('處理中', 0)
        let time1 = Date.now()
        let res = await createTransaction(code)
        let time22 = (Date.now() - time1) / 1000
        Toast.hide()
        Toast.info(time22)
        if (res.resultCode === 1) {
          this.showPop = false
          this.$refs.codebox.code = ''
          this.$nextTick(() => {
            this.$emit('onVerifySuccess', res.resultData)
          })
        } else {
          this.$refs.codebox.code = ''
          this.returnMsg = res.resultDes
        }
      }
    },
    forgetVerifyCode () {
      this.$router.push({ name: 'RecoverPage' })
    },
    onCancelClick () {
      // this.$refs.codebox.code = ''
      this.code = ''
      this.returnMsg = ''
      this.showPop = false
    }
  }
}
</script>

<style scoped>
.popup {
  padding: 0.25em;
  padding-top: 0.5em;
  padding-bottom: 0px;
  position: relative;
  font-weight: 500;
  text-align: left;
  background-color: #fff;
}
</style>
