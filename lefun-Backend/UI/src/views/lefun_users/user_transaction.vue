<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="phone_number"
        placeholder="用戶手機號碼"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <div class="filter-item">
      <el-date-picker
        v-model="value1"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        align="right"
      >
      </el-date-picker>
      </div>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        v-loading="listLoading"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>
    <div v-if="showBottonGroup" class="filter-container">
      <UserButtonGroup :phone_number="phone_number" />
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="device_name" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="訂單編號" min-width="105px">
        <template slot-scope="{ row }">
          {{ row.lefunTransaction.lefun_transaction_id }}
        </template>
      </el-table-column>
            </el-table-column>
      <el-table-column label="Taypay刷卡編號" width="155px">
        <template v-if="row.transactionLog" slot-scope="{ row }">
          {{ row.transactionLog.rec_trade_id }}
        </template>
      </el-table-column>
      <el-table-column label="付款狀態" width="110px">
        <template slot-scope="{ row }">
          {{ row.isPaid }}
        </template>
      </el-table-column>
      <el-table-column label="使用樂坊點數" width="110px">
        <template slot-scope="{ row }">
          {{ row.use_lefun_point }}
        </template>
      </el-table-column>
      <el-table-column label="總金額" width="110px">
        <template slot-scope="{ row }">
          {{ row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.createdAt | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="150">
        <template slot-scope="scope">
          <!-- <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="showTappayTransaction(scope.row.transactionLog)"
          >
            刷卡資料
          </el-button> -->
<el-popover
  placement="right"
  width="400"
  trigger="click">
  <el-table :data="JSON.parse(scope.row.product_list)">
    <el-table-column width="150" property="title" label="商品"></el-table-column>
    <el-table-column width="100" property="memo" label="memo"></el-table-column>
    <el-table-column width="300" property="price" label="單價"></el-table-column>
  </el-table>
        <el-button
            type="primary"
            size="small"
            icon="el-icon-delete"
          slot="reference"
          >
            購買商品清單
          </el-button>
</el-popover>
          </br>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="showInvoice(scope.row.lefunTransaction.lefun_transaction_id)"
          >
            電子發票資料
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getPerchaseLog, getTransactionInvoiceData } from '@/api/lefun_user'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import UserButtonGroup from '@/components/UserButtonGroup'
import SimpleVueValidation from 'simple-vue-validator'

const Validator = SimpleVueValidation.Validator
export default {
  name: 'user_transaction',
  components: { Pagination, UserButtonGroup },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  validators: {
    phone_number: function(value) {
      return Validator.value(value)
        .required()
        .regex('^09[0-9]{8}$', '請輸入正確手機格式')
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      phone_number: '',
      listLoading: false,
      showBottonGroup: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      importanceOptions: [1, 2, 3],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },

      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      value1: [new Date(Date.now() - 604800000), new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.params) {
      if (this.$route.params.phone_number) {
        this.phone_number = this.$route.params.phone_number
        this.getList()
      }
    }
  },
  methods: {
    async getList() {
      if (await this.$validate(['phone_number'])) {
        if (!this.value1) {
          this.$message({
            message: '請選擇日期區間',
            type: 'error'
          })
          return
        }
        this.listLoading = true
        this.showBottonGroup = false
        this.list = null
        let res = await getPerchaseLog(
          this.phone_number,
          this.listQuery,
          this.value1[0].toISOString(),
          this.value1[1].toISOString()
        )
        this.listLoading = false
        if (res.resultCode === 1) {
          this.list = res.resultData.logs
          this.total = res.resultData.count
          this.showBottonGroup = true
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
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    showProductList(list) {
      console.log(list)
    },
    async showInvoice(lefun_transaction_id) {
      let res = await getTransactionInvoiceData(lefun_transaction_id)
      if (res.resultCode === 1) {
        this.$alert(
          '發票已開立</br>發票號碼: ' +
            res.resultData.resObj.IIS_Number +
            '</br>發票細節: <a href="' +
            res.resultData.invoiceUrl +
            '" target="_blank">點此</a>',
          {
            confirmButtonText: '確定',
            dangerouslyUseHTMLString: true
          }
        )
        // window.open(
        //   res.resultData.invoiceUrl,
        //   'invoice',
        //   'height=600,width=600'
        // )
      } else {
        this.$alert(res.resultDes, {
          confirmButtonText: '確定',
          dangerouslyUseHTMLString: true
        })
      }
    }
  }
}
</script>