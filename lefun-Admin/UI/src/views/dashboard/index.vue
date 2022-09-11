<template>
  <div class="dashboard-container">
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

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        v-loading="listLoading"
        @click="fetchData"
      >
        Search
      </el-button>
      <el-tag class="filter-item" v-if="arrTime.length > 0">
        {{ "區間: " + arrTime[0] + " ~ " + arrTime[arrTime.length - 1] }}
      </el-tag>
    </div>

    <panel-group
      v-if="panelGroupData"
      @handleSetLineChartData="handleSetLineChartData"
      :val="panelGroupData"
    />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="lineData" :chart-data="lineData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { getToInvoiceData } from '@/api/perchase'
import { getRegisterInPeriod } from '@/api/lefun_user'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart
  },
  computed: {
    ...mapGetters(['type'])
  },
  mounted() {
    this.fetchData()
    this.lineData = this.lineChartData['PerchasePeriodAmount']
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineData = this.lineChartData[type]
    },
    async fetchData() {
      if (!this.value1) {
        this.$message({
          message: '請選擇日期區間',
          type: 'error'
        })
        return
      }
      this.listLoading = true
      const ddd = await getRegisterInPeriod(
        this.value1[0].toISOString(),
        this.value1[1].toISOString()
      )
      let response = await getToInvoiceData(
        this.value1[0].toISOString(),
        this.value1[1].toISOString()
      )
      this.list = response.resultData.perchaseInfo
      this.listLoading = false

      //計算x軸區間
      this.arrTime = []
      for (
        let q = this.value1[0];
        q <= this.value1[1];
        q.setDate(q.getDate() + 1)
      ) {
        this.arrTime.push(q.toISOString().split('T')[0])
      }
      let date = i => {
        return moment(i.createdAt).format('YYYY-MM-DD')
      }
      //依照日期分組各日金額總和
      let day_and_sum = _(this.list)
        .groupBy(date)
        .map((i, k) => ({
          sum: _.sumBy(i, 'amount'),
          date: k
        }))
        .value()
      //計算區間各日訂單總和
      let data = []
      for (let i = 0; i < this.arrTime.length; i++) {
        let temp =
          day_and_sum[_.findIndex(day_and_sum, { date: this.arrTime[i] })]
        data.push(temp ? temp.sum : 0)
      }
      //期間總金額
      let period_amount = _.sumBy(this.list, 'amount')
      //依照日期分組各日訂單數
      let period_data = _(this.list)
        .groupBy(date)
        .map((i, k) => ({
          count: i.length,
          date: k
        }))
        .value()

      let period_count = []
      for (let i = 0; i < this.arrTime.length; i++) {
        let temp =
          period_data[_.findIndex(period_data, { date: this.arrTime[i] })]
        period_count.push(temp ? temp.count : 0)
      }

      //註冊人數
      let register_data = ddd.resultData
      let registers_in_period = []
      let register_amount = _.sumBy(register_data, item => Number(item.count))
      for (let i = 0; i < this.arrTime.length; i++) {
        let temp =
          register_data[_.findIndex(register_data, { date: this.arrTime[i] })]
        registers_in_period.push(temp ? temp.count : 0)
      }
      this.lineChartData.PerchasePeriodAmount.DailyData = data
      this.lineChartData.PerchasePeriodAmount.xAxis = this.arrTime
      this.lineChartData.PerchaseCount.DailyData = period_count
      this.lineChartData.PerchaseCount.xAxis = this.arrTime
      this.lineChartData.RegisterCount.DailyData = registers_in_period
      this.lineChartData.RegisterCount.xAxis = this.arrTime
      this.panelGroupData.PerchasePeriodAmount = period_amount
      this.panelGroupData.PerchaseCount = this.list.length
      this.panelGroupData.RegisterCount = register_amount
      this.value1 = null
    }
  },
  data() {
    return {
      listLoading: true,
      list: null,
      lineData: null,
      arrTime: [],
      lineChartData: {
        PerchasePeriodAmount: {
          DailyData: [],
          xAxis: [],
          name: '金額總和'
        },
        PerchaseCount: {
          DailyData: [],
          xAxis: [],
          name: '訂單數'
        },
        RegisterCount: {
          DailyData: [],
          xAxis: [],
          name: '註冊人數'
        }
      },
      panelGroupData: {
        PerchasePeriodAmount: 0,
        PerchaseCount: 0,
        RegisterCount: 0
      },
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
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
