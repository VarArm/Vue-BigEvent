<template>
  <el-container>
    <el-header>
      <el-row>
        <TopHead></TopHead>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <SideBar></SideBar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import TopHead from '../mylayout/topHead'
import SideBar from '../mylayout/sideBar'
export default {
  components: {
    TopHead: TopHead,
    SideBar: SideBar
  }
}
</script>
<style>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header h1 {
  margin: 0;
  color: #fff;
}
.el-header .mylink {
  text-decoration: none;
  color: green;
  float: right;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 100%;
}
.el-aside h5 {
  margin: 0;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 100%;
}
</style>
