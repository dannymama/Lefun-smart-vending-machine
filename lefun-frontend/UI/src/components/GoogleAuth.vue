<template>
  <md-button :type="type" :style="styleString" @click="onclick" inline>
    <div style="line-height:0">
      <md-icon style="width:1.5em;; height: 1.5em;" name="google" svg></md-icon>
    </div>
    {{ title }}
  </md-button>
</template>

<script>
import { Button, ActivityIndicator, Dialog, Icon } from 'mand-mobile'
import '../icons/google.svg'
import Cookies from 'js-cookie'

export default {
  name: 'GoogleAuth',
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
    if (!window.gapi) {
      err(
        '"https://apis.google.com/js/api:client.js" needs to be included as a <script>.'
      )
    }
  },
  data () {
    return {
      button_processing: false
    }
  },
  methods: {
    onclick () {
      let vm = this
      let googleRes = {
        google_accesstoken: '',
        google_username: '',
        google_userid: ''
      }
      window.gapi.load('auth2', () => {
        const auth2 = window.gapi.auth2.init({
          client_id:
            '1016522501275-vq85rihdgijcpihd68pg63dmqd00m928.apps.googleusercontent.com'
        })

        try {
          auth2.signIn().then(
            googleUser => {
              Cookies.set(
                'GoogleProfileURL',
                googleUser.getBasicProfile().getImageUrl(),
                {
                  expires: 30
                }
              )
              googleRes.google_accesstoken = googleUser.getAuthResponse().id_token
              googleRes.google_username = googleUser
                .getBasicProfile()
                .getName()
                .replace(/ /g, '')
              vm.$emit('onVerifySuccess', googleRes)
            },
            error => {
              vm.$emit('error', error)
              vm.$emit('failure', error) // an alias
            }
          )
        } catch (err) {}
      })
    }
  }
}
</script>
<style>
</style>