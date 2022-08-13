<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        @click="$router.push({ name: 'CreateNews' })"
      >
        新增消息
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt.split("T")[0] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="img">
        <template slot-scope="scope">
          <img style="width:130px" :src="scope.row.imageURL" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="ishot" width="70">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.isHot }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{ row }">
          <router-link :to="'/news/edit/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="180">
        <template slot-scope="scope">
          <router-link :to="'/news/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="onDelete(scope.row.id)"
          >
            Del
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
import { fetchList, deleteArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await fetchList(this.listQuery)
      this.list = result.resultData.news
      this.total = result.resultData.count
      this.listLoading = false
    },
    async onDelete(id) {
      this.listLoading = true
      const result = await deleteArticle(id)
      if (result.resultCode === 1) {
        this.$notify({
          title: '成功',
          message: '刪除成功',
          type: 'success',
          duration: 2000
        })
      } else {
        console.log('error submit!!')
        return false
      }
      this.getList()
      this.listLoading = false
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
