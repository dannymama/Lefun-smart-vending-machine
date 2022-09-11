<template>
  <div style="margin:10px;">
    <!-- <div class="card">
      <md-field brief="我的服務" style="padding:10px;">
        <div class="wrapper" slot="default">
          <div class="box" v-for="i in mySerivceList" :key="i.title">
            <md-button
              style="border:0; height:60px"
              type="default"
              size="large"
              @click="Goto(i.directTo, i.isExternalLink)"
            >
              <div style="line-height:1em;">
                <md-icon
                  :name="i.icon"
                  style="width:3.5em; height:2em;"
                  svg
                ></md-icon>
                <div style="text-align: center;font-size: 12px;color: #666;">
                  {{ i.title }}
                </div>
              </div>
            </md-button>
          </div>
        </div>
      </md-field>
    </div> -->
    <div class="card">
      <md-field brief="個人中心" style="padding:10px;">
        <div class="wrapper" slot="default">
          <div class="box" v-for="i in userList" :key="i.title">
            <md-button
              style="border:0; height:60px"
              type="default"
              size="large"
              @click="Goto(i.directTo, i.isExternalLink)"
            >
              <div style="line-height:1em;">
                <md-icon
                  :name="i.icon"
                  style="width:3.5em; height:2em;"
                  svg
                ></md-icon>
                <div style="text-align: center;font-size: 12px;color: #666;">
                  {{ i.title }}
                </div>
              </div>
            </md-button>
          </div>
        </div>
      </md-field>
      <VerifyCodeAuth ref="verifyCodeAuth" @onVerifySuccess="test" />
    </div>
    <div class="card">
      <md-field brief="其他" style="padding:10px;">
        <div class="wrapper" slot="default">
          <div class="box" v-for="i in others" :key="i.title">
            <md-button
              style="border:0; height:60px"
              type="default"
              size="large"
              @click="Goto(i.directTo, i.isExternalLink)"
            >
              <div style="line-height:1em;">
                <md-icon
                  :name="i.icon"
                  style="width:3.5em; height:2em;"
                  svg
                ></md-icon>
                <div style="text-align: center;font-size: 12px;color: #666;">
                  {{ i.title }}
                </div>
              </div>
            </md-button>
          </div>
        </div>
      </md-field>
    </div>
  </div>
</template>

<script>
import { Button, Field, CellItem, Icon } from 'mand-mobile'
import VerifyCodeAuth from '@/components/VerifyCodeAuth'

export default {
  name: 'UserFunctionList',
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Icon.name]: Icon,
    VerifyCodeAuth
  },
  data () {
    return {
      showVerifyCodeAuth: false,
      mySerivceList: [
        {
          title: '開門Qrcode',
          directTo: 'QrcodePage',
          isExternalLink: false,
          icon: 'qr-code'
        },
        {
          title: '最新消息',
          directTo: 'NewsPage',
          isExternalLink: false,
          icon: 'news'
        }
      ],
      userList: [
        {
          title: '開門Qrcode',
          directTo: 'QrcodePage',
          isExternalLink: false,
          icon: 'qr-code'
        },
        {
          title: '最新消息',
          directTo: 'NewsPage',
          isExternalLink: false,
          icon: 'news'
        },
        {
          title: '個人資料',
          directTo: 'UserInfoPage',
          isExternalLink: false,
          icon: 'users'
        },
        {
          title: '消費記錄',
          directTo: 'HistoryPage',
          isExternalLink: false,
          icon: 'receipt'
        },
        {
          title: '信用卡',
          directTo: 'CreditCardPage',
          isExternalLink: false,
          icon: 'credit-card'
        },
        {
          title: '發票載具',
          directTo: 'E_InvoicePage',
          isExternalLink: false,
          icon: 'bill'
        }
      ],
      others: [
        {
          title: '關於樂坊',
          directTo: 'AboutPage',
          isExternalLink: false,
          icon: 'lefun'
        },
        {
          title: '粉絲團',
          directTo: 'https://www.facebook.com',
          isExternalLink: true,
          icon: 'facebook'
        },
        {
          title: '客服',
          directTo: 'line://ti/p/@bpz1329y',
          isExternalLink: true,
          icon: 'line'
        }
      ]
    }
  },
  methods: {
    Goto (directTo, isExternalLink) {
      if (directTo === 'QrcodePage') {
        this.$refs.verifyCodeAuth.showVerifyCodeAuth()
        return
      }
      if (!isExternalLink) {
        this.$router.push({ name: directTo })
      } else {
        window.open(directTo, '_blank')
      }
    },
    test (data) {
      this.$router.push({ name: 'QrcodePage', params: data })
    }
  }
}
</script>

<style scoped>
.fixedtop {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  z-index: 100;
}

.userinfo {
  background-color: #2f86f6;
  padding: 2px;
  line-height: 10px;
  color: white;
}

.context_right {
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  margin-right: 0.2rem;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: inline-flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  font-size: 0.28rem;
}
.context_brief {
  font-size: 0.24rem;
  line-height: 1.4;
  margin-top: 0.08rem;
}

.fixedbox {
  position: relative;
  width: 100%;
  height: 200px;
}

.holder {
  display: block;
  width: 130px;
  height: 130px;
  border-radius: 50px;
  background-color: #e6e6e6;
  border: 2px solid #e2e4ea;
}

.card {
  background: #fff;
  border-radius: 5px;
  display: inline-block;
  position: relative;
  width: 100%;
  min-height: 200px;
  line-height: 5.5em;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.23);
  margin-bottom: 20px;
}

.wrapper {
  display: grid;
  grid-template-columns: calc(100% / 4) calc(100% / 4) calc(100% / 4) calc(
      100% / 4
    );
}

.md-button.default:after {
  border: 0;
}
</style>