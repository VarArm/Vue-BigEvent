<template>
  <el-card>
    <Mybread one="数据统计" two="数据报表"></Mybread>
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
import Mybread from "../mylayout/mybread";
export default {
  components: {
    Mybread: Mybread
  }
};
</script>
<style>
</style>
