<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="'/static/模板.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary" >选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },
  created() {
  },
  methods: {
    // 1 点击上传的方法
    submitUpload() {
      this.importBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit() // 通过找到ref="upload"的元素进行提交操作
    },
    // 2 上传成功后的方法
    fileUploadSuccess() {
      // 如果成功，跳转到列表
      this.importBtnDisabled = false
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程分类成功'
      })
      // 成功后跳转到分类列表
      this.$router.push({ path: '/subject/list' })
    },
    // 3 上传失败后的方法
    fileUploadError() {
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加课程分类失败'
      })
    }

  }
}
</script>

<style scoped>

</style>
