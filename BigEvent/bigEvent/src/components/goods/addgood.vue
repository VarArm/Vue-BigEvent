<template>
  <el-card>
    <Mybread one="商品管理" two="商品列表"></Mybread>
    <el-alert id="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <el-steps :active="active" finish-status="success" align-center :space="240">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs class="mytabs" :tab-position="tabPosition" @tab-click="tabclick" v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="form" label-width="80px" :label-position="labelPosition">
          <el-form-item label="商品名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{goodVal}}
            <el-cascader v-model="goodVal" :options="goodOpt" :props="propObj"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div v-for="(item,index) in goodsMany" :key="index">
          <div>{{item.attr_name}}</div>
          <div>
            <el-checkbox
              v-model="checked"
              border
              v-for="(item1,index1) in item.attr_vals.split(',')"
              :key="index1"
            >{{item1}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <el-form label-width="80px" :label-position="labelPosition">
          <el-form-item :label="item.attr_name" v-for="(item,index) in goodsOnly" :key="index">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
          :on-success="successPic"
          :on-preview="previewPic"
          :on-remove="removePic"
          :headers="headersObj"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          {{picList}}
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import Mybread from "../mylayout/mybread";
export default {
  data() {
    return {
      active: 0,
      tabPosition: "left",
      checked: true,
      //级联选择器的数据
      goodOpt: [],
      //级联选择器选择的数据集合
      goodVal: [],
      //商品参数列表
      goodsMany: [],
      //商品属性列表
      goodsOnly: [],
      //图片路径集合
      picList: [],
      activeName: "first",
      labelPosition: "top",
      propObj: { expandTrigger: "hover", label: "cat_name", value: "cat_id" },
      headersObj: { Authorization: window.localStorage.getItem("token") }
    };
  },
  methods: {
    getgoodOpt() {
      this.$http({
        url: `categories`,
        method: "get"
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.goodOpt = data;
        }
      });
    },
    getAttributes(sel) {
      if (this.goodVal.length !== 0) {
        this.$http({
          url: `categories/${
            this.goodVal[this.goodVal.length - 1]
          }/attributes?sel=${sel}`
        }).then(res => {
          let { meta, data } = res.data;
          if (meta.status === 200) {
            if (sel === "many") {
              this.goodsMany = data;
            } else if (sel === "only") {
              this.goodsOnly = data;
              console.log(data);
            }
          }
        });
      } else {
        this.$message.error("请先选择商品分类");
      }
    },

    //点击左边步骤条
    tabclick(val) {
      this.active = +val.index;
      if (val.index === "1") {
        this.getAttributes("many");
      }
      if (val.index === "2") {
        this.getAttributes("only");
      }
    },
    //预览图片
    previewPic(file) {
      var img = file.response.data.url;
    },
    //上传图片成功
    successPic(response, file, fileList) {
      console.log(response);
      this.picList.push(response.data.tmp_path);
    },
    removePic(response, file, fileList) {
      console.log(file);
    }
  },
  mounted() {
    this.getgoodOpt();
  },
  components: {
    Mybread: Mybread
  }
};
</script>

<style scoped>
.el-alert--info.is-light {
  margin: 20px 0;
}
.mytabs {
  margin-top: 20px;
}
.el-checkbox.is-bordered.is-checked {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 0;
}
</style>
