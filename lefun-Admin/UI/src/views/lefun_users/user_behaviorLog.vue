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
      <el-table-column label="Type" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Memo" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.memo }}
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.createdAt | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
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
import { getBehaviorLog } from '@/api/lefun_user'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import SimpleVueValidation from 'simple-vue-validator'
import UserButtonGroup from '@/components/UserButtonGroup'

const Validator = SimpleVueValidation.Validator

export default {
  name: 'user_behaviorLog',
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
      showBottonGroup: false,
      listLoading: false,
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
        let res = await getBehaviorLog(
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
    }
  }
}
</script>