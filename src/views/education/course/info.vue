<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <!-- 1 课程标题 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 2 课程分类 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 3 课程讲师 -->
      <!--label是显示的。value是实际传的值，也就是v-model="courseInfo.teacherId" = "teacher.id"-->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <!-- 4 课程课时 -->
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 5 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 6 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss/uploadCover'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" >
        </el-upload>
      </el-form-item>

      <!-- 7 课程价格 -->
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
        >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
// 引入Tinymce富文本编辑器组件
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '',
      courseInfo:
        {
          title: '',
          subjectId: '',
          subjectParentId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
        },
      teacherList: [],
      subjectOneList: [], // 封装所以一级分类数据
      subjectTwoList: [], // 封装二级分类数据
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },
  watch: {
    // 防止数据回显
    $route(to, from) {
      // 路由变化方式，当路由发送变化，方法就执行
      console.log('watch $route')
      this.courseInfo = {}
    }
  },
  created() {
    this.initPage()
    this.getListTeacher()
    this.getSubject()
  },
  methods: {
    // 0 初始化页面，校验路由里的id值
    initPage() {
      if (this.$route.params && this.$route.params.id) {
        // url携带id值 说明是修改页面信息
        this.courseId = this.$route.params.id
        this.getCourseInfo() // 如果是修改而不是新建，那拿到courseId后将调用次方法 根据ID获取课程信息
      }
    },
    // 1 判断是存新的、还是更新旧的。 接口传courseInfo
    saveOrUpdate() {
      // 判断courseInfo中是否有id值，因为正常情况下新建是没有id值的
      if (this.courseInfo.id) {
        // 有id值，为修改
        this.updateOldCourse()
      } else {
        // 没id值，为添加
        this.saveNewCourse()
      }
    },
    // 1.1 存新的
    saveNewCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            message: '添加课程信息成功',
            type: 'success'
          })
          this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        })
    },
    // 1.2 修改旧的
    updateOldCourse() {
      course.updateCourseInfo(this.courseInfo).then((resp) => {
        this.$message({
          message: '修改课程信息成功',
          type: 'success'
        })
        // 跳转到第二步,并带着这个课程生成的id
        this.$router.push({ path: '/course/chapter/' + this.courseId })
      })
    },
    // 2 获取讲师列表
    getListTeacher() {
      course.getTeacherList().then((response) => {
        this.teacherList = response.data.items
      })
    },
    // 3 获取课程分类类别列表
    getSubject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.subjectList
        })
    },
    // 4 点击某个一级分类，触发change事件，显示对应的二级分类
    subjectLevelOneChanged(value) {
      // value是@change自动填充的，在这里是一级分类的id
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 5 上传封面成功调用的方法
    handleAvatarSuccess(resp, file) {
      this.courseInfo.cover = resp.data.url
    },
    // 6 上传之前要调用的方法
    beforeAvatarUpload(file) {
      // **也就是对所上传文件进行约束**
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      console.log(isJPG && isLt2M)
      return isJPG && isLt2M
    },
    // 7 如果是修改而不是新建，那拿到courseId后将调用次方法 根据ID获取课程信息
    getCourseInfo() {
      course.getCourseInfo(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfo
          // 查询所有分类，包含一级和二级所有
          subject.getSubjectList().then((resp) => {
            // 获取所有一级分类
            this.subjectOneList = resp.data.subjectList

            // 把所有一级分类数组进行遍历
            for (var i = 0; i < this.subjectOneList.length; i++) {
              // 获取每个一级分类
              var oneSubject = this.subjectOneList[i]
              // 比较当前courseInfo里面的一级分类id和所有的一级分类id是否一样
              if (this.courseInfo.subjectParentId == oneSubject.id) {
                // 获取一级分类中所有的二级分类
                this.subjectTwoList = oneSubject.children
              }
            }
          })
        })
    }
  }
}
</script>

<!-- scoped表示只有当前页面可用 -->
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>

