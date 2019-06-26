<template>
  <el-card>
    <Mybread one="商品管理" two="商品列表"></Mybread>
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchuser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click.prevent="addDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table border :data="goodsList">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="商品名称"></el-table-column>
      <el-table-column prop="email" label="商品价格(元)"></el-table-column>
      <el-table-column prop="mobile" label="商品重量"></el-table-column>
      <el-table-column prop="mobile" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import Mybread from '../mylayout/mybread'
export default {
  data () {
    return {
      goodsList: {}
    }
  },
  methods: {
    getGoodsList () {}
  },
  mounted () {
    this.getGoodsList()
  },
  components: {
    Mybread: Mybread
  }
}
</script>
<style scope>
.myrow {
  margin-top: 20px;
  background-color: rgb(233, 238, 243);
}
</style>
