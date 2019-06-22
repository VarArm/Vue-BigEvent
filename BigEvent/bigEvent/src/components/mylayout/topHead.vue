<template>
    <div>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/imgs/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <h1>电商后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <a href="#" class="mylink" @click.prevent="logout">退出</a>
          </div>
        </el-col>
    </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('是否要退出系统?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      })
        .then(() => {
          window.localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>

</style>
