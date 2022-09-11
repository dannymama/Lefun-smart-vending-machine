<template>
  <div
    class="md-example-child md-example-child-scroll-view md-example-child-scroll-view-3"
  >
    <Nav />
    <div
      v-if="$store.getters.perchaseData._perchaseList.length <= 0"
      style="margin-top:1em;"
    >
      <md-result-page
        type="empty"
        text=" "
        subtext="尚無紀錄，歡迎前往嘗試取物樂趣"
      >
      </md-result-page>
    </div>
    <div v-else>
      <md-scroll-view
        ref="scrollView"
        :scrolling-x="false"
        @refreshing="$_onRefresh"
        @endReached="$_onEndReached"
        :auto-reflow="true"
      >
        <md-scroll-view-refresh
          slot="refresh"
          slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
          :scroll-top="scrollTop"
          :is-refreshing="isRefreshing"
          :is-refresh-active="isRefreshActive"
          refresh-text="下拉更新"
          refresh-active-text="釋放更新"
          refreshing-text="更新中"
        ></md-scroll-view-refresh>
        <md-field>
          <md-cell-item
            v-for="i in $store.getters.perchaseData._perchaseList"
            :key="i.lefunTransaction.lefun_transaction_id"
            :title="i.device_name"
            :brief="parseTime(i.createdAt)"
            :addon="i.amount.toString() + ' TWD'"
            @click="$_onItemClick(i)"
          ></md-cell-item>
        </md-field>
        <md-scroll-view-more
          slot="more"
          loading-text="讀取中"
          finished-text="全部已讀取"
          :is-finished="$store.getters.perchaseData._isFinished"
        ></md-scroll-view-more>
      </md-scroll-view>
      <md-popup v-model="isPopupShow" position="bottom">
        <md-popup-title-bar
          title="消費記錄"
          ok-text="確認"
          @confirm="isPopupShow = false"
        ></md-popup-title-bar>
        <div v-if="selectedPerchaseData.product_list.length > 0">
          <div class="md-example-popup md-example-popup-bottom">
            <md-bill water-mark="樂坊智能取物">
              <div class="header-slot" slot="header">
                <p class="desc">地點: {{ selectedPerchaseData.title }}</p>
                <p class="desc">時間: {{ selectedPerchaseData.createdAt }}</p>
                <p class="desc" v-if="selectedPerchaseData.use_lefun_point">
                  使用樂坊點數折扣
                </p>
              </div>
              <md-detail-item title="消費清單" bold />
              <md-detail-item
                water-mark="樂坊智能取物"
                v-for="(item, id) in selectedPerchaseData.product_list"
                :key="'id-' + id"
                :title="item.title"
              >
                {{ item.price }} TWD
              </md-detail-item>
              <md-detail-item
                title="總金額"
                :content="selectedPerchaseData.amount + ' TWD'"
                bold
              />
              <!-- <div
                v-if="selectedPerchaseData.invoiceUrl !== ''"
                class="footer-slot"
                slot="footer"
              >
                <a :href="selectedPerchaseData.invoiceUrl" target="_blank"
                  >電子發票已開立，請點此查詢查詢</a
                >
              </div> -->
            </md-bill>
          </div>
        </div>
      </md-popup>
    </div>
  </div>
</template>

<script>
import {
  ScrollView,
  ScrollViewMore,
  ScrollViewRefresh,
  Field,
  CellItem,
  FieldItem,
  Popup,
  Bill,
  PopupTitleBar,
  Toast,
  DetailItem,
  ResultPage,
  Icon,
  Dialog
} from 'mand-mobile'
import Nav from '@/components/Nav.vue'
import { parseTime } from '@/utils/common'
import { getInvoiceDetail } from '@/apis/LefunTrans'
export default {
  name: 'HistoryPage',
  components: {
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    [ScrollViewRefresh.name]: ScrollViewRefresh,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [Bill.name]: Bill,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    [ResultPage.name]: ResultPage,
    [DetailItem.name]: DetailItem,
    [Dialog.name]: Dialog,
    Toast,
    Nav
  },
  data () {
    return {
      list: 5,
      isFinished: false,
      isPopupShow: false,
      selectedPerchaseData: {
        title: '',
        product_list: [],
        amount: 0,
        createdAt: '',
        use_lefun_point: false,
        lefun_transaction_id: '',
        invoiceUrl: ''
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('RefreshPerchaseLogs')
  },
  methods: {
    parseTime: parseTime,
    $_onItemClick (i) {
      this.isPopupShow = true
      this.selectedPerchaseData.title = i.device_name
      this.selectedPerchaseData.createdAt = parseTime(i.createdAt)
      this.selectedPerchaseData.amount = i.amount
      this.selectedPerchaseData.product_list = JSON.parse(i.product_list)
      this.selectedPerchaseData.use_lefun_point = i.use_lefun_point
      this.selectedPerchaseData.lefun_transaction_id =
        i.lefunTransaction.lefun_transaction_id
      this.selectedPerchaseData.invoiceUrl = ''
      // this.getInvoiceDetail(i.lefunTransaction.lefun_transaction_id)
    },
    async $_onRefresh () {
      // async data
      await this.$store.dispatch('RefreshPerchaseLogs')
      this.$refs.scrollView.finishLoadMore()
      this.$refs.scrollView.finishRefresh()
    },
    async $_onEndReached () {
      await this.$store.dispatch('GetMorePerchaseLogs')
      this.$refs.scrollView.finishLoadMore()
    },
    async getInvoiceDetail (lefun_transaction_id) {
      let res = await getInvoiceDetail(lefun_transaction_id)
      if (res.resultCode === 1) {
        this.selectedPerchaseData.invoiceUrl = res.resultData.invoiceUrl
      }
    }
  }
}
</script>

<style scoped>
.md-example-child-scroll-view-3 {
  height: 100vh;
  background: #fff;
}
.md-example-child-scroll-view-3 .scroll-view-item {
  padding: 30px 0;
  text-align: center;
  font-size: 32px;
  font-family: DINAlternate-Bold;
  border-bottom: 0.5px solid #efefef;
}

.md-example-popup {
  position: relative;
  overflow: auto;
  max-height: 600px;
  overflow-y: scroll; /* has to be scroll, not auto */
  -webkit-overflow-scrolling: touch;
}
.md-example-popup-bottom {
  width: 100%;
}
.md-example-popup-bottom p {
  line-height: 50px;
}
.holder {
  display: block;
  width: 88px;
  height: 88px;
  background-color: #e6e6e6;
}
.footer-slot {
  padding: 32px 0;
  color: #858b9c;
  font-size: 22px;
  line-height: 1.5;
  border-top: solid 1px #e1e4eb;
}

.md-bill .header-slot {
  padding: 0px 0 20px 0;
}

.md-bill .header-slot .desc {
  margin-top: 16px;
  color: #858b9c;
  font-size: 28px;
}
</style>