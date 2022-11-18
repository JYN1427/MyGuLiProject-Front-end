<template>
  <div class="app-container">
    讲师表单
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacherFormData.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacherFormData.sort" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherFormData.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacherFormData.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacherFormData.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="String(teacherFormData.avatar)"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调
          <input type="file" name="file"/>
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/uploadAvatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacherFormData: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      saveBtnDisabled: false, // 提交后按钮是否禁用
      imagecropperShow: false, // 上传弹框组件是否显示
      imagecropperKey: 0, // 上传组件key值
      BASE_API: process.env.BASE_API
    }
  },
  watch: { // 监听
    $route(to, from) { // 路由变化方式，路由发生变化，方法就会执行
      this.init()
    }
  },
  created() {
    this.init() // 初始化teacherFormData里的值(因为添加和修改功能复用)
  },
  methods: {
    saveTeacher() {
      teacher.addTeacher(this.teacherFormData)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 回到列表页面 路由跳转
          this.$router.push({ path: '/teacher/table' })
        })
    },
    getInfo(id) {
      teacher.getTeacherInfo(id)
        .then(response => {
          this.teacherFormData = response.data.teacher // 赋值给teacherFormData
        })
    },
    updateTeacher() {
      teacher.updateTeacherInfo(this.teacherFormData)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 回到列表页面 路由跳转
          this.$router.push({ path: '/teacher/table' })
        })
    },
    saveOrUpdate() {
      // 判断修改还是添加
      // 根据teacher是否有id
      if (!this.teacherFormData.id) {
        // 添加
        this.saveTeacher()
      } else {
        // 修改
        this.updateTeacher()
      }
    },
    init() {
      // this.teacherFormData = {}
      // 判断路径有id值,做修改
      if (this.$route.params && this.$route.params.id) {
        // 从路径获取id值
        const id = this.$route.params.id
        // 调用根据id查询的方法
        this.getInfo(id)
      } else { // 路径没有id值，做添加
        // 清空表单
        this.teacherFormData = {}
      }
    },
    // 关闭弹窗的方法
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1 // 上传组件初始化
    },

    // 上传成功的方法
    cropSuccess(inputData) {
      // console.log(inputData)
      this.imagecropperShow = false
      // 上传之后接口返回图片地址
      this.teacherFormData.avatar = inputData.url
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>

<style scoped>

</style>
