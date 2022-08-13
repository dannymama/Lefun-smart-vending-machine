<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <el-button-group>
          <el-button v-loading="loading" type="success" @click="submitForm">
            {{ !isEdit ? "新增消息" : "修改消息" }}
          </el-button>

          <el-button
            v-loading="loading"
            type="primary"
            @click="$router.push({ name: 'News' })"
          >
            返回消息列表
          </el-button>

          <el-button
            v-loading="loading"
            type="primary"
            @click="openNewTab('https://upload.cc/')"
          >
            上傳圖片
          </el-button>
        </el-button-group>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <el-form-item
              style="margin-bottom: 20px;"
              label-width="100px"
              label="標題:"
              prop="title"
            >
              <el-input
                v-model="postForm.title"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the content"
              />
            </el-form-item>

            <el-form-item
              style="margin-bottom: 20px;"
              label-width="100px"
              label="副標題:"
              prop="sub_title"
            >
              <el-input
                v-model="postForm.sub_title"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the content"
              />
            </el-form-item>

            <el-form-item
              style="margin-bottom: 20px;"
              label-width="100px"
              label="圖片網址:"
            >
              <el-input
                v-model="postForm.imageURL"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the content"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 40px;"
          label-width="100px"
          label="熱門:"
        >
          <el-switch
            v-model="postForm.isHot"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-value="0"
            active-value="1"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}words</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.context" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/SingleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle, updateArticle, createArticle } from '@/api/article'
// import { searchUser } from '@/api/remote-search'

const defaultForm = {
  id: '',
  title: '', // 文章题目
  context: '', // 文章内容
  sub_title: '', // 文章摘要
  imageURL: '', // 文章图片
  isHot: 0
}

export default {
  name: 'NewsDetail',
  components: {
    Tinymce,
    Sticky
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '必要項目',
          type: 'error'
        })
        callback(new Error(rule.field + '必要項目'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: 'url錯誤',
            type: 'error'
          })
          callback(new Error('url錯誤'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        sub_title: [{ validator: validateRequire }],
        context: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.sub_title.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.display_time)
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then(response => {
          this.postForm = response.resultData
          this.postForm.isHot = this.postForm.isHot ? '1' : '0'
          // // just for test
          // this.postForm.title += `   Article Id:${this.postForm.id}`;
          // this.postForm.content_short += `   Article Id:${this.postForm.id}`;
        })
        .catch(err => {
          console.log(err)
        })
    },
    async submitForm() {
      this.$refs.postForm.validate(async valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            const res = await updateArticle(this.postForm)
            if (res.resultCode === 1) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              console.log('error submit!!')
              return false
            }
          } else {
            const res = await createArticle(this.postForm)
            if (res.resultCode === 1) {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            } else {
              console.log('error submit!!')
              return false
            }
          }
          this.$router.push({ name: 'News' })
          this.loading = false
        }
      })
    },
    openNewTab(link) {
      window.open(link, 'name', 'height=400,width=400')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
