<template>
  <div>
    <div class="navheader">
      <md-icon
        class="navleft"
        style="position:absolute;"
        size="lg"
        name="arrow-left"
        color="white"
        @click="back"
      ></md-icon>
      <div class="navcenter" @click="activated">
        {{ $breadcrumbs[0] ? $breadcrumbs[0].meta.breadcrumb : title }}
      </div>
    </div>
    <div class="navcontent" @scroll="scroll" ref="content"></div>
    <div class="fixed-menu"></div>
  </div>
</template>

<script>
import { Icon } from 'mand-mobile'
export default {
  name: 'page',
  components: {
    [Icon.name]: Icon
  },
  props: {
    title: { default: '', type: String }
  },
  data () {
    return {
      scrollTop: 0,
      fromRoute: null
    }
  },
  mounted () {},
  methods: {
    back () {
      if (this.$navigation.getRoutes().length === 1) {
        this.$router.push('/')
      } else {
        this.$router.go(-1)
      }
    },
    scroll () {
      this.scrollTop = this.$refs.content.scrollTop
    },
    activated () {
      this.$refs.content.scrollTop = this.scrollTop
    }
  }
}
</script>

<style>
.navheader {
  position: fixed;
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  padding: 0.2rem 0.28rem;
  height: 0.8rem;
  font-size: 0.34rem;
  border-bottom: 0.5px solid #e2e4ea;
  z-index: 100;
  background-color: #749985 !important;
}

.navleft,
.navright {
  width: 40px;
  padding: 0 15px;
  cursor: pointer;
}

.navcenter {
  position: relative;
  flex: 1;
  text-align: center;
  color: white;
  font-weight: bold;
  z-index: -1;
}

.fixed-menu {
  position: relative;
  width: 100%;
  padding: 0.2rem 0.28rem;
}
</style>