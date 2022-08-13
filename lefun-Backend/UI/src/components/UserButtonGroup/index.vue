<template>
  <el-button-group>
    <el-button class="filter-item" type="primary" @click="goBasicInfo">
      用戶基本資訊
    </el-button>
    <el-button class="filter-item" type="primary" @click="goBehaviorLog">
      用戶操作記錄
    </el-button>

    <el-button class="filter-item" type="primary" @click="goPerchaseLog">
      用戶訂單記錄
    </el-button>
  </el-button-group>
</template>

<script>
export default {
  name: 'UserButtonGroup',
  props: {
    phone_number: { default: '', type: String }
  },
  methods: {
    goBehaviorLog() {
      this.$router.push({
        name: 'behaviorLog',
        params: { phone_number: this.phone_number }
      })
    },
    goPerchaseLog() {
      this.$router.push({
        name: 'perchaseLog',
        params: { phone_number: this.phone_number }
      })
    },
    goBasicInfo() {
      this.$router.push({
        name: 'basicInfo',
        params: { phone_number: this.phone_number }
      })
    }
  }
}
</script>