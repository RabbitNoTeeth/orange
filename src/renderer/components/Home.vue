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

        <file-sync-rate></file-sync-rate>
    </div>
</template>

<script>
    import Task from "./Task";
    import Header from "./Header";
    import FileSyncRate from "./FileSyncRate";

    export default {
        name: "Home",
        components: {FileSyncRate, Header, Task},
        data() {
            return {
                tasks: []
            }
        },
        created() {
            this.$bus.$on(this.$event.RELOAD_TASK, () => this.loadTasks());
            this.$bus.$on(this.$event.RUNTIME_ERROR, (err) => {
                this.$notify.error({
                    title: '错误',
                    message: err,
                    duration: 0
                });
            });
        },
        destroyed() {
            this.$bus.$off(this.$event.RELOAD_TASK);
            this.$bus.$off(this.$event.RUNTIME_ERROR);
        },
        mounted() {
            this.loadTasks()
        },
        methods: {
            loadTasks() {
                this.$db.task.find({}).sort({createTime: -1}).exec((err, docs) => {
                    if (err) {
                        this.$message.error('任务列表加载失败: ' + err)
                    } else {
                        docs.forEach(t => {
                            if (!this.$cronTaskPool.has(t)) {
                                this.$cronTaskPool.put(t);
                            }
                            const cronTask = this.$cronTaskPool.get(t);
                            t.nextFireTime = cronTask.nextFireTime();
                            this.$db.file.find({taskId: t._id}, (e, files) => {
                                if (e) {
                                    this.$message.error('查询任务文件数失败：' + err)
                                } else {
                                    t.totalSyncCount = files.length;
                                }
                            });
                        });
                        this.tasks = docs
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
