<template>
  <md-button :type="type" :style="styleString" @click="fbLogin" inline>
    <div style="line-height:0">
      <md-icon
        style="width:1.5em;; height: 1.5em;"
        name="facebook_white"
        svg
      ></md-icon>
    </div>
    {{ title }}
  </md-button>
</template>

<script>
import { Button, ActivityIndicator, Dialog, Icon } from 'mand-mobile'
import '../icons/facebook_white.svg'
// import '@/assets/fb'

export default {
  name: 'FBAuth',
  components: {
    [Button.name]: Button,
    [ActivityIndicator.name]: ActivityIndicator,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon
  },
  props: {
    title: { default: '', type: String },
    type: { default: 'primary', type: String },
    styleString: { default: '', type: String }
  },
  mounted () {
    // window.fbAsyncInit = function () {
    //   FB.init({
    //     // eslint-disable-line
    //     appId: '1067869950062672',
    //     cookie: true, // enable cookies to allow the server to access the session
    //     xfbml: true, // parse social plugins on this page
    //     version: 'v2.9' // use graph api version 2.8
    //   })
    //   FB.AppEvents.logPageView()
    // }
  },
  data () {
    return {
      button_processing: false
    }
  },
  methods: {
    async onButtonClick () {},
    fbLogin () {
      let vm = this
      let fbRes = { fb_accesstoken: '', fb_username: '', fb_userid: '' }
      vm.button_processing = true
      FB.login(
        function (response) {
          vm.button_processing = false
          fbRes.fb_accesstoken = response.authResponse.accessToken
          FB.api('/me?fields=name,id,email', function (response) {
            fbRes.fb_username = response.name.replace(/ /g, '')
            fbRes.fb_userid = response.id
            vm.$emit('onVerifySuccess', fbRes)
          })
        },
        {
          scope: 'email, public_profile',
          return_scopes: true
        }
      )
    }
  }
}
</script>
<style>
</style>