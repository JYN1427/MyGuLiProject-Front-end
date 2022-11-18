import request from '@/utils/request'

export default{
  // 1 根据课程id获取章节和小节数据列表
  getChapterVideoByCourseId(courseId) {
    return request({
      url: `/eduservice/chapter/getChapterAndVideo/${courseId}`,
      method: 'get'
    })
  },
  // 2 添加章节
  addChapter(chapter) {
    return request({
      url: `/eduservice/chapter/addChapter`,
      method: `post`,
      data: chapter
    })
  },
  // 3 根据id查询章节
  getChapterById(chapterID) {
    return request({
      url: `/eduservice/chapter/getChapter/${chapterID}`,
      method: `get`
    })
  },
  // 4 修改章节
  updateChapter(chapter) {
    return request({
      url: `/eduservice/chapter/updateChapter`,
      method: `post`,
      data: chapter
    })
  },
  // 5 删除章节
  deleteChapter(chapterID) {
    return request({
      url: `/eduservice/chapter/deleteById/${chapterID}`,
      method: `delete`
    })
  }
}