<template>
  <qrcode
    v-if="qrcodeString !== ''"
    :value="qrcodeString"
    :options="{ width: 300 }"
    tag="img"
  ></qrcode>
</template>

<script>
import { qrcode } from '@/apis/Demo'

export default {
  name: 'generateQRCode',
  components: {},
  props: {},
  data () {
    return {
      qrcodeValue: { lefun_transaction_id: '', usePoint: 0 },
      qrcodeString: ''
    }
  },
  async mounted () {
    let res = await qrcode()
    this.qrcodeValue.lefun_transaction_id = res.resultData.lefun_transaction_id
    this.qrcodeString = JSON.stringify(this.qrcodeValue)
  }
}
</script>
<style scoped>
</style>
