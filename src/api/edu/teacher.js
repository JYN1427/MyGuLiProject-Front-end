import request from '@/utils/request'

export default {
  // 1 获取讲师列表 (条件查询 对应后端的pageListTeacherCondition)。不仅url传两个Page相关的参数，请求体还要包含筛选条件teacherQuery
  getTeacherList(current, limit, teacherQuery) {
    return request({
      url: '/eduservice/teacher/pageTeacherCondition/' + current + '/' + limit,
      method: 'post',
      // data就表示将对象转换成Json进行接口传递
      data: teacherQuery
    })
  },
  // 2 删除信息
  deleteTeacherById(id) {
    return request({
      url: `/eduservice/teacher/delete/${id}`,
      method: 'delete'
    })
  },
  // 3 添加
  addTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  // 4 根据id获取某一个讲师的信息
  getTeacherInfo(id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  // 5 更新讲师信息
  updateTeacherInfo(teacherInfo) {
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: 'post',
      data: teacherInfo
    })
  }
}
