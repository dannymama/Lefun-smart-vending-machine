<template>
  <div style="margin:.3em; margin-top:1em;">
    <div class="card">
      <md-field>
        <md-detail-item title="MasterCard" bold>
          <img
            style="width:20%;"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/200px-MasterCard_Logo.svg.png"
        /></md-detail-item>

        <md-detail-item
          title="後四碼"
          :content="$store.getters.userInfo.paymentInfo[0].taypay_last_four"
        />
        <md-detail-item
          title="到期日"
          :content="
            $store.getters.userInfo.paymentInfo[0].taypay_expiry_date.substring(
              0,
              4
            ) +
              '/' +
              $store.getters.userInfo.paymentInfo[0].taypay_expiry_date.substring(
                4,
                6
              )
          "
        />
        <p
          slot="footer"
          style="font-size:0.25rem;line-height:.45rem;color:#858B9C;"
        >
          取物關門後將透過此信用卡自動消費
        </p>

        <md-button
          type="default"
          style="margin-top:2em;"
          size="small"
          plain
          @click="handleClick"
          >更換信用卡</md-button
        >
        <md-notice-bar
          v-if="!$store.getters.userInfo.paymentInfo[0].is_valid"
          icon="warn"
          type="warning"
          multi-rows
        >
          前次交易刷卡失敗，請更換有效信用卡以使用服務
        </md-notice-bar>
      </md-field>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Field,
  CellItem,
  Tag,
  NoticeBar,
  DetailItem
} from 'mand-mobile'
export default {
  name: 'CreditCard',
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [NoticeBar.name]: NoticeBar,
    [DetailItem.name]: DetailItem,
    Tag
  },
  data () {
    return {}
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'BindCreditCardPage' })
    }
  }
}
</script>

<style scoped>
.card {
  display: inline-block;
  position: relative;
  width: 100%;
  min-height: 200px;
  line-height: 5.5em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.23);
}

.wrapper {
  display: grid;
  grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
}
.box {
}
</style>