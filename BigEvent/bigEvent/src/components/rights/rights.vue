<template>
  <el-card>
    <Mybread one="权限管理" two="权限列表"></Mybread>
    <el-table style="width: 100%" border :data="rightsData">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">{{scope.row.level==="0"?"一级":scope.row.level==="1"?"二级":"三级"}}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import Mybread from "../mylayout/mybread";
export default {
  data() {
    return {
      rightsData: []
    };
  },
  methods: {
    getRightsData() {
      this.$http({
        url: "rights/list",
        method: "get"
      }).then(res => {
        console.log(res);

        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.rightsData = data;
        }
      });
    }
  },
  mounted() {
    this.getRightsData();
  },
  components: {
    Mybread: Mybread
  }
};
</script>

<style>
.el-table {
  margin-top: 20px;
}
</style>
