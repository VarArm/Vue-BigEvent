<template>
  <el-menu class="mymenu el-menu-vertical-demo" :router="true" :unique-opened="true">
    <el-submenu :index="item.path" v-for="(item,index) in leftList" :key="index">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item.authName}}</span>
      </template>
      <el-menu-item :index="item2.path" v-for="(item2,index2) in item.children" :key="index2">
        <i class="el-icon-menu"></i>
        {{item2.authName}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      leftList: []
    }
  },
  methods: {
    getLeftList () {
      this.$http({
        url: `menus`
      }).then(res => {
        let { meta, data } = res.data
        if (meta.status === 200) {
          this.leftList = data
          console.log(data)
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted () {
    this.getLeftList()
  }
}
</script>

<style>
.mymenu {
  height: 100%;
}
</style>
