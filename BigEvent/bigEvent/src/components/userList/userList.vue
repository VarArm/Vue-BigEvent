<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="myrow">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click.prevent="searchuser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" plain @click.prevent="addDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border :data="userList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态" width="100">
          <template slot-scope="scope">
            <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click.prevent="editDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click.prevent="deleteUser(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="mini"
              @click.prevent="AssignRoles(scope.row.id)"
            ></el-button>
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
      <el-dialog title="用户新增" :visible.sync="dialogFormVisible">
        {{addList}}
        <el-form :rules="rules" ref="dialogForm" :model="addList">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="addList.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="addList.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addList.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addList.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="cancelDialog">取 消</el-button>
          <el-button type="primary" @click.prevent="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改用户" :visible.sync="editdialog">
        <el-form :rules="rules" :model="editList">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input autocomplete="off" v-model="editList.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input autocomplete="off" v-model="editList.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input autocomplete="off" v-model="editList.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="candeleditUser">取 消</el-button>
          <el-button type="primary" @click.prevent="editUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="rolesdialog">
        <el-form>
          <el-form-item label="当前用户" :label-width="formLabelWidth1">
            <span>{{rolesList.username}}</span>
          </el-form-item>
          <el-form-item label="请选择角色" :label-width="formLabelWidth1">
            <el-select v-model="rolesList.rid">
              <el-option :value="-1" label="请选择角色" disabled></el-option>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="candelRoles">取 消</el-button>
          <el-button type="primary" @click.prevent="RolesAssign">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      pagenum: 1,
      pagesize: 5,
      query: "",
      total: 0,
      pagesizes: [5, 10, 15],
      formLabelWidth: "80px",
      formLabelWidth1: "100px",
      dialogFormVisible: false,
      editdialog: false,
      rolesdialog: false,
      addList: { username: "", email: "", mobile: "", password: "" },
      editList: { username: "", email: "", mobile: "" },
      rolesList: { username: "", roleName: "", rid: "" },
      options: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 11, message: "长度在 6 到 11 个字符", trigger: "blur" }
        ],
        email: [
          { type: "email", message: "邮箱地址格式不正确", trigger: "blur" }
        ],
        mobile: [{ type: "", message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  methods: {
    getDataList() {
      this.$http({
        url: `http://localhost:8888/api/private/v1/users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: "get",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(res => {
        console.log(res);
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.userList = data.users;
          this.total = data.total;
        }
      });
    },
    searchuser() {
      this.getDataList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getDataList();
    },
    addDialog() {
      this.dialogFormVisible = true;
    },
    cancelDialog() {
      this.dialogFormVisible = false;
    },
    addUser() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.$http({
            url: "http://localhost:8888/api/private/v1/users",
            method: "post",
            headers: { Authorization: window.localStorage.getItem("token") },
            data: this.addList
          }).then(res => {
            if (res.data.meta.status === 201) {
              this.$message({
                type: "success",
                message: res.data.meta.msg
              });
              this.dialogFormVisible = false;
              this.getDataList();
              // 清空新增面板
              this.addList.username = "";
              this.addList.password = "";
              this.addList.email = "";
              this.addList.mobile = "";
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        }
      });
    },
    editDialog(id) {
      this.editdialog = true;
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "get",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.editList = data;
        }
      });
    },
    candeleditUser() {
      this.editdialog = false;
    },
    editUser() {
      let id = this.editList.id;
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "put",
        headers: { Authorization: window.localStorage.getItem("token") },
        data: this.editList
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.editList = data;
          this.$message({
            type: "success",
            message: meta.msg
          });
          this.editdialog = false;
          this.getDataList();
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            method: "delete",
            headers: { Authorization: window.localStorage.getItem("token") }
          }).then(res => {
            if (res.data.meta.status == 200) {
              this.getDataList();
              this.$message({
                type: "success",
                message: res.data.meta.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    AssignRoles(id) {
      this.rolesdialog = true;
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "get",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(res => {
        console.log(res);
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.rolesList = data;
        }
      });
      this.$http({
        url: `http://localhost:8888/api/private/v1/roles`,
        method: "get",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(res => {
        if (res.data.meta.status == 200) {
          this.options = res.data.data;
        }
      });
    },
    candelRoles() {
      this.rolesdialog = false;
    },
    RolesAssign() {
      let rid = this.rolesList.rid;
      let id = this.rolesList.id;
      console.log(rid, id);
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}/role`,
        method: "put",
        headers: { Authorization: window.localStorage.getItem("token") },
        data: rid
      }).then(res => {
        console.log(res);
      });
      this.rolesdialog = false;
    }
  },
  mounted() {
    this.getDataList();
  }
};
</script>
<style>
.myrow {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
</style>
