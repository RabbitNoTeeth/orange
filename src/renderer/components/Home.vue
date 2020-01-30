<template>
    <div>
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main>
                <Task v-for="item in tasks" :task="item"></Task>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Task from "./Task";
    import Header from "./Header";

    export default {
        name: "Home",
        components: {Header, Task},
        data() {
            return {
                tasks: []
            }
        },
        created() {
            this.$bus.$on(this.$event.RELOAD_TASK, () => this.loadTasks())
        },
        destroyed() {
            this.$bus.$off(this.$event.RELOAD_TASK)
        },
        mounted() {
            this.loadTasks()
        },
        methods: {
            loadTasks() {
                this.$db.find({}, (err, docs) => {
                    if (err) {
                        this.$message.error('任务列表加载失败: ' + err)
                    } else {
                        this.tasks = docs
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
