<template>
  <div>
    <el-card>
      <Mybread one="商品管理" two="商品分类"></Mybread>
      <el-row class="myrow">
        <el-col :span="4">
          <el-button plain @click.prevent="addcategories">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table border :data="pageList" v-loading="loading">
        <el-table-tree-column
          treeKey="cat_id"
          parentKey="cat_pid"
          levelKey="cat_level"
          prop="cat_name"
          label="分类名称"
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
        ></el-table-tree-column>
        <el-table-column label="级别">
          <template
            slot-scope="scope"
          >{{scope.row.cat_level===0?'一级':scope.row.cat_level===1?'二级':"三级"}}</template>
        </el-table-column>
        <el-table-column label="是否有效" width="100">
          <template slot-scope="scope">{{scope.row.cat_deleted?"无效":"有效"}}</template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template>
            <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <el-dialog title="添加商品" :visible.sync="addcateDialog">
        <el-form>
          <el-form-item label="商品名称" :label-width="formLabelWidth" prop="cat_name">
            <el-input autocomplete="off" v-model="addName"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" :label-width="formLabelWidth">
            {{addVal}}
            <el-cascader
              placeholder="默认添加一级分类"
              clearable
              v-model="addVal"
              :options="options"
              :props="propsObj"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="addcateDialog=false">取 消</el-button>
          <el-button type="primary" @click.prevent="addcateFn">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Mybread from '../mylayout/mybread'
export default {
  data () {
    return {
      addVal: [],
      options: [],
      categoriesList: [],
      pageList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      pagesizes: [5, 10, 15],
      addcateDialog: false,
      formLabelWidth: '80px',
      loading: true,
      addName: '',
      addlevel: 0,
      addPid: 0,
      propsObj: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    getcategoriesData () {
      this.$http({
        url: `categories`,
        method: 'get'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.categoriesList = data
          this.total = this.categoriesList.length
          this.getPageData()
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }
      })
    },
    getaddVal () {
      this.$http({
        url: `categories?type=2`,
        method: 'get'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.options = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    getPageData () {
      let begin = this.pagesize * (this.pagenum - 1)
      let end = this.pagesize * this.pagenum
      console.log(begin, end)
      this.pageList = this.categoriesList.slice(begin, end)
    },
    handleSizeChange (SizePage) {
      this.pagesize = SizePage
      this.getcategoriesData()
    },
    handleCurrentChange (CurrentPage) {
      this.pagenum = CurrentPage
      this.getcategoriesData()
    },
    addcategories () {
      this.addcateDialog = true
    },
    addcateFn () {
      this.addPid =
        this.addVal.length === 0 ? 0 : this.addVal[this.addVal.length - 1]
      this.addlevel = this.addVal.length
      this.$http({
        url: `categories`,
        method: 'post',
        data: {
          cat_pid: this.addPid,
          cat_name: this.addName,
          cat_level: this.addlevel
        }
      }).then(res => {
        let { meta } = res.data
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.getcategoriesData()
          this.addcateDialog = false
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted () {
    this.getcategoriesData()
    this.getaddVal()
  },
  components: {
    Mybread: Mybread
  }
}
</script>
<style scoped>
.myrow {
  margin-top: 20px;
  background-color: rgb(233, 238, 243);
}
</style>
