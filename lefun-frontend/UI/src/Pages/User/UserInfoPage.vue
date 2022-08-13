<template>
  <div>
    <Nav />
    <div v-if="this.$store.getters.token">
      <md-field>
        <md-cell-item
          title="暱稱"
          :addon="this.$store.getters.userInfo.user_name"
          arrow
          @click="onClickEditUsername"
        />
        <md-cell-item
          title="電話號碼"
          :addon="this.$store.getters.userInfo.phone_number.toString()"
        >
          <!-- <SMSAuth slot="right" type="link" buttonContext="修改手機號碼" /> -->
        </md-cell-item>

        <md-cell-item
          title="樂坊點數"
          :addon="'剩餘 ' + this.$store.getters.userInfo.lefun_point + ' 點'"
        ></md-cell-item>
        <md-cell-item
          title="UID"
          :addon="this.$store.getters.userInfo.id.toString()"
        />
        <md-cell-item title="政策">
          <ConfirmTerm slot="right" type="link" />

          <p
            slot="children"
            style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
          >
            說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容說明內容
          </p>
        </md-cell-item>
        <md-cell-item>
          <md-button type="default" size="small" plain @click="logout"
            >退出登入</md-button
          >
        </md-cell-item>
      </md-field>
    </div>
    <div v-else></div>
    <md-dialog
      :closable="false"
      v-model="editUsernameDialog.open"
      :btns="editUsernameDialog.btns"
    >
      <md-input-item
        v-model="editUsernameDialog.tempUserName"
        ref="name"
        title="暱稱"
        placeholder="請輸入暱稱"
        is-title-latent
        clearable
        :error="validateField('editUsernameDialog.tempUserName')"
      ></md-input-item>
    </md-dialog>
  </div>
</template>

<script>
import {
  Field,
  CellItem,
  Switch,
  Button,
  Toast,
  Dialog,
  InputItem
} from 'mand-mobile'
import SMSAuth from '@/components/SMSAuth.vue'
import Nav from '@/components/Nav.vue'
import ConfirmTerm from '@/components/ConfirmTerm'
import { updateUsername } from '@/apis/User'
import SimpleVueValidation from 'simple-vue-validator'
const Validator = SimpleVueValidation.Validator
export default {
  name: 'UserInfoPage',
  components: {
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Switch.name]: Switch,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [InputItem.name]: InputItem,
    SMSAuth,
    Toast,
    Nav,
    ConfirmTerm
  },
  validators: {
    'editUsernameDialog.tempUserName': function (value) {
      return Validator.value(value)
        .minLength(1)
        .maxLength(10)
        .required()
    }
  },
  data () {
    return {
      open: false,
      editUsernameDialog: {
        tempUserName: '',
        open: false,
        btns: [
          {
            text: '取消',
            handler: this.onCancelEditUsername
          },
          {
            text: '確認',
            handler: this.onConfirmEditUsername
          }
        ]
      }
    }
  },
  methods: {
    async logout () {
      Dialog.confirm({
        title: '登出',
        content: '是否確認登出樂坊',
        confirmText: '確定',
        onConfirm: async () => {
          let res = await this.$store.dispatch('LogOut')
          this.$router.push('/')
        }
      })
    },
    onClickEditUsername () {
      this.editUsernameDialog.tempUserName = this.$store.getters.userInfo.user_name
      this.editUsernameDialog.open = true
    },
    onCancelEditUsername () {
      this.editUsernameDialog.open = false
    },
    async onConfirmEditUsername () {
      if (await this.$validate(['editUsernameDialog.tempUserName'])) {
        Toast.loading('處理中', 0)
        let res = await updateUsername(this.editUsernameDialog.tempUserName)
        if (res.resultCode === 1) {
          await this.$store.dispatch('GetInfo')
          Toast.hide()
          Toast.info('修改成功')
        } else {
          Toast.hide()
          Dialog.failed({
            title: res.resultDes,
            content: res.resultMessage,
            confirmText: '確定'
          })
        }
        this.editUsernameDialog.open = false
      }
    },
    validateField (field) {
      return this.validation.firstError(field)
        ? this.validation.firstError(field)
        : ''
    }
  }
}
</script>

<style scoped>
.holder {
  display: block;
  width: 88px;
  height: 88px;
  line-height: 5px;
  border-radius: 44px;
  background-color: #e6e6e6;
}
</style>
