<template>
  <el-card>
    <Mybread one="商品管理" two="商品列表"></Mybread>
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchgood"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click.prevent="$router.push('/addGood')">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table border :data="goodsList">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.add_time | datefilter}}</span>
        </template>
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
  </el-card>
</template>

<script>
import Mybread from "../mylayout/mybread";
import moment from "moment";
export default {
  data() {
    return {
      goodsList: [],
      query: "",
      pagesize: 10,
      pagenum: 1,
      pagesizes: [10, 15, 20],
      total: 0
    };
  },
  methods: {
    getGoodsList() {
      this.$http({
        url: `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`,
        method: "get"
      }).then(res => {
        console.log(res);
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.goodsList = data.goods;
          this.total = data.total;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getGoodsList();
    },
    searchgood() {
      this.getGoodsList();
    },
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum;
      this.getGoodsList();
    },
    addGoodDialog() {}
  },
  mounted() {
    this.getGoodsList();
  },
  filters: {
    datefilter: function(value) {
      return moment(value).format("YYYY-MM-DD h:mm:ss");
    }
  },
  components: {
    Mybread: Mybread
  }
};
</script>
<style scope>
.myrow {
  margin-top: 20px;
  background-color: rgb(233, 238, 243);
}
</style>
