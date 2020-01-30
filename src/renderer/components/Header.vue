<template>
    <div style="border-bottom: 1px solid; padding-top: 15px;padding-bottom: 15px">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAddBtnClick">新建任务</el-button>
        <task-form ref="taskFormRef"></task-form>
    </div>
</template>

<script>
    import TaskForm from "./TaskForm";
    export default {
        name: "Header",
        components: {TaskForm},
        methods: {
            /**
             * "新建任务"按钮点击事件
             */
            handleAddBtnClick() {
                this.$refs.taskFormRef.show(null);
            }
        }
    }
</script>

<style scoped>

</style>
