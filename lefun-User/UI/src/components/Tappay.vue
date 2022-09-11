<template>
  <md-field
    title="信用卡設定"
    brief="此信用卡將做為您於樂坊智慧取物櫃消費時的付款卡片"
  >
    <div slot="action">
      <md-icon style="width:2.5em;; height: 2.3em;" name="visa" svg></md-icon
      >&nbsp;
      <md-icon
        style="width:2.5em;; height: 2.3em;"
        name="mastercard"
        svg
      ></md-icon>
    </div>

    <div class="md-field-item-content">
      <label class="md-field-item-title" style="margin-right:20px; width:80px"
        >信用卡號</label
      >
      <div class="md-field-item-control">
        <div class="tpfield" id="card-number"></div>
      </div>
    </div>
    <div class="md-field-item-content">
      <label class="md-field-item-title" style="margin-right:20px;  width:80px"
        >到期日</label
      >
      <div class="md-field-item-control">
        <div class="tpfield" id="card-expiration-date"></div>
      </div>
    </div>
    <div class="md-field-item-content">
      <label class="md-field-item-title" style="margin-right:20px; width:80px"
        >CCV</label
      >
      <div class="md-field-item-control">
        <div class="tpfield" id="card-ccv"></div>
      </div>
    </div>
    <p
      slot="footer"
      style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
    >
      為確認您的信用卡為有效卡片，系統會自動試刷1元，但不會實際向銀行請款，請放心使用
    </p>
  </md-field>
</template>

<script>
import { Field, Icon, Toast } from 'mand-mobile'

export default {
  name: 'Tappay',
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon
  },
  data () {
    return {
      canGetprime: false
    }
  },
  async mounted () {
    let vm = this
    try {
      await this.$loadScript('https://js.tappaysdk.com/tpdirect/v5')
      TPDirect.setupSDK(
        13154,
        'app_NUywDrNKiSb7BmyTpvrcqxvZGZhdWNTL6AkHzxIZII3Sm1rtiAnQNAJ0mVDC',
        'sandbox'
      )
      let fields = {
        number: {
          // css selector
          element: '#card-number',
          placeholder: '**** **** **** ****'
        },
        expirationDate: {
          // DOM object
          element: document.getElementById('card-expiration-date'),
          placeholder: 'MM / YY'
        },
        ccv: {
          element: document.getElementById('card-ccv'),
          placeholder: '後三碼'
        }
      }

      TPDirect.card.setup({
        fields: fields,
        styles: {
          // Style all elements
          input: {
            color: '#858b9c'
          },
          // Styling ccv field
          'input.ccv': {
            'font-size': '16px'
          },
          // Styling expiration-date field
          'input.expiration-date': {
            'font-size': '16px'
          },
          // Styling card-number field
          'input.card-number': {
            'font-size': '16px'
          },
          // style focus state
          ':focus': {
            // 'color': 'black'
          },
          // style valid state
          '.valid': {
            color: 'green'
          },
          // style invalid state
          '.invalid': {
            color: 'red'
          },
          // Media queries
          // Note that these apply to the iframe, not the root window.
          '@media screen and (max-width: 400px)': {
            input: {
              color: 'orange'
            }
          }
        }
      })
      // listen for TapPay Field
      TPDirect.card.onUpdate(function (update) {
        vm.canGetprime = update.canGetPrime
        vm.$emit('update', update)
      })
    } catch (ex) {
      vm.$emit('onError', '初始化異常')
    }
  },
  methods: {
    getPrime () {
      if (this.canGetprime) {
        let vm = this
        TPDirect.card.getPrime(function (result) {
          vm.$emit('getPrimeResponse', result)
        })
      }
    }
  }
}
</script>

<style>
.tpfield {
  height: 2em;
  width: 100%;
  margin: 5px 0;
  padding: 5px;
}
</style>
