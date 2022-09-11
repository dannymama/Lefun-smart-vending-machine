<template>
  <div id="register">
    <md-steps :steps="steps" :current="currentStep"></md-steps>
    <md-field style="height:100vh" v-show="currentStep === 0">
      <div class="md-result" style="margin-top:1em;">
        <md-icon
          name="lefun_big"
          style="width:3.5em; height:2em;"
          svg
        ></md-icon>
        <div
          style="font-size:0.35rem;line-height:.5rem;color:#858B9C; margin-top:1em;"
        >
          <p>歡迎使用樂坊服務</p>
          <p>剩餘幾個步驟即可完成</p>
        </div>
      </div>
    </md-field>
    <transition name="fade" mode="out-in">
      <md-field
        title="暱稱設定"
        brief="暱稱格式為10個字元"
        v-show="currentStep === 1"
      >
        <md-input-item
          v-model.trim="registerObj.user_name"
          title="暱稱"
          placeholder="請輸入暱稱"
          :maxlength="10"
          :error="validateField('registerObj.user_name')"
          @change="step1_check"
          clearable
        ></md-input-item>
      </md-field>
    </transition>
    <transition name="fade" mode="out-in">
      <Tappay
        ref="tappay"
        v-show="currentStep === 2"
        @update="step2_check"
        @getPrimeResponse="getPrimeResponse"
        @onError="onError"
      />
    </transition>
    <transition name="fade" mode="out-in">
      <div v-show="currentStep === 3">
        <md-field
          title="交易密碼設定"
          brief="為了您的安全，產生開門qrcode時需輸入驗證"
        >
          <md-input-item
            v-model="registerObj.verify_code"
            title="交易密碼"
            type="tel"
            :maxlength="6"
            placeholder="交易密碼"
            :error="validateField('registerObj.verify_code')"
          ></md-input-item>
          <md-input-item
            v-model="verify_code_check"
            title="再次輸入"
            type="tel"
            :maxlength="6"
            placeholder="再次輸入"
            :error="validateField('verify_code_check')"
          ></md-input-item>
        </md-field>

        <md-field title="還原密碼設定" brief="忘記付款密碼時需輸入此碼進行驗證">
          <md-input-item
            v-model="registerObj.recover_code"
            title="還原密碼"
            type="tel"
            :maxlength="8"
            placeholder="身分證後四碼+西元生日年份"
            :error="validateField('registerObj.recover_code')"
          ></md-input-item>
          <md-input-item
            v-model="recover_code_check"
            title="再次輸入"
            type="tel"
            :maxlength="8"
            placeholder="再次輸入"
            @change="step3_check"
            :error="validateField('recover_code_check')"
          ></md-input-item>
        </md-field>
      </div>
    </transition>
    <md-action-bar :actions="data"></md-action-bar>
  </div>
</template>

<script>
import {
  ActionBar,
  Steps,
  InputItem,
  Field,
  Icon,
  Dialog,
  Toast
} from 'mand-mobile'
import Tappay from '@/components/Tappay'
import SimpleVueValidation from 'simple-vue-validator'
import {
  registerBySMS,
  registerByFacebook,
  registerByGoogle
} from '@/apis/User'
const Validator = SimpleVueValidation.Validator.create({
  templates: {
    required: '必要資訊',
    minLength: '最小長度為{0}字元',
    maxLength: '最大長度為{0}字元',
    digit: '格式為數字',
    length: '長度為{0}字元'
  }
})
let vm
export default {
  name: 'RegisterPage',
  components: {
    [ActionBar.name]: ActionBar,
    [Steps.name]: Steps,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
    Tappay
  },
  validators: {
    'registerObj.user_name': function (value) {
      return Validator.value(value)
        .minLength(3)
        .maxLength(10)
        .required()
    },
    'registerObj.verify_code': function (value) {
      return Validator.value(value)
        .digit()
        .length(6)
        .required()
    },
    verify_code_check: function (value) {
      return Validator.value(value)
        .digit()
        .length(6)
        .required()
        .custom(function () {
          if (value !== vm.registerObj.verify_code) {
            return '輸入開門密碼不一致'
          }
        })
    },
    'registerObj.recover_code': function (value) {
      return Validator.value(value)
        .length(8)
        .required()
    },
    recover_code_check: function (value) {
      return Validator.value(value)
        .length(8)
        .required()
        .custom(function () {
          if (value !== vm.registerObj.recover_code) {
            return '復原碼不一致'
          }
        })
    }
  },
  data () {
    return {
      currentStep: 0,
      canGetPrime: false,
      verify_code_check: '',
      recover_code_check: '',
      registerObj: {
        user_name: '',
        prime: '',
        verify_code: '',
        recover_code: '',
        email: 'test@gmail.com',
        realname: ' '
      },
      data: [
        {
          text: '上一步',
          disabled: false,
          onClick: this.handleClick
        }
      ],
      steps: [
        {
          name: '開始註冊'
        },
        {
          name: '暱稱設定'
        },
        {
          name: '付款方式'
        },
        {
          name: '交易密碼'
        }
      ]
    }
  },
  mounted () {
    vm = this
    this.data[0].text = '開始註冊'
    if (!this.$route.params.type) {
      this.$router.push({ name: 'LoginPage' })
    }
  },
  methods: {
    async handleClick () {
      switch (this.currentStep) {
        case 0:
          this.data[0].text = '下一步'
          this.data[0].disabled = true
          if (this.$route.params.type === 'Facebook') {
            this.registerObj.user_name = this.$route.params.fbRes.fb_username
            this.data[0].disabled = false
          } else if (this.$route.params.type === 'Google') {
            this.registerObj.user_name = this.$route.params.googleRes.google_username
            this.data[0].disabled = false
          }
          this.currentStep++
          break
        case 1:
          if (await this.$validate(['registerObj.user_name'])) {
            this.data[0].text = '下一步'
            this.data[0].disabled = true
            this.currentStep++
          }
          break
        case 2:
          if (this.canGetPrime) {
            this.data[0].text = '確認註冊'
            this.data[0].disabled = true
            this.currentStep++
          }
          break
        case 3:
          if (
            await this.$validate([
              'registerObj.verify_code',
              'verify_code_check',
              'registerObj.recover_code',
              'recover_code_check'
            ])
          ) {
            // Dialog.confirm({
            //   title: '確認註冊',
            //   content: '註冊時將刷卡一元確認狀態，並立即刷退',
            //   confirmText: '確定',
            //   onConfirm: () => this.$refs.tappay.getPrime()
            // })
            this.$refs.tappay.getPrime()
          }
          break
        default:
          break
      }
    },

    async step1_check () {
      ;(await this.$validate(['registerObj.user_name']))
        ? (this.data[0].disabled = false)
        : (this.data[0].disabled = true)
    },
    async step2_check (update) {
      this.canGetPrime = update.canGetPrime
      this.data[0].disabled = !update.canGetPrime
    },
    async step3_check () {
      ;(await this.$validate([
        'registerObj.verify_code',
        'verify_code_check',
        'registerObj.recover_code',
        'recover_code_check'
      ]))
        ? (this.data[0].disabled = false)
        : (this.data[0].disabled = true)
    },
    async getPrimeResponse (res) {
      this.registerObj.prime = res.card.prime
      if (this.$route.params.type === 'SMS') {
        this.registerObj.sms_token = this.$route.params.sms_token
        Toast.loading('處理中', 0)
        let res = await registerBySMS(this.registerObj)
        Toast.hide()
        if (res.resultCode === 1) {
          await this.$store.dispatch('Login', res.resultData.login_token)
          // await this.$store.dispatch('GetInfo')
          Dialog.alert({
            title: '註冊成功',
            content: '恭喜您成功註冊樂坊智慧取物櫃，立刻享受開門取物的樂趣吧！',
            cancelText: '取消',
            confirmText: '確定',
            onConfirm: () => this.$router.push('/')
          })
        } else {
          Dialog.failed({
            title: res.resultDes,
            content: res.resultMessage,
            confirmText: '確定'
          })
        }
      } else if (this.$route.params.type === 'Facebook') {
        this.registerObj.fb_accesstoken = this.$route.params.fbRes.fb_accesstoken
        Toast.loading('處理中', 0)
        let res = await registerByFacebook(this.registerObj)
        Toast.hide()
        if (res.resultCode === 1) {
          await this.$store.dispatch('Login', res.resultData.login_token)
          // await this.$store.dispatch('GetInfo')
          Dialog.alert({
            title: '註冊成功',
            content: '恭喜您成功註冊樂坊智慧取物櫃，立刻享受開門取物的樂趣吧！',
            cancelText: '取消',
            confirmText: '確定',
            onConfirm: () => this.$router.push('/')
          })
        } else {
          Dialog.failed({
            title: res.resultDes,
            content: res.resultMessage,
            confirmText: '確定'
          })
        }
      } else if (this.$route.params.type === 'Google') {
        this.registerObj.google_accesstoken = this.$route.params.googleRes.google_accesstoken
        Toast.loading('處理中', 0)
        let res = await registerByGoogle(this.registerObj)
        Toast.hide()
        if (res.resultCode === 1) {
          await this.$store.dispatch('Login', res.resultData.login_token)
          // await this.$store.dispatch('GetInfo')
          Dialog.alert({
            title: '註冊成功',
            content: '恭喜您成功註冊樂坊智慧取物櫃，立刻享受開門取物的樂趣吧！',
            cancelText: '取消',
            confirmText: '確定',
            onConfirm: () => this.$router.push('/')
          })
        } else {
          Dialog.failed({
            title: res.resultDes,
            content: res.resultMessage,
            confirmText: '確定'
          })
        }
      }
    },
    validateField (field) {
      return this.validation.firstError(field)
        ? this.validation.firstError(field)
        : ''
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

<style>
.fade-enter {
  opacity: 0;
  transform: translateX(50px);
}
.fade-enter-active {
  transition: opacity 0.7s ease;
}
.fade-leave-active {
  transition: opacity 0s ease;
  opacity: 0;
}

#register input[type="tel"] {
  -webkit-text-security: disc;
}
</style>
