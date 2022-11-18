import request from '@/utils/request'
export default {
  // 课程确认信息显示
  getPublishCourseInfo(courseId) {
    return request({
      url: '/eduservice/course/getPublishCourseTotalInfo/' + courseId,
      method: 'get'
    })
  },
  // 最终发布
  publishCourse(courseId) {
    return request({
      url: '/eduservice/course/publishCourse/' + courseId,
      method: 'post'
    })
  }
}
