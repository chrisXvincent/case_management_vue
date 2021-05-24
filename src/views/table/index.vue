<template>
  <div class="app-container">
    <el-row>
      <el-button type="success">创建任务</el-button>
      <el-button type="info" @click="create">新建用例</el-button>
      <el-button type="warning">用例评审</el-button>
    </el-row>
    <div style="height: 10px"></div>

    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="用例ID">
        <el-input
          placeholder="请输入内容"
          v-model="params.query.case_id"
        ></el-input>
      </el-form-item>
      <el-form-item label="用例名称" label-width="120px">
        <el-input
          placeholder="请输入内容"
          v-model="params.query.case_title"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务名称" label-width="120px">
        <el-select
          placeholder="请选择"
          v-model="params.query.business_name"
          clearable
          @change="getfunctionMoudal"
        >
          <el-option
            v-for="(item, index) in MoudalName"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能模块" label-width="100px">
        <el-select placeholder="请选择" v-model="params.query.module_name" clearable>
          <el-option
            v-for="(item, index) in functionMoudal"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            v-model="params.query.edit_stime"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            v-model="params.query.edit_etime"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="创建人" label-width="185px">
        <el-input
          placeholder="请输入内容"
          v-model="params.query.editor"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div style="height: 10px"></div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="用例ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.case_id }}
        </template>
      </el-table-column>
      <el-table-column label="用例名称" width="380px">
        <template slot-scope="scope">
          {{ scope.row.case_title }}
        </template>
      </el-table-column>
      <el-table-column label="业务名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.business_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能模块" align="center">
        <template slot-scope="scope">
          {{ scope.row.module_name }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="最后更新时间"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.edit_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="创建/更新人"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.editor }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.case_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="check(scope.row.case_id)"
            >删除</el-button
          >
          <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  >
  <span>确认是否删除此用例？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteCase()">确 定</el-button>
  </span>
</el-dialog>
        </template>
      </el-table-column>
    </el-table>



 <div class="block" style="float:right">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=1
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>
  </div>
  </div>
</template>

<script>
import { getBusiness, getTable, getfunctionMoudalList ,deleteCase} from "@/api/table";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      total:0,
      listLoading: true,
      task_id: "",
      dialogVisible:false,
      MoudalName: [],
      functionMoudal: [],
      case_id:"",
      params: {
        page: 1,
        per_page: 10,
        query: {
          case_id: "",
          case_title: "",
          business_name: "",
          module_name: "",
          editor: "",
          edit_stime: "",
          edit_etime: "",
        },
      },
    };
  },
  mounted() {
    this.fetchData();
    this.getBusinessName();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getTable(this.params).then((response) => {
        this.list = response.data.list;
        this.listLoading = false;
        this.total = response.data.total
      });

      // getList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    },
    onSubmit() {
      this.listLoading = true;
      // console.log(this.params);
      this.params.page = 1;
      getTable(this.params).then((response) => {
        this.list = response.data.list;
        this.listLoading = false;
        this.total = response.data.total
      });
    },
    getBusinessName() {
      getBusiness().then((response) => {
        this.MoudalName = response.data.list;
      });
    },
    getfunctionMoudal() {
      getfunctionMoudalList(this.params.query.business_name).then(
        (response) => {
          this.params.query.module_name = ""
          this.functionMoudal = response.data.list;
        }
      );
    },
    deleteCase(e){
      this.dialogVisible = false
      deleteCase(this.case_id).then((response) => {
        this.fetchData()
      })
    },
    check(a){
      this.dialogVisible = true
      this.case_id = a
    },
    handleEdit(id){
      this.$router.push({
        path:'/update/index?case_id='+id
      })
    },
    create(){
      this.$router.push({
        path:'/form/index'
      })
    },
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.params.per_page = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.params.page = val
        this.fetchData()
      }
  }
  }
</script>