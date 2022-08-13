<template>
  <div v-if="state === 0">
    <md-field>
      <md-field-item
        title="機台名稱"
        :content="selectorValue"
        @click="showSelector"
        arrow
        solid
      />
      <md-button type="default" plain @click="start">開始模擬</md-button>
    </md-field>
    <md-selector
      v-model="isSelectorShow"
      default-value="2"
      :data="data[0]"
      max-height="320px"
      title="機台名稱"
      @choose="onSelectorChoose"
    ></md-selector>
  </div>
  <div v-else-if="state === 1">
    <qrcode-stream @decode="onDecode"></qrcode-stream>
  </div>
  <div v-else-if="state === 2">
    <md-field>
      <md-cell-item
        v-for="(prod, ind) in products"
        :key="'ind-' + ind"
        :title="prod.title"
        :brief="prod.price | currency"
        addon="加入購物車"
        arrow
        @click="addItem(prod)"
      />
    </md-field>
    <md-field v-if="cart.length">
      <md-detail-item
        v-for="(item, id) in cart"
        :key="'id-' + id"
        :title="item.title + ' x' + item.quantity"
        :content="(item.price * item.quantity) | currency"
      />
      <md-detail-item title="total" :content="total | currency" bold>
      </md-detail-item>
    </md-field>
    <md-button type="default" size="small" plain @click="close">關門</md-button>
  </div>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { decode } from 'punycode'
import { verifyTrans, perchaseResult } from '@/apis/Demo'
import * as md5 from 'js-md5'
import {
  Toast,
  Button,
  DetailItem,
  Field,
  CellItem,
  FieldItem,
  Selector
} from 'mand-mobile'
export default {
  name: 'page',
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [DetailItem.name]: DetailItem,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Selector.name]: Selector,
    [FieldItem.name]: FieldItem
  },
  props: {},
  data () {
    return {
      state: 0,
      transactionID: '',
      useCoupom: '0',
      checksum: '',
      verifyToken: '',
      deviceID:"deviceid111134234234234",
      products: [
        {
          id: "0001",
          title: '茶裏王',
          price: 20,
          imgurl:
            'http://e.ecimg.tw/items/DBAB16A9005GCC7/000001_1478351746.jpg'
        },
        {
          id: "0002",
          title: '餅乾',
          price: 10,
          imgurl:
            'http://img.udn.com/image/product/S0001126/APPROVED/U000329823/20160510091037913_500.jpg?t=20180420020902'
        }
      ],
      cart: "",
      total: 0,
      isSelectorShow: false,
      selectorValue: '忠孝復興',
      data: [
        [
          {
            value: '忠孝復興',
            text: '忠孝復興'
          },
          {
            value: '台北101',
            text: '台北101'
          },
          {
            value: '內湖',
            text: '內湖'
          }
        ]
      ]
    }
  },
  filters: {
    currency (price) {
      return 'TWD ' + price.toFixed(2)
    }
  },
  methods: {
    showSelector () {
      this.isSelectorShow = true
    },
    onSelectorChoose ({ text }) {
      this.selectorValue = text
    },
    async onDecode (decodedString) {
      Toast.loading('', 1)
      let obj = JSON.parse(decodedString)
      this.transactionID = obj.lefun_transaction_id
      this.useCoupom = obj.usePoint ? '1' : '0'
      this.checksum = md5(
        md5(this.transactionID) + 'fbc2890726248da97c7153b0cc5ad828'
      )
      let res = await verifyTrans(
        this.transactionID,
        this.useCoupom,
        this.checksum,
        this.deviceID,
         this.selectorValue
      )
      this.verifyToken = res.resultData.verify_token
      Toast.hide()
      if (res.resultCode === 1) {
        Toast.info('開門')
        this.state = 2
      }
    },
    start () {
      this.state = 1
    },
    async close () {
      Toast.loading('', 1)
      let res = await perchaseResult(
        this.deviceID,
        this.selectorValue,
        this.cart,
        this.transactionID,
        this.checksum,
        this.verifyToken
      )
      Toast.hide()
      if (res.resultCode === 1) {
        Toast.info('關門')
        this.transactionID = ''
        this.state = 0
        this.cart = ""
        this.total = 0
      }
    },

    addItem (prod) {
      this.cart = (this.cart === "")? this.cart + prod.id : this.cart + "," + prod.id 
      // Increment total price
      // this.total += prod.price

      // let inCart = false
      // // Update quantity if the item is already in the cart
      // for (let i = 0; i < this.cart.length; i++) {
      //   if (this.cart[i].id === prod.id) {
      //     inCart = true
      //     this.cart[i].quantity++
      //     break
      //   }
      // }
      // // Add item if not already in the cart
      // if (!inCart) {
      //   this.cart.push({
      //     id: prod.id,
      //     title: prod.title,
      //     price: prod.price,
      //     desc: prod.title + '介紹',
      //     imgurl: prod.imgurl,
      //     quantity: 1
      //   })
      // }
    }
  }
}
</script>
<style scoped>
</style>
