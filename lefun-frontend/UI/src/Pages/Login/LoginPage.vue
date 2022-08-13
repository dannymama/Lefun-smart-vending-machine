<template>
  <md-field style="margin:.5em; mmargin-top:.2em">
    <div
      style="font-size:15px;"
      slot="action"
      @click="$router.push({ name: 'AboutPage' })"
    >
      關於樂坊
    </div>

    <div class="md-result">
      <img width="100%" src="/png08-01.png" />
    </div>
    <div style="">
      <md-button
        style="margin-bottom: 10px;"
        type="primary"
        @click="$router.push('loginbysms')"
        >手機簡訊 註冊/登入</md-button
      >
      <!-- <div class="sep">
        <div class="septext">或使用社群 註冊/登入</div>
      </div>
      <div class="md-example-section">
        <fbAuth
          title="Facebook"
          styleString="background-color: #3b5998; width:50%; margin-bottom: 10px;"
          @onVerifySuccess="onVerifySuccess_fb"
        />
        <GoogleAuth
          type="default"
          title="Google"
          styleString="width:50%; margin-bottom: 10px;"
          @onVerifySuccess="onVerifySuccess_google"
        />
      </div> -->
      <div>
        <ConfirmTerm title="註冊登入表示同意" style="color:#858b9c" />
      </div>

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
  </md-field>
</template>

<script>
import {
  Field,
  Dialog,
  Toast,
  Button,
  Icon,
  ResultPage,
  Landscape,
  Swiper,
  SwiperItem
} from 'mand-mobile'
import ConfirmTerm from '@/components/ConfirmTerm'
import fbAuth from '@/components/FBAuth'
import GoogleAuth from '@/components/GoogleAuth'
import { doLoginByFacebook, doLoginByGoogle } from '@/apis/LoginInfo'
import Cookies from 'js-cookie'

export default {
  name: 'LoginPage',
  title: 'Carousel',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [ResultPage.name]: ResultPage,
    [Landscape.name]: Landscape,
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    Dialog,
    Toast,
    fbAuth,
    GoogleAuth,
    ConfirmTerm
  },
  data () {
    return { showLandingpage: false }
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
    async onVerifySuccess_fb (fbRes) {
      Toast.loading('處理中', 0)
      let res = await doLoginByFacebook(fbRes.fb_accesstoken)
      Toast.hide()
      if (res.resultCode === 1) {
        await this.$store.dispatch('Login', res.resultData.login_token)
        // await this.$store.dispatch('GetInfo')
        Toast.info('登入成功')
        this.$router.push('/')
      } else if (res.resultCode === 6) {
        this.$router.push({
          name: 'RegisterPage',
          params: { type: 'Facebook', fbRes: fbRes }
        })
      } else {
        Dialog.failed({
          title: res.resultDes,
          content: res.resultMessage,
          confirmText: '確定'
        })
      }
    },
    async onVerifySuccess_google (googleRes) {
      Toast.loading('處理中', 0)
      let res = await doLoginByGoogle(googleRes.google_accesstoken)
      Toast.hide()
      if (res.resultCode === 1) {
        await this.$store.dispatch('Login', res.resultData.login_token)
        // await this.$store.dispatch('GetInfo')
        Toast.info('登入成功')
        this.$router.push('/')
      } else if (res.resultCode === 6) {
        this.$router.push({
          name: 'RegisterPage',
          params: { type: 'Google', googleRes: googleRes }
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
.md-example-section {
  float: left;
  width: 100%;
  margin-bottom: 10px;
}

.sep {
  height: 20px;
  width: 100%;
  max-width: 100%;
  margin: 0.7em 0 0.4em;
  border-bottom: 3px solid #ebedf0;
}
.septext {
  max-width: 300px;
  margin: 0px auto 0;
  display: block;
  z-index: 100;
  color: #999;
  background: #ffffff;
  text-align: center;
  font-size: 30px;
}

.img-overlay-left {
  position: absolute;
  bottom: 0;
  left: 0.4em;
  margin: 1.5em;
  z-index: 100;
}

.img-overlay-right {
  position: absolute;
  bottom: 0;
  right: 0.4em;
  margin: 1.5em;
  z-index: 100;
}
</style>