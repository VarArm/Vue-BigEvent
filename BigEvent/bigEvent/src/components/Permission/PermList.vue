<template>
  <div>
    <el-card>
      <Mybread one="权限管理" two="角色列表"></Mybread>
      <el-row class="myrow">
        <el-col :span="4">
          <el-button plain @click.prevent="addRolesDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table style="width: 100%" border :data="rolesData">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="level1-row" v-for="level1 in scope.row.children" :key="level1.id">
              <el-col :span="4">
                <el-tag
                  @close="deleteright(scope.row.id,level1.id,scope)"
                  closable
                  type
                >{{level1.authName}}{{level1.id}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row class="level2-row" v-for="level2 in level1.children" :key="level2.id">
                  <el-col :span="5">
                    <el-tag
                      @close="deleteright(scope.row.id,level2.id,scope)"
                      closable
                      type="success"
                    >{{level2.authName}}{{level2.id}}</el-tag>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      @close="deleteright(scope.row.id,level3.id,scope)"
                      class="level3-row"
                      v-for="level3 in level2.children"
                      :key="level3.id"
                      closable
                      type="warning"
                    >{{level3.authName}}{{level3.id}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="scope.row.children.length === 0">
              <el-col :span="24">没有分配权限</el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click.prevent="editRolesDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click.prevent="deleteRole(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="mini"
              @click.prevent="permissionRole(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加角色" :visible.sync="addrolesDialog">
        <el-form :rules="rules" ref="rolesadd" :model="addroles">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="addroles.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
            <el-input v-model="addroles.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="canceladdroles">取 消</el-button>
          <el-button type="primary" @click.prevent="addrole">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑角色" :visible.sync="editrolesDialog">
        <el-form :rules="rules" :model="editroles">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="editroles.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
            <el-input v-model="editroles.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="canceleditroles">取 消</el-button>
          <el-button type="primary" @click.prevent="editrole">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="权限分配" :visible.sync="permissionrolesDialog">
        <div>
          <el-tree
            ref="tree"
            :data="permissionrolesData"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="checkedKeys"
            :props="defaultProps"
          ></el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="permissionrolesDialog = false">取 消</el-button>
          <el-button type="primary" @click.prevent="editpermission">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import Mybread from "../mylayout/mybread";
export default {
  data() {
    return {
      rolesData: [],
      addroles: { roleName: "", roleDesc: "" },
      editroles: { roleName: "", roleDesc: "" },
      formLabelWidth: "80px",
      addrolesDialog: false,
      editrolesDialog: false,
      permissionrolesDialog: false,
      defaultProps: {
        label: "authName",
        children: "children"
      },
      // 所有的权限数组
      permissionrolesData: [],
      // 当前角色的权限数组
      checkedKeys: [],
      // 当前角色的信息
      setRoleId: 0,
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getRolesData() {
      this.$http({
        url: `roles`,
        method: "get"
      }).then(res => {
        let { data, meta } = res.data;
        console.log(res);
        if (meta.status === 200) {
          this.rolesData = data;
        }
      });
    },
    addRolesDialog() {
      this.addrolesDialog = true;
    },
    canceladdroles() {
      this.addrolesDialog = false;
    },
    addrole() {
      this.$http({
        url: `roles`,
        method: "post",
        data: this.addroles
      }).then(res => {
        console.log(res);
        let { data, meta } = res.data;
        if (meta.status === 201) {
          this.addroles = data;
          this.$message({
            type: "success",
            message: meta.msg
          });
          this.addrolesDialog = false;
          this.getRolesData();
          this.addroles.roleName = "";
          this.addroles.roleDesc = "";
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    editRolesDialog(id) {
      this.$http({
        url: `roles/${id}`,
        method: "get"
      }).then(res => {
        let { data } = res.data;
        this.editroles = data;
      });
      this.editrolesDialog = true;
    },
    canceleditroles() {
      this.editrolesDialog = false;
    },
    editrole() {
      let id = this.editroles.roleId;
      this.$http({
        url: `roles/${id}`,
        method: "put",
        data: this.editroles
      }).then(res => {
        let { meta } = res.data;
        if (meta.status === 200) {
          this.getRolesData();
          this.editrolesDialog = false;
          this.$message({
            type: "success",
            message: "修改成功"
          });
        }
      });
    },
    deleteright(rolesid, rightsid, scope) {
      console.log(rolesid, rightsid, scope);
      this.$http({
        url: `roles/${rolesid}/rights/${rightsid}`,
        method: "DELETE"
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          scope.row.children = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: `roles/${id}`,
            method: "delete"
          }).then(res => {
            if (res.data.meta.status === 200) {
              this.getRolesData();
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
    permissionRole(roles) {
      this.setRoleId = roles.id;
      this.checkedKeys = [];
      // 获取所有权限列表
      this.$http({
        url: `rights/tree`,
        method: "get"
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.permissionrolesData = data;
          this.permissionrolesDialog = true;
          roles.children.forEach(item => {
            item.children.forEach(item1 => {
              item1.children.forEach(item2 => {
                this.checkedKeys.push(item2.id);
              });
            });
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    editpermission() {
      const idsAll = this.$refs.tree.getCheckedKeys();
      const idsHalf = this.$refs.tree.getHalfCheckedKeys();
      this.permissionrolesDialog = false;
      let ids = [...idsAll, ...idsHalf];
      let idsStr = ids.join(",");
      console.log(idsStr);

      // this.$http({
      //   url: `rights/tree`,
      //   method: "get"
      // }).then(res => {
      //   let { meta, data } = res.data;
      //   if (meta.status === 200) {
      //     this.permissionrolesData = data;
      //   }
      // });
    }
  },
  mounted() {
    this.getRolesData();
  },
  components: {
    Mybread: Mybread
  }
};
</script>
<style>
.myrow {
  margin-top: 20px;
  background-color: rgb(233, 238, 243);
}
.el-tag {
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
