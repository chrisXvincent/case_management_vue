<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">

      <!-- 业务、模块选项 -->
      <el-form-item label="业务名称" label-width="80px">
        <el-select placeholder="请选择" clearable v-model="params.business_name" @change="getfunctionMoudal">
          <el-option v-for="(item, index) in MoudalName" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="功能模块" label-width="80px">
        <el-select placeholder="请选择" v-model="params.module_name" clearable>
          <el-option v-for="(item, index) in functionMoudal" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <!-- 用例名称输入框 -->
      <el-form-item label="用例名称" label-width="80px" style="margin-right: 20px;">
        <el-input placeholder="请输入内容" v-model="params.case_title" style="width: 500px;"></el-input>
      </el-form-item>

      <!-- 操作按键 -->
      <el-form-item style="margin-left: 10px;">
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button type="info"@click="onCancel">取消</el-button>
      </el-form-item>

      <!-- 富文本编辑器 -->
      <div class="egit_box" style="margin-left: 10px;">
        <p>● 修改用例： case_id: {{ params.case_id }}</p>
        <div class="text_box" style="width: 100%;display: flex;justify-content: center;">
          <vue-egdit ref="veditor" id="veditor" v-model="params.case_content" :menus="meaus" style="width: 100%;"></vue-egdit>
        </div>
      </div>

    </el-form>
  </div>
</template>


<script>
import vueEgdit from 'vue-wangeditor'
import { getBusiness, getfunctionMoudalList, addCase, getCaseDetail } from "@/api/table";
import { getInfo } from "@/api/user";

export default {
  components: {
    vueEgdit
  },
  data() {
    return {
      message: "",
      MoudalName: [],
      functionMoudal: [],
      params: {
          case_id: "",
          business_name: "",
          module_name: "",
          case_title: "",
          case_content: "",
          status:"1",
          editor:""
      },
      // 富文本编辑器工具栏
      meaus: [
        'source', // 源码模式
        '|',
        'bold', // 粗体
        'underline', // 下划线
        'italic', // 斜体
        'strikethrough', // 中线
        'head', // 标题
        '|',
        'fontfamily', // 字体
        'fontsize', // 字号
        'forecolor', // 文字颜色
        'bgcolor', // 背景颜色
        'eraser', // 清空格式
        '|',
        'unorderlist', // 无序列表
        'orderlist', // 有序列表
        'alignleft', // 左对齐
        'aligncenter', // 居中
        'alignright', // 右对齐
        '|',
        'quote', // 引用
        'link', // 链接
        'unlink', // 取消链接
        'table', // 表格
        // 'emotion', // 表情
        // '|',
        // 'img', // 图片
        // 'video', // 视频
        'insertcode', // 插入代码
        '|',
        'undo', // 撤销
        'redo', // 重做
        'fullscreen' // 全屏
      ]
    }
  },

  mounted() {
    this.getCase();
    this.setContent();
    this.getUsername();
    this.getBusinessName();
  },

  methods: {
    // 保存修改
    onSubmit() {
      if(this.params.case_title=="" || this.params.business_name=="" || this.params.module_name=="") {
        this.$message({
          message: '业务、模块、用例名称必填！',
          type: 'warning'
        });        
      } else {
        this.getContent();
        addCase(this.params).then((response) => {
          if (response.code == '20000') {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            var that = this;
            setTimeout(function() { that.goTablePage(); }, 500);
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            });
          }
        });
      };
    },
    // 取消返回
    onCancel() {
      this.$message({
        message: '已取消修改',
        type: 'info'
      });
      var that = this;
      setTimeout(function() { that.goTablePage(); }, 500);
    },
    // 获取业务list
    getBusinessName() {
      getBusiness().then((response) => {
        this.MoudalName = response.data.list;
      });
    },
    // 获取模块名
    getfunctionMoudal() {
      getfunctionMoudalList(this.params.business_name).then(
        (response) => {
          this.params.module_name = "";
          this.functionMoudal = response.data.list;
        }
      );
    },
    // 获取编辑器内容
    getContent() {
      this.params.case_content = this.$refs.veditor.getHtml(this.initContent);
    },
    // 设置编辑器内容
    setContent() {
      var that = this;
      setTimeout(function() {
        that.$refs.veditor.setHtml(that.params.case_content);
      },1000);
    },
    // 获取当前用户名
    getUsername() {
      getInfo().then((response) => {
        this.params.editor = response.data.name;
      });
    },
    //跳转用例首页
    goTablePage() {
      this.$router.push({
       path: '/example/table'
      })
    },
    //跳转用例创建页面
    goAddCasePage() {
      this.$router.push({
       path: '/form/index'
      })
    },
    getCase() {
      // 通过url获取case_id
      this.params.case_id = window.location.href.split("=")[1];
      
      if (this.params.case_id) {
        getCaseDetail(this.params.case_id).then((response) => {
          this.params.business_name = response.data.business_name;
          getfunctionMoudalList(this.params.business_name).then((response) => { this.functionMoudal = response.data.list; });
          this.params.module_name = response.data.module_name;
          this.params.case_title = response.data.case_title;
          this.params.case_content = response.data.case_content;
          this.params.editor = response.data.editor;
        });
      } else {
        this.$message({
            message: "未获取到case_id",
            type: 'error'
          });
          var that = this;
          setTimeout(function() { that.goAddCasePage(); }, 3000);
      }
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

