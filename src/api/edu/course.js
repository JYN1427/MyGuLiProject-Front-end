import request from '@/utils/request'
export default{
  // 1 添加课程信息功能
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/addCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  // 2 获取所有讲师功能
  getTeacherList(courseInfo) {
    return request({
      url: '/eduservice/teacher/findAll',
      method: 'get'
    })
  },
  // 3 根据课程ID获取课程信息
  getCourseInfo(courseId) {
    return request({
      url: '/eduservice/course/getCourseInfo/' + courseId,
      method: 'get'
    })
  },
  // 4 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  // 5 获取课程列表
  getCoursePageList(page, limit, courseQuery) {
    return request({
      url: `/eduservice/course/getCoursePageList/${page}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  }
}
