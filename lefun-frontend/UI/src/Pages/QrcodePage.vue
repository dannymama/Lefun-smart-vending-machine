<template>
  <div>
    <Nav />
    <md-field
      v-show="currentState === 0"
      style="background-color:rgb(250, 250, 250); height:100vh"
    >
      <div style="margin:1em; margin-bottom:0px; margin-top:.5em;">
        <div class="card">
          <qrcode
            v-if="qrcodeValue !== ''"
            class="md-result"
            :value="qrcodeValue"
            :options="{ width: 500, color: { dark: '#294A39' } }"
            tag="img"
            style="width:100%"
          ></qrcode>
        </div>
      </div>
      <md-cell-item
        title="使用樂坊點數折扣"
        :brief="'點數餘額: ' + $store.getters.userInfo.lefun_point"
      >
        <md-switch
          v-model="isActive"
          slot="right"
          @change="change('switch0', isActive, $event)"
        />
      </md-cell-item>
      <p
        slot="footer"
        style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
      >
        說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明
      </p>
    </md-field>
    <transition name="fade" mode="out-in">
      <md-field
        style="background-color:rgb(250, 250, 250);  height:100vh"
        v-show="currentState === 1"
      >
        <div @click="currentState++">
          <img
            style="width:100%; margin-top:.5em;"
            src="https://cdn.dribbble.com/users/1390/screenshots/2236479/timeflash_tutorial__2_.gif"
          />
        </div>
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
        >
          說明說明說明說明說明說明說明說明說明說明說明說說明說明說明說明說明說明說明說明說明說明說說明說明說明說明說明說明說明說明說明說明說說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明說明
        </p></md-field
      ></transition
    >
    <transition name="fade" mode="out-in">
      <md-field
        style="background-color:rgb(250, 250, 250);  height:100vh"
        v-show="currentState === 2"
      >
        <div>
          <div class="md-example-child md-example-child-bill-1">
            <md-bill water-mark="樂坊智能取物">
              <div class="header-slot" slot="header">
                <h1 class="title">取物完成</h1>
                <p class="desc">
                  感謝您的使用，您的消費清單如下:
                </p>
              </div>
              <div v-if="productList">
                <md-detail-item
                  v-for="(item, id) in productList"
                  :key="'id-' + id"
                  :title="item.title"
                >
                  {{ item.price }} TWD
                </md-detail-item>
                <md-detail-item
                  title="total"
                  :content="purchaseResult.amount"
                  bold
                />
              </div>
              <div class="footer-slot" slot="footer">
                消費地點：{{ purchaseResult.device_name }} <br />
                消費時間：{{ purchaseResult.createdAt }} <br /><br />
                說明說明說明說明說明說明說明說明說明說明說明<br />
                說明說明說明說明說明說明說明
                <md-button
                  type="default"
                  style="margin-top:2em;"
                  size="small"
                  plain
                  @click="$router.push('/')"
                  >回到首頁</md-button
                >
              </div>
            </md-bill>
          </div>
        </div></md-field
      >
    </transition>
  </div>
</template>

<script>
import {
  Field,
  Switch,
  CellItem,
  Toast,
  Bill,
  DetailItem,
  Button,
  Dialog
} from 'mand-mobile'
import Nav from '@/components/Nav.vue'
import { checkTransaction, getperchase } from '@/apis/LefunTrans'
export default {
  name: 'QrcodePage',
  components: {
    [Field.name]: Field,
    [Switch.name]: Switch,
    [CellItem.name]: CellItem,
    [Toast.name]: Toast,
    [Bill.name]: Bill,
    [DetailItem.name]: DetailItem,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    Nav
  },
  props: {},
  data () {
    return {
      isActive: false,
      qrcodeValue: '',
      currentState: 0,
      lefunTransactionID: '',
      purchaseResult: {},
      productList: []
    }
  },
  mounted () {
    if (!this.$route.params.lefun_transaction_id) {
      this.$router.push('/')
    }
    this.lefunTransactionID = this.$route.params.lefun_transaction_id
    this.qrcodeValue = JSON.stringify({
      lefun_transaction_id: this.lefunTransactionID,
      usePoint: 0
    })
    this.currentState = 0
    this.checkTransactionStatus()
  },
  methods: {
    change (name, isActive) {
      this.qrcodeValue = JSON.stringify({
        lefun_transaction_id: this.lefunTransactionID,
        usePoint: isActive ? 1 : 0
      })
    },
    checkTransactionStatus () {
      const timer = setInterval(async () => {
        if (!this.$route.params.lefun_transaction_id) {
          clearInterval(timer)
        }
        let r = await checkTransaction(this.lefunTransactionID)
        if (r.resultCode === 1) {
          if (r.resultData.lefunTransactionInfo.is_verified) {
            clearInterval(timer)
            this.currentState = 1
            Toast.info('開門成功')
            this.getPerchaseInfo()
          }
        }
      }, 1000)

      setTimeout(function () {
        // 確認時間逾期，停止送request
        if (timer) {
          clearInterval(timer)
        }
      }, 300000)
    },
    getPerchaseInfo () {
      const timer = setInterval(async () => {
        let r = await getperchase(this.lefunTransactionID)
        console.log(r)
        if (r.resultCode === 1) {
          clearInterval(timer)
          this.purchaseResult = r.resultData.perchaseInfo
          this.productList = JSON.parse(this.purchaseResult.product_list)
          // 使用者途中切換頁面，透過Dialog顯示結果提示
          if (this.$route.name !== 'QrcodePage') {
            Dialog.succeed({
              title: '購買完成',
              content:
                '請至消費紀錄查看細項' +
                '</br>' +
                this.purchaseResult.amount.toString(),
              confirmText: '確定'
            })
          } else {
            this.currentState = 2
          }
        }
      }, 1000)

      setTimeout(function () {
        // 確認時間逾期，停止送request
        if (timer) {
          clearInterval(timer)
        }
      }, 300000)
    }
  }
}
</script>
<style scoped>
.card {
  background: #fff;
  border-radius: 5px;
  display: inline-block;
  position: relative;
  width: 100%;
  min-height: 4.7em;
  line-height: 5.5em;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.23);
  margin-bottom: 20px;
}

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

.md-example-child-bill-1 .md-bill {
  background-color: #fff;
  box-shadow: 0 6px 24px rgba(17, 26, 52, 0.05);
}
.md-example-child-bill-1 .md-bill.md-water-mark {
  overflow: visible;
}
.md-example-child-bill-1 .md-bill .md-bill-neck:before,
.md-example-child-bill-1 .md-bill .md-bill-neck:after {
  content: "";
  position: absolute;
  top: 0;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f3f4f5;
}
.md-example-child-bill-1 .md-bill .md-bill-neck:before {
  left: -46px;
}
.md-example-child-bill-1 .md-bill .md-bill-neck:after {
  right: -46px;
}
.md-example-child-bill-1 .md-bill .header-slot {
  padding: 40px 0 20px 0;
}
.md-example-child-bill-1 .md-bill .header-slot .title {
  color: #111a34;
  font-size: 60px;
  font-family: Songti SC;
  line-height: 1;
}
.md-example-child-bill-1 .md-bill .header-slot .desc {
  margin-top: 16px;
  color: #858b9c;
  font-size: 26px;
}
.md-example-child-bill-1 .md-bill .footer-slot {
  padding: 32px 0;
  color: #858b9c;
  font-size: 25px;
  line-height: 1.5;
  border-top: solid 1px #e1e4eb;
}
</style>
