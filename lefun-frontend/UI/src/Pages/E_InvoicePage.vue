<template>
  <div>
    <Nav />
    <md-field style="height:100vh">
      <md-field-item
        :title="
          selectorValue === this.$store.getters.userInfo.invoice_type
            ? '當前設定'
            : '修改為'
        "
        :content="selectorText"
        @click="showSelector"
        arrow
        solid
      />
      <div v-if="selectorValue === 0">
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
        >
          捐贈發票說明捐贈發票說明捐贈發票說明捐贈發票說明捐贈發票說明捐贈發票說明
        </p>
      </div>
      <div v-if="selectorValue === 1">
        <md-input-item
          ref="input0"
          title="手機載具"
          placeholder="載具號碼"
          v-model="mobile_device"
          :error="validateField('mobile_device')"
          is-amount
          :maxlength="8"
        ></md-input-item>
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
        >
          載具條碼說明載具條碼說明載具條碼說明載具條碼說明載具條碼說明載具條碼說明
        </p>
      </div>

      <div v-if="selectorValue === 2">
        <md-input-item
          ref="input0"
          title="電子信箱"
          placeholder="電子信箱"
          v-model="email"
          :error="validateField('email')"
          is-amount
        ></md-input-item>
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
        >
          電子信箱說明電子信箱說明電子信箱說明電子信箱說明電子信箱說明電子信箱說明
        </p>
      </div>
    </md-field>
    <md-selector
      v-model="isSelectorShow"
      default-value="0"
      :data="data[0]"
      max-height="320px"
      title="電子發票設定"
      @choose="onSelectorChoose"
    ></md-selector>
    <md-action-bar :actions="buttonData"></md-action-bar>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import {
  Selector,
  Field,
  FieldItem,
  InputItem,
  Button,
  ActionBar,
  Toast
} from 'mand-mobile'
import SimpleVueValidation from 'simple-vue-validator'
import {
  updateUserInvoiceDevice,
  updateUserInvoiceDoate,
  updateUserInvoiceEmail
} from '@/apis/User'

const Validator = SimpleVueValidation.Validator.create({
  templates: {
    required: '必要資訊',
    email: 'email格式錯誤'
  }
})

export default {
  name: 'E_InvoicePage',
  components: {
    [Selector.name]: Selector,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [Button.name]: Button,
    [ActionBar.name]: ActionBar,
    Nav
  },
  mounted () {
    this.selectorValue = this.$store.getters.userInfo.invoice_type
    this.selectorText = this.data[0][this.selectorValue].text
    this.mobile_device = this.$store.getters.userInfo.mobile_device
    this.email = this.$store.getters.userInfo.email
  },
  validators: {
    mobile_device: function (value) {
      return Validator.value(value)
        .regex(/^\/{1}[0-9A-Z]{7}$/, '請輸入正確載具格式')
        .required()
    },
    email: function (value) {
      return Validator.value(value)
        .email()
        .required()
    }
  },
  data () {
    return {
      isSelectorShow: false,
      email: '',
      mobile_device: '',
      buttonData: [
        {
          text: '當前設定',
          disabled: true,
          onClick: this.handleClick
        }
      ],
      data: [
        [
          {
            value: 0,
            text: '捐贈發票',
            brief: '捐贈發票'
          },
          {
            value: 1,
            text: '手機載具',
            brief: '發票資訊存於載具內'
          },
          {
            value: 2,
            text: '電子信箱',
            brief: '發票資訊寄送至電子信箱'
          }
        ]
      ],
      selectorValue: 0,
      selectorText: ''
    }
  },
  methods: {
    showSelector () {
      this.isSelectorShow = true
    },
    onSelectorChoose ({ text, value }) {
      this.selectorText = text
      this.selectorValue = value
      this.setButtonStatus()
    },
    validateField (field) {
      return this.validation.firstError(field)
        ? this.validation.firstError(field)
        : ''
    },
    setButtonStatus () {
      this.$nextTick(function () {
        let isSame =
          this.selectorValue === this.$store.getters.userInfo.invoice_type
        this.buttonData[0].disabled = isSame
        this.buttonData[0].text = isSame ? '當前設定' : '儲存設定'
      })
    },
    async handleClick () {
      if (this.selectorValue === 0) {
        this.updateUserInvoice(updateUserInvoiceDoate())
      } else if (this.selectorValue === 1) {
        if (await this.$validate(['mobile_device'])) {
          this.updateUserInvoice(updateUserInvoiceDevice(this.mobile_device))
        }
      } else if (this.selectorValue === 2) {
        if (await this.$validate(['email'])) {
          this.updateUserInvoice(updateUserInvoiceEmail(this.email))
        }
      }
    },
    async updateUserInvoice (api) {
      Toast.loading('處理中', 0)
      let res = await api
      if (res.resultCode === 1) {
        await this.$store.dispatch('GetInfo')
        Toast.hide()
        Toast.info('修改成功')
        this.setButtonStatus()
      } else {
        Toast.hide()
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
