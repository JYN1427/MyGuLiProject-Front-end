<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>

import subject from '@/api/edu/subject'
export default {
  data() {
    return {
      filterText: '',
      treeData: [],
      // prop传参数用
      defaultProps: {
        id: 'id',
        label: 'title',
        children: 'children'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getAllSubjectList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    getAllSubjectList() {
      subject.getSubjectList()
        .then(response => {
          this.treeData = response.data.subjectList
        })
    }
  }
}
</script>

