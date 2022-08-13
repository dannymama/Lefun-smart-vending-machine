<template>
  <div>
    <md-button
      :type="type"
      :inactive="!canSendSMS()"
      :loading="send_sms_button_processing"
      @click="onButtonClick"
    >
      <!-- <md-activity-indicator
        v-if="send_sms_button_processing"
        type="carousel"
        :size="10"
        color="#fff"
        text-color="#fff"
      ></md-activity-indicator> -->
      <span v-if="!send_sms_button_processing">{{ getButtonContext() }}</span>
    </md-button>

    <md-captcha
      ref="captcha"
      v-model="showCaptcha"
      title="請輸入驗證碼"
      :maxlength="captchaMaxlength"
      :system="false"
      :mask="false"
      :count="countDown"
      count-normal-text="重新發送"
      count-active-text="重新發送 {$1}s"
      @submit="submit"
      @show="onShow"
      @hide="onHide"
      @send="onSend"
      >{{ content }}</md-captcha
    >
  </div>
</template>

<script>
import {
  ActionBar,
  Toast,
  Captcha,
  Button,
  ActivityIndicator,
  Dialog
} from 'mand-mobile'
import { stringify } from 'querystring'
import { sendSMS, verifySMS } from '@/apis/SMSAuth'
import SimpleVueValidation from 'simple-vue-validator'

const Validator = SimpleVueValidation.Validator

export default {
  name: 'SMSAuth',
  components: {
    [ActionBar.name]: ActionBar,
    [Captcha.name]: Captcha,
    [Button.name]: Button,
    [ActivityIndicator.name]: ActivityIndicator,
    [Dialog.name]: Dialog
  },
  props: {
    phone_number: { default: '', type: String },
    buttonContext: { default: '取得驗證碼', type: String },
    countDown: { default: 120, type: Number },
    type: { default: 'primary', type: String }
  },
  watch: {
    phone_number (val) {
      this.checkPhoneNum()
    }
  },
  mounted () {
    this.checkPhoneNum()
  },
  validators: {
    phone_number: function (value) {
      return Validator.value(value)
        .required()
        .regex('^09[0-9]{8}$', '請輸入正確手機格式')
    }
  },
  data () {
    return {
      captchaMaxlength: 6,
      showCaptcha: false,
      is_first_time_show_captcha: true,
      send_sms_button_processing: false,
      verify_sms_processing: false,
      content: '',
      sms_token: '',
      isCoolDown: false,
      isPhoneNumValid: false,
      coolDownSecond: this.countDown
    }
  },
  methods: {
    async onButtonClick () {
      if (!this.send_sms_button_processing) {
        this.send_sms_button_processing = true
        let res = await this.sendSMS(this.phone_number)
        this.send_sms_button_processing = false
      }
    },
    getButtonContext () {
      if (this.isCoolDown) {
        return this.buttonContext + '(' + this.coolDownSecond + ')'
      }
      return this.buttonContext
    },
    canSendSMS () {
      return this.isPhoneNumValid && !this.isCoolDown
    },
    doCountDown () {
      this.isCoolDown = true
      this.coolDownSecond = this.countDown
      let interval = setInterval(() => {
        this.coolDownSecond--

        if (this.coolDownSecond < 0) {
          clearInterval(interval)
          this.isCoolDown = false
        }
      }, 1000)
    },
    async checkPhoneNum () {
      if (this.phone_number === '') {
        this.isPhoneNumValid = false
        return
      }
      if (await this.$validate(['phone_number'])) {
        this.isPhoneNumValid = true
      } else {
        this.isPhoneNumValid = false
      }
    },
    async submit (val) {
      if (val.length === this.captchaMaxlength && !this.verify_sms_processing) {
        Toast.loading('處理中', 0)
        this.verify_sms_processing = true
        let res = await verifySMS(this.sms_token, val)
        Toast.hide()
        if (res.resultCode === 1) {
          this.showCaptcha = false
          this.isCoolDown = false
          this.coolDownSecond = -1
          this.$emit('onVerifySuccess', this.sms_token)
        } else {
          this.$refs.captcha.setError(res.resultDes)
          this.$refs.captcha.code = ''
        }
        this.verify_sms_processing = false
      }
    },
    async onSend (res) {
      if (this.is_first_time_show_captcha) {
        this.is_first_time_show_captcha = false
      } else {
        this.sendSMS(this.phone_number)
      }
    },
    onShow () {},
    onHide () {
      this.init()
    },
    async sendSMS (phone_number) {
      this.init()
      let res = await sendSMS(phone_number)
      if (res.resultCode === 1) {
        this.doCountDown()
        this.sms_token = res.resultData.sms_token
        this.showCaptcha = true
        this.send_sms_button_processing = false
        this.content = '已發送至 ' + phone_number
      }
      return res
    },
    init () {
      this.sms_token = ''
      this.content = ''
      this.$refs.captcha.countdown()
      this.$refs.captcha.setError('')
    },
    showFailedDialog (msg) {
      Dialog.closeAll()
      Dialog.failed({
        title: '簡訊發送失敗',
        content: msg
      })
    }
  }
}
</script>
<style>
</style>