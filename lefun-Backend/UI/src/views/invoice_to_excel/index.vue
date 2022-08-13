<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
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
        @click="fetchData"
      >
        查詢
      </el-button>
    </div>
    <div v-if="list">
      <FilenameOption v-model="filename" />
      <BookTypeOption v-model="bookType" />
      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        匯出檔案
      </el-button>

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
        <el-table-column label="手機號碼" width="155px">
          <template slot-scope="{ row }">
            {{ row.user.phone_number }}
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
      </el-table>
    </div>
  </div>
</template>

<script>
import { getToInvoiceData } from '@/api/perchase'
import { parseTime } from '@/utils'
import FilenameOption from './FilenameOption'
import BookTypeOption from './BookTypeOption'

// options components
export default {
  name: 'InvoiceToExcel',
  components: { FilenameOption, BookTypeOption },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'csv',
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
  created() {},
  methods: {
    fetchData() {
      if (!this.value1) {
        this.$message({
          message: '請選擇日期區間',
          type: 'error'
        })
        return
      }
      this.listLoading = true
      getToInvoiceData(
        this.value1[0].toISOString(),
        this.value1[1].toISOString()
      ).then(response => {
        this.list = response.resultData.perchaseInfo
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '匯入單號',
          '自訂編號',
          '客戶編號',
          '統一編號',
          '客戶名稱',
          '客戶地址',
          '客戶手機號碼',
          '客戶電子信箱',
          '課稅別',
          '發票金額',
          '發票捐贈',
          '發票捐贈代碼',
          '載具類別',
          '載具編號',
          '列印註記',
          '備註',
          '字軌類別',
          '商品名稱',
          '購買數量',
          '商品單位',
          '單價',
          '商品備註',
          '經海註記'
        ]
        const filterVal = [
          'Index',
          'RelateNumber',
          'CustomerID',
          'CustomerIdentifier',
          'CustomerName',
          'CustomerAddr',
          'CustomerPhone',
          'CustomerEmail',
          'TaxType',
          'SalesAmount',
          'Donation',
          'LoveCode',
          'CarruerType',
          'CarruerNum',
          'Print',
          'InvoiceRemark',
          'InvType',
          'ItemName',
          'ItemCount',
          'ItemWord',
          'ItemPrice',
          'ItemRemark',
          'OverSeaRemark'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      let result = []
      for (let v = 0; v < jsonData.length; v++) {
        let temp = JSON.parse(jsonData[v].product_list)

        for (let o = 0; o < temp.length; o++) {
          let data = filterVal.map(j => {
            switch (j) {
              case 'Index':
                return v + 1
              case 'RelateNumber':
                if (o !== 0) return ''
                return jsonData[v]['lefunTransaction']['lefun_transaction_id']
              case 'CustomerID':
                return ''
              case 'CustomerIdentifier':
                return ''
              case 'CustomerName':
                return ''
              case 'CustomerAddr':
                return ''
              case 'CustomerPhone':
                if (o !== 0) return ''
                return jsonData[v]['user']['phone_number'].toString()
              case 'CustomerEmail':
                if (o !== 0) return ''
                return jsonData[v]['user']['email'] || ''
              case 'TaxType':
                if (o !== 0) return ''
                return '1'
              case 'SalesAmount':
                if (o !== 0) return ''
                return jsonData[v]['amount']
              case 'Donation':
                if (o !== 0) return ''
                return jsonData[v]['invoice_type'] === 0 ? '1' : '0'
              case 'LoveCode':
                if (o !== 0) return ''
                return '5880'
              case 'CarruerType':
                if (o !== 0) return ''
                if (jsonData[v]['invoice_type'] === 1) {
                  return '3'
                } else if (jsonData[v]['invoice_type'] === 2) {
                  return '1'
                }
                return ''
              case 'CarruerNum':
                if (o !== 0) return ''
                return jsonData[v]['invoice_type'] === 1
                  ? jsonData[v]['user']['mobile_device']
                  : ''
              case 'Print':
                if (o !== 0) return ''
                return '0'
              case 'InvoiceRemark':
                return ''
              case 'InvType':
                if (o !== 0) return ''
                return '07'
              case 'ItemName':
                return temp[o].title
              case 'ItemCount':
                return '1'
              case 'ItemWord':
                return '樣'
              case 'ItemPrice':
                return temp[o].price
              case 'ItemRemark':
                return ''
              case 'OverSeaRemark':
                return ''
              default:
                return this.byString(v, j)
            }
          })
          result.push(data)
        }
      }
      return result
    },
    byString(o, s) {
      try {
        s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
        s = s.replace(/^\./, '') // strip a leading dot
        var a = s.split('.')
        for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i]
          if (k in o) {
            o = o[k]
          } else {
            return
          }
        }
        return o
      } catch (err) {
        return undefined
      }
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>