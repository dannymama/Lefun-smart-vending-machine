<template>
  <div id="recovery" style="height:90vh;  background-color: #f5f5f5">
    <Nav />
    <md-field>
      <div v-show="currentStep === 0">
        <md-input-item
          v-model="recoverObj.recover_code"
          title="還原密碼"
          type="tel"
          :maxlength="8"
          placeholder="身分證後四碼+西元生日年份"
          :error="validateField('recoverObj.recover_code')"
          @change="step1_check"
        >
        </md-input-item>
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C; margin-top:1em;"
        >
          ww
        </p>
      </div>
      <div v-show="currentStep === 1">
        <md-input-item
          v-model="recoverObj.verify_code"
          title="安全密碼"
          type="tel"
          :maxlength="6"
          placeholder="新交易密碼"
          :error="validateField('recoverObj.verify_code')"
        ></md-input-item>
        <md-input-item
          v-model="verify_code_check"
          title="再次輸入"
          type="tel"
          :maxlength="6"
          placeholder="再次輸入新交易密碼"
          :error="validateField('verify_code_check')"
          @change="step2_check"
        ></md-input-item>
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C; margin-top:1em;"
        >
          說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容
        </p>
      </div>
    </md-field>
    <md-action-bar :actions="data"></md-action-bar>
  </div>
</template>

<script>
import { Field, InputItem, Button, ActionBar, Toast, Dialog } from 'mand-mobile'
import Nav from '@/components/Nav.vue'
import SimpleVueValidation from 'simple-vue-validator'
import { updateVerifyCode, checkRecoverCode } from '@/apis/User'

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
  name: 'RecoverPage',
  components: {
    [Field.name]: Field,
    [InputItem.name]: InputItem,
    [Button.name]: Button,
    [ActionBar.name]: ActionBar,
    [Dialog.name]: Dialog,
    Nav
  },
  mounted () {
    vm = this
  },
  validators: {
    'recoverObj.verify_code': function (value) {
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
          if (value !== vm.recoverObj.verify_code) {
            return '輸入開門密碼不一致'
          }
        })
    },
    'recoverObj.recover_code': function (value) {
      return Validator.value(value)
        .length(8)
        .required()
    }
  },
  data () {
    return {
      currentStep: 0,
      recoverObj: { recover_code: '', verify_code: '' },
      verify_code_check: '',
      data: [
        {
          text: '下一步',
          disabled: true,
          onClick: this.handleClick
        }
      ]
    }
  },
  methods: {
    validateField (field) {
      return this.validation.firstError(field)
        ? this.validation.firstError(field)
        : ''
    },
    async step2_check () {
      ;(await this.$validate(['recoverObj.verify_code', 'verify_code_check']))
        ? (this.data[0].disabled = false)
        : (this.data[0].disabled = true)
    },
    async step1_check (update) {
      ;(await this.$validate(['recoverObj.recover_code']))
        ? (this.data[0].disabled = false)
        : (this.data[0].disabled = true)
    },
    async handleClick () {
      switch (this.currentStep) {
        // case 0:
        //   if (
        //     await this.$validate([
        //       'recoverObj.verify_code',
        //       'verify_code_check'
        //     ])
        //   ) {
        //     this.data[0].text = '確認'
        //     this.data[0].disabled = true
        //     this.currentStep++
        //   }
        //   break
        case 0:
          if (await this.$validate(['recoverObj.recover_code'])) {
            Toast.loading('處理中', 0)
            let res = await checkRecoverCode(this.recoverObj.recover_code)
            Toast.hide()
            if (res.resultCode === 1) {
              this.data[0].text = '確認'
              this.data[0].disabled = true
              this.currentStep++
            } else {
              Dialog.failed({
                title: res.resultDes,
                content: res.resultMessage,
                confirmText: '確定'
              })
              this.recoverObj.recover_code = ''
              this.data[0].disabled = true
            }
          }
          break
        case 1:
          if (
            await this.$validate([
              'recoverObj.verify_code',
              'verify_code_check'
            ])
          ) {
            Toast.loading('處理中', 0)
            let res = await updateVerifyCode(this.recoverObj)
            Toast.hide()
            if (res.resultCode === 1) {
              Toast.info('重置完成，請使用新密碼開門取物')
              this.$router.go(-1)
            } else {
              Dialog.failed({
                title: res.resultDes,
                content: res.resultMessage,
                confirmText: '確定'
              })
              this.recoverObj.recover_code = ''
              this.data[0].disabled = true
            }
          }
          break
        default:
          break
      }
    }
  }
}
</script>
<style>
#recovery input[type="tel"] {
  -webkit-text-security: disc;
}
</style>
