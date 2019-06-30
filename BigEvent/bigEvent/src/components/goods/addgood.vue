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
            <el-input v-model="addObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addObj.goods_number"></el-input>
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
      <el-tab-pane label="商品内容" name="fifth">
        <div>
          <el-button size="small" type="success" @click.prevent="addGoodsFn">添加商品</el-button>
          <quillEditor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quillEditor>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="图片预览" :visible.sync="picDialog">
      <img ref="Myimg" src="#" alt="图片">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="picDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import Mybread from '../mylayout/mybread'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
export default {
  data () {
    return {
      content: `<p>111</p>`,
      editorOption: {},
      active: 0,
      tabPosition: 'left',
      checked: true,
      picDialog: false,
      // 级联选择器的数据
      goodOpt: [],
      // 级联选择器选择的数据集合
      goodVal: [],
      // 商品参数列表
      goodsMany: [],
      // 商品属性列表
      goodsOnly: [],
      // 添加商品参数
      addObj: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      },
      // 图片路径集合
      picList: [],
      activeName: 'first',
      labelPosition: 'top',
      propObj: { expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' },
      headersObj: { Authorization: window.localStorage.getItem('token') }
    }
  },
  methods: {
    getgoodOpt () {
      this.$http({
        url: `categories`,
        method: 'get'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.goodOpt = data
        }
      })
    },
    getAttributes (sel) {
      if (this.goodVal.length !== 0) {
        this.$http({
          url: `categories/${
            this.goodVal[this.goodVal.length - 1]
          }/attributes?sel=${sel}`
        }).then(res => {
          let { meta, data } = res.data
          if (meta.status === 200) {
            if (sel === 'many') {
              this.goodsMany = data
            } else if (sel === 'only') {
              this.goodsOnly = data
              console.log(data)
            }
          }
        })
      } else {
        this.$message.error('请先选择商品分类')
      }
    },

    // 点击左边步骤条
    tabclick (val) {
      this.active = +val.index
      if (val.index === '1') {
        this.getAttributes('many')
      }
      if (val.index === '2') {
        this.getAttributes('only')
      }
    },
    // 预览图片
    previewPic (file) {
      this.picDialog = true
      var img = file.response.data.url
      this.$nextTick(() => {
        this.$refs.Myimg.src = img
      })
    },
    // 上传图片成功
    successPic (response, file, fileList) {
      this.picList.push(response.data.tmp_path)
    },
    removePic (response, file, fileList) {
      console.log(response)
      console.log(response.response.data.tmp_path)
      this.picList.forEach((item, index) => {
        if (response.response.data.tmp_path === item) {
          this.picList.splice(index, 1)
        }
      })
    },
    onEditorReady (editor) {
      // 准备编辑器
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {}, // 内容改变事件
    // 添加商品
    addGoodsFn () {
      this.$http({
        method: 'post',
        url: 'goods',
        data: {
          ...this.addObj,
          goods_introduce: this.content,
          goods_cat: this.goodVal.join(',')
        }
      }).then(res => {
        console.log(res)

        if (res.data.meta.status === 201) {
          this.$message.success(res.data.meta.msg)
          this.$router.push('/goods')
        }
      })
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.getgoodOpt()
  },
  components: {
    Mybread: Mybread,
    quillEditor
  }
}
</script>

<style >
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
.ql-editor {
  height: 400px;
}
</style>
