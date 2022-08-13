<template>
  <div>
    <div class="fixedtop">
      <md-field class="userinfo">
        <md-cell-item
          no-border
          style="margin-left:.3em; color:white"
          @click="$router.push('/userinfo')"
        >
          <img src="/PNG08-02.png" class="holder" slot="left" />
          <div style="color:white" slot="default">
            <!-- <p class="md-cell-item-title">
              {{ this.$store.getters.userInfo.user_name }}
            </p> -->
            <!-- <tag size="small" shape="fillet" font-color="white" type="ghost">{{
              this.$store.getters.userInfo.phone_number === ""
                ? "未驗證手機"
                : "已驗證手機"
            }}</tag> -->
            <!-- <p class="context_brief">
              樂坊點數：{{ this.$store.getters.userInfo.lefun_point }}
            </p> -->
          </div>
          <div class="context_right" style="color:white" slot="right">
            <!-- 個人資料 -->
            {{ this.$store.getters.userInfo.user_name }}
            <i
              class="md-icon icon-font md-icon-arrow-right arrow-right md"
              style="color:white"
            ></i>
          </div>
        </md-cell-item>
      </md-field>
      <!-- <md-notice-bar style="background-color: #e9f3ff;" icon="info"
        >剩餘樂坊點數：{{
          this.$store.getters.userInfo.lefun_point
        }}</md-notice-bar
      > -->
    </div>
    <div class="fixedbox" />
  </div>
</template>

<script>
import { Button, Field, CellItem, Tag, NoticeBar } from 'mand-mobile'
import Cookies from 'js-cookie'

export default {
  name: 'UserCard',
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [NoticeBar.name]: NoticeBar,
    Tag
  },
  data () {
    return {}
  },
  methods: {
    getProfilePic () {
      // default url
      let profile_pic_url = ''
      // 'https://cdn.dribbble.com/users/228053/screenshots/3086637/boba.png'

      if (
        this.$store.getters.userInfo &&
        this.$store.getters.userInfo.openid_account !== ''
      ) {
        let split_data = this.$store.getters.userInfo.openid_account.split('-')
        if (split_data[0] === 'FB') {
          profile_pic_url =
            'http://graph.facebook.com/' +
            split_data[1] +
            '/picture?type=normal'
        } else if (split_data[0] === 'G') {
          profile_pic_url = Cookies.get('GoogleProfileURL')
        }
      }
      return profile_pic_url
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
  background-color: #749985;
  padding: 0;
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
  height: 160px;
}

.holder {
  display: block;
  /* border-radius: 15px; */
  width: 250px;
  height: 80px;
  background-color: #749985;
  /* border: 2px solid #e2e4ea; */
}

.card {
  background: #fff;
  border-radius: 5px;
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
</style>