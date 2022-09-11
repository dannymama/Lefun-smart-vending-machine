<template>
  <div
    class="md-example-child md-example-child-scroll-view md-example-child-scroll-view-3"
  >
    <Nav />
    <md-scroll-view
      ref="scrollView"
      :scrolling-x="false"
      @refreshing="$_onRefresh"
      @endReached="$_onEndReached"
      :auto-reflow="true"
      @scroll="scroll"
    >
      <md-scroll-view-refresh
        slot="refresh"
        slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
        :scroll-top="scrollTop"
        :is-refreshing="isRefreshing"
        :is-refresh-active="isRefreshActive"
      ></md-scroll-view-refresh>
      <md-field>
        <md-cell-item
          v-for="i in $store.getters.newsData._newsList"
          :key="i.id"
          :title="i.title"
          :brief="i.sub_title"
          no-border
          @click="$_onItemClick(i)"
        >
          <!-- <img :src="i.imageURL" class="holder" slot="left" /> -->
          <div class="date">
            {{ i.createdAt.split("T")[0] }}
            <!-- <md-icon name="arrow-down" size="sm"></md-icon> -->
          </div>
          <div slot="children">
            <img :src="i.imageURL" style="width:100%;" />
            <div style="margin-top:.2em">
              <div style="border-bottom:solid 0.02rem rgb(150, 165, 157);" />
            </div>
          </div>
        </md-cell-item>
      </md-field>
      <md-scroll-view-more
        slot="more"
        :is-finished="$store.getters.newsData._isFinished"
      ></md-scroll-view-more>
    </md-scroll-view>

    <md-popup style="width:100%" v-model="isPopupShow" position="right">
      <Nav />
      <div>Popup Right</div>
    </md-popup>
  </div>
</template>

<script>
import {
  ScrollView,
  ScrollViewMore,
  ScrollViewRefresh,
  Field,
  CellItem,
  Toast,
  Icon,
  Popup,
  PopupTitleBar
} from 'mand-mobile'
import Nav from '@/components/Nav.vue'

export default {
  name: 'NewsPage',
  components: {
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    [ScrollViewRefresh.name]: ScrollViewRefresh,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    Toast,
    Nav
  },
  data () {
    return {
      list: 5,
      isFinished: false,
      isPopupShow: false
    }
  },
  async mounted () {
    if (this.$store.getters.newsData.scrollTop) {
      this.$nextTick(() => {
        this.$refs.scrollView.scrollTo(
          0,
          this.$store.getters.newsData.scrollTop.scrollTop,
          false
        )
      })
    }
    if (this.$store.getters.newsData._newsList === 0) {
      await this.$store.dispatch('RefreshNews')
    }
  },
  methods: {
    async logout () {
      await this.$store.dispatch('LogOut')
    },
    $_onItemClick (i) {
      this.$router.push({ path: '/news/' + i.id })
      // this.$refs.scrollView.scrollTo(1000, 1000, false)
    },
    async $_onRefresh () {
      // async data
      await this.$store.dispatch('RefreshNews')
      this.$refs.scrollView.finishLoadMore()
      this.$refs.scrollView.finishRefresh()
    },
    async $_onEndReached () {
      await this.$store.dispatch('GetMoreNews')
      this.$refs.scrollView.finishLoadMore()
    },
    scroll (data) {
      this.$store.dispatch('SetScrollTop', data)
    },
    trimTitle (title) {}
  }
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

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

.holder {
  display: block;
  width: 200px;
  height: 200px;
  background-color: #e6e6e6;
}

.date {
  display: inline-block;
  position: absolute;
  right: 0;
  /* bottom: 2em; */
  margin: 5px;
  color: #858b9c;
  font-size: 0.25rem;
}

.md-cell-item-children {
  padding: 0;
}
</style>