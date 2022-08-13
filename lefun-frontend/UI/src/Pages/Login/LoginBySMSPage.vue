<template>
  <div class="test">
    <md-field>
      <div
        style="font-size:15px;"
        slot="action"
        @click="$router.push({ name: 'AboutPage' })"
      >
        關於樂坊
      </div>
      <div class="md-result" style="margin-top:1em;margin-bottom:.5em;">
        <md-icon
          name="lefun_big"
          style="width:3.5em; height:2em;"
          svg
        ></md-icon>
      </div>
      <md-input-item
        v-model="phone_number"
        title="請輸入台灣手機號碼"
        placeholder="請輸入台灣手機號碼"
        is-title-latent
        :maxlength="10"
        type="digit"
        clearable
      ></md-input-item>
    </md-field>
    <md-number-keyboard type="simple" ref="NumberKeyBoard"></md-number-keyboard>
    <SMSAuth
      :phone_number="phone_number"
      buttonContext="取得驗證碼"
      :countDown="10"
      @onVerifySuccess="onVerifySuccess"
    />
    <ConfirmTerm
      title="登入註冊表示同意"
      style="margin:1em; margin-top:2em; color:#858b9c"
    />

    <md-landscape v-model="showLandingpage" full-screen>
      <md-swiper :is-loop="false" transition="fade" ref="swiper">
        <md-swiper-item style="width:100%;">
          <img
            style="width:100%"
            src="https://thepreviewapp.com/wp-content/uploads/2018/06/how-to-use-igtv-instagram-app-tutorial.jpg"
          />
        </md-swiper-item>
        <md-swiper-item style="width:100%">
          <img
            style="width:100%"
            src="https://thepreviewapp.com/wp-content/uploads/2017/03/how-to-schedule-insta-stories-preview-app-0.jpg"
          />
        </md-swiper-item>
      </md-swiper>
      <!-- <div class="img-overlay-left">
          <md-button
            style="font-size:1.2em; font-weight: bold;"
            type="link"
            size="small"
            plain
            @click="showListen = false"
            >跳過</md-button
          >
        </div>
        <div class="img-overlay-right">
          <md-button
            style="font-size:1.4em; font-weight: bold;"
            type="link"
            size="small"
            plain
            @click="$refs.swiper.next()"
            >→</md-button
          >
        </div> -->
    </md-landscape>
  </div>
</template>

<script>
import {
  InputItem,
  Field,
  NumberKeyboard,
  Dialog,
  Toast,
  Icon,
  Swiper,
  SwiperItem,
  Landscape
} from 'mand-mobile'
import SMSAuth from '@/components/SMSAuth.vue'
import { doLoginBySMS } from '@/apis/LoginInfo'
import ConfirmTerm from '@/components/ConfirmTerm'
import Cookies from 'js-cookie'

export default {
  name: 'test',
  title: 'Carousel',
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [Icon.name]: Icon,
    [Landscape.name]: Landscape,
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    Dialog,
    Toast,
    SMSAuth,
    ConfirmTerm
  },
  data () {
    return {
      phone_number: '',
      showLandingpage: false
    }
  },
  mounted () {
    if (Cookies.get('showLandingPage') === '1') {
      this.showLandingpage = false
    } else {
      this.showLandingpage = true
      Cookies.set('showLandingPage', 1)
    }
  },
  methods: {
    async onVerifySuccess (sms_token) {
      Toast.loading('處理中', 0)
      let res = await doLoginBySMS(sms_token)
      Toast.hide()
      if (res.resultCode === 1) {
        await this.$store.dispatch('Login', res.resultData.login_token)
        // await this.$store.dispatch('GetInfo')
        Toast.info('登入成功')
        this.$router.push('/')
      } else if (res.resultCode === 6) {
        this.$router.push({
          name: 'RegisterPage',
          params: { type: 'SMS', sms_token: sms_token }
        })
      } else {
        Dialog.failed({
          title: res.resultDes,
          content: res.resultMessage,
          confirmText: '確定'
        })
      }
    }
  }
}
</script>

<style>
.test {
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>