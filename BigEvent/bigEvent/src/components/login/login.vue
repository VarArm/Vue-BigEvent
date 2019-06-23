<template>
  <div class="login">
    <div class="content">
      <el-form
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        :label-position="labelPosition"
        :model="loginObj"
        status-icon
      >
        <h2>用户登录</h2>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginObj.username"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input type="password" v-model="loginObj.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click.prevent="putLogin">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginObj: {
        username: "",
        password: ""
      },
      labelPosition: "top",
      rules: {
        // required: 当前属性是必须的
        // message: 如果不填会出现的提示信息
        // trigger：触发这个规则的时间 blur 失去焦点
        username: { required: true, message: "请输入用户名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" }
      }
    };
  },
  methods: {
    putLogin() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http({
            url: "login",
            method: "post",
            data: this.loginObj
          })
            .then(res => {
              console.log(res);
              let { data, meta } = res.data;
              if (meta.status === 200) {
                this.$router.push("/");
                window.localStorage.setItem("token", data.token);
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
              } else {
                this.$message.error(meta.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>
<style>
.login {
  width: 100%;
  height: 100%;
  background-color: #324152;
  position: relative;
}
.content {
  width: 580px;
  height: 440px;
  padding: 40px;
  box-sizing: border-box;
  position: absolute;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>
