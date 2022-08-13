<template>
  <div style="min-height: 100vh; background-color:rgb(250, 250, 250);">
    <div v-show="current === 1">
      <UserCard />
      <md-notice-bar
        v-if="!$store.getters.userInfo.paymentInfo[0].is_valid"
        icon="warn"
        type="warning"
        multi-rows
      >
        前次交易刷卡失敗，請更換有效信用卡以使用服務
      </md-notice-bar>
      <UserFunctionList />
      <!-- <md-swiper
        style="height:120px"
        :autoplay="5000"
        transition="fade"
        ref="swiper"
      >
        <md-swiper-item>
          <img
            style="width:100%"
            src="https://www.buyandship.com.tw/contents/uploads/2018/02/signup-banner-3-compressed.jpg"
          />
        </md-swiper-item>
        <md-swiper-item>
          <img
            style="width:100%"
            src="https://images.trvl-media.com/media/content/exptw/images/citicard/citi-hero-2.jpg"
          />
        </md-swiper-item>
      </md-swiper> -->
    </div>
    <div v-show="current === 2">
      <About />
    </div>
    <div class="fixedbottom">
      <div
        class="md-example-child md-example-child-tabs md-example-child-tab-bar-4"
      >
        <!-- <md-tab-bar v-model="current" :items="items" :has-ink="false">
          <template slot="item" slot-scope="{ item }">
            <div class="custom-item">
              <div class="icon">
                <md-icon :name="item.icon" />
              </div>
              <div class="text">
                <span v-text="item.label"></span>
              </div>
            </div>
          </template>
        </md-tab-bar> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  Swiper,
  SwiperItem,
  TabBar,
  Icon,
  Button,
  Field,
  Tag,
  NoticeBar
} from 'mand-mobile'
import UserCard from '@/components/UserCard'
import UserFunctionList from '@/components/UserFunctionList'
import About from '@/components/About'

export default {
  name: 'MainPage',
  components: {
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    [TabBar.name]: TabBar,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Field.name]: Field,
    [NoticeBar.name]: NoticeBar,
    About,
    Tag,
    UserCard,
    UserFunctionList
  },
  data () {
    return {
      current: 1,
      items: [
        { name: 1, label: '首頁', icon: 'home' },
        { name: 2, label: '關於樂坊', icon: 'user' }
      ]
    }
  },
  mounted () {},
  methods: {
    click (goto) {
      this.$router.push(goto)
    }
  }
}
</script>

<style>
.wrapper {
  display: grid;
  grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
}
.box {
  padding: 0.1em;
}
.md-example-child-swiper-2 {
  height: 300px;
}
.md-example-child-swiper-2 .banner-item {
  width: 100%;
}

.fixedbottom {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid #e2e4ea;
  z-index: 100;
}
.md-example-child-tab-bar-4 .custom-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
}

.md-example-child-tab-bar-4 .custom-item .text {
  font-size: 23px;
  font-weight: bold;
}
</style>
