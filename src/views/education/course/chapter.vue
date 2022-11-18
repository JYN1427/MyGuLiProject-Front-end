<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <!-- 1 添加章节按钮 -->
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 2 显示章节和小节的信息(如果是已经创建过) -->
    <ul class="chapterList">
      <!-- 2.1 章节 -->
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span>
            <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 2.2 小节 -->
        <ul v-if="chapter.children.length > 0" class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button style="" type="text">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 3 上一步 下一步 -->
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 4 表单 -->
    <!-- 4.1 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 4.2 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data() {
    return {
      saveBtnDisabled: false,
      saveVideoBtnDisabled: false,

      courseId: '', // 课程id
      chapterVideoList: [],

      // 封装章节、小节数据
      chapter: {
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: ''
      },
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false // 小节弹框
    }
  },
  created() {
    // 校验路由里的id值
    this.initPage()
    // 根据课程id查询对应的课程章节和小结
    this.getChapter()
  },
  methods: {
    // 1 初始化页面，校验路由里的id值
    initPage() {
      if (this.$route.params && this.$route.params.id) {
        // url携带id值 说明是修改页面信息
        this.courseId = this.$route.params.id
      }
    },
    // 2 跳转到上一步
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    // 3 跳转到下一步
    next() {
      // 3 跳转到第三步
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },
    // 4 根据课程ID获取课程下的章节信息
    getChapter() {
      chapter.getChapterVideoByCourseId(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.chapterList
        })
    },
    // ==============================小节操作====================================
    // 1 删除小节
    removeVideo(id) {
      this.$confirm('此操作将删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定，执行then方法
        // 调用删除的方法
        video.deleteVideo(id)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除小节成功!'
            })
            // 刷新页面
            this.getChapter()
          })
      }) // 点击取消，执行catch方法
    },
    // 添加小节弹框的方法
    openVideo(chapterId) {
      // 清空之前的数据
      this.video = {}
      // 弹框
      this.dialogVideoFormVisible = true
      // 设置章节id
      this.video.chapterId = chapterId
    },
    // 添加小节
    addVideo() {
      // 设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '添加小节成功!'
          })
          // 刷新页面
          this.getChapter()
        })
    },
    saveOrUpdateVideo() {
      this.addVideo()
    },

    // ============================== 章节操作 ====================================
    // 1 弹出添加章节页面
    openChapterDialog() {
      // 弹框
      this.dialogChapterFormVisible = true
      // 表单数据清空
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    // 2 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定，执行then方法
        // 调用删除的方法
        chapter.deleteChapter(chapterId)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新页面
            this.getChapter()
          })
      }) // 点击取消，执行catch方法
    },
    // 3 修改章节弹框数据回显
    openEditChatper(chapterId) {
      // 弹框
      this.dialogChapterFormVisible = true
      // 调用接口
      chapter.getChapterById(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    },
    // 4 添加章节
    addChapter() {
      // 设置课程id到chapter对象里面
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '添加章节成功!'
          })
          // 刷新页面
          this.getChapter()
        })
    },
    // 5 修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '修改章节成功!'
          })
          // 刷新页面
          this.getChapter()
        })
    },
    // 6 添加或修改 总
    saveOrUpdateChapter() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    }
  }
}
</script>

<style scoped>
.chanpterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
