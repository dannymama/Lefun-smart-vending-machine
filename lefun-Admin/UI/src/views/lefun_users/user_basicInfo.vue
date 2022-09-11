<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="phone_number"
        placeholder="用戶手機號碼"
        style="width: 200px;"
        class="filter-item"
        maxlength="10"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        v-loading="loading"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>
    <div v-if="userInfo.user_name">
      <div class="filter-container">
        <UserButtonGroup :phone_number="this.userInfo.phone_number" />
      </div>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span>用戶資訊</span>
            </div>
            <el-form>
              <el-form-item size="mini" label="名稱"
                >{{ this.userInfo.user_name }}
              </el-form-item>
              <el-form-item size="mini" label="電話號碼"
                >{{ this.userInfo.phone_number }}
              </el-form-item>
              <el-form-item size="mini" label="UID"
                >{{ this.userInfo.id }}
              </el-form-item>
              <el-form-item size="mini" label="樂坊點數"
                >{{ this.userInfo.lefun_point }}
              </el-form-item>
              <el-form-item size="mini" label="電子信箱"
                >{{ this.userInfo.email }}
              </el-form-item>
              <el-form-item size="mini" label="電子發票當前設定"
                >{{ this.userInfo.invoice_type | invoiceTypeFilter }}
              </el-form-item>
              <el-form-item size="mini" label="電子發票載具編號"
                >{{ this.userInfo.mobile_device }}
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span>信用卡</span>
            </div>

            <el-form>
              <el-form-item size="mini" label="狀態">
                <div
                  v-if="this.userInfo.paymentInfo[0].is_valid"
                  style="color:green"
                >
                  正常
                </div>
                <div v-else style="color:red">異常</div>
              </el-form-item>
              <el-form-item size="mini" label="前六碼"
                >{{ this.userInfo.paymentInfo[0].taypay_bin_code }}
              </el-form-item>
              <el-form-item size="mini" label="後四碼"
                >{{ this.userInfo.paymentInfo[0].taypay_last_four }}
              </el-form-item>
              <el-form-item size="mini" label="卡片類型"
                >{{ this.userInfo.paymentInfo[0].taypay_type | tappay_type }}
              </el-form-item>
              <el-form-item size="mini" label="卡片類別"
                >{{
                  this.userInfo.paymentInfo[0].taypay_funding | tappay_funding
                }}
              </el-form-item>
              <el-form-item size="mini" label="到期日"
                >{{ this.userInfo.paymentInfo[0].taypay_expiry_date }}
              </el-form-item>
              <el-form-item size="mini" label="卡片發行國家"
                >{{ this.userInfo.paymentInfo[0].taypay_country }}
              </el-form-item>
              <el-form-item size="mini" label="卡片發行國家碼"
                >{{ this.userInfo.paymentInfo[0].taypay_country_code }}
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserInfoByPhoneNum } from '@/api/lefun_user'
import UserButtonGroup from '@/components/UserButtonGroup'
import SimpleVueValidation from 'simple-vue-validator'

const Validator = SimpleVueValidation.Validator

export default {
  name: 'user_basicInfo',
  components: { UserButtonGroup },
  filters: {
    invoiceTypeFilter(type) {
      const typeMap = {
        0: '捐贈',
        1: '手機載具',
        2: '電子信箱'
      }
      return typeMap[type]
    },
    tappay_type(type) {
      const typeMap = {
        1: 'VISA',
        2: 'MasterCard',
        3: 'JCB',
        4: 'Union Pay',
        5: 'AMEX'
      }
      return typeMap[type]
    },
    tappay_funding(type) {
      const typeMap = {
        0: '信用卡 (Credit Card)',
        1: '簽帳卡 (Debit Card)asterCard',
        2: '預付卡 (Prepaid Card)'
      }
      return typeMap[type]
    }
  },
  validators: {
    phone_number: function(value) {
      return Validator.value(value)
        .required()
        .regex('^09[0-9]{8}$', '請輸入正確手機格式')
    }
  },
  mounted() {
    if (this.$route.params) {
      if (this.$route.params.phone_number) {
        this.phone_number = this.$route.params.phone_number
        this.handleFilter()
      }
    }
  },
  data() {
    return {
      phone_number: '',
      userInfo: {},
      loading: false
    }
  },
  methods: {
    async handleFilter() {
      this.userInfo = {}
      if (await this.$validate(['phone_number'])) {
        this.loading = true
        let res = await getUserInfoByPhoneNum(this.phone_number)
        this.loading = false

        if (res.resultCode === 1) {
          this.userInfo = res.resultData.userInfo
        } else {
          this.$message({
            message: res.resultDes,
            type: 'warning'
          })
        }
      } else {
        this.$message({
          message: '請輸入正確手機號碼',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 8px 0;
}

.box-card {
  width: 480px;
}
</style>
