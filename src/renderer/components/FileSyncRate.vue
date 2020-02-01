<template>
    <div>
        <el-dialog
                title="文件同步进度"
                :visible="visible"
                width="50%"
                :show-close="false">
            <div v-for="task in tasks" style="margin-bottom: 30px">
                <h4>
                    {{task.taskName}}&nbsp;&nbsp;(&nbsp;
                    <span style="color: green">成功：{{task.completeCount}}</span>
                    &nbsp;
                    <span style="color: red">失败：{{task.failedCount}}</span>
                    &nbsp;
                    <span>总计：{{task.totalCount}}</span>&nbsp;)
                </h4>
                <el-progress :text-inside="true" :stroke-width="24" :percentage="((task.completeCount + task.failedCount) / task.totalCount) * 100" status="success"></el-progress>
            </div>
            <div slot="footer"></div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "FileUploadRate",
        data() {
            return {
                tasks: []
            }
        },
        created() {
            this.$bus.$on(this.$event.ADD_FILE_SYNC_RATE, data => this.tasks.push(data));
            this.$bus.$on(this.$event.UPDATE_FILE_SYNC_RATE, data => this.handleFileSyncRateUpdate(data));
        },
        destroyed() {
            this.$bus.$off(this.$event.ADD_FILE_SYNC_RATE);
            this.$bus.$off(this.$event.UPDATE_FILE_SYNC_RATE);
        },
        computed: {
            visible() {
                return this.tasks.filter(t => (t.completeCount + t.failedCount) < t.totalCount).length !== 0;
            }
        },
        methods: {
            handleFileSyncRateUpdate({taskId, success}) {
                const task = this.tasks.find(t => t.taskId === taskId);
                if (task) {
                    if (success) {
                        task.completeCount++;
                    } else {
                        task.failedCount++;
                    }
                    // 同步任务执行完毕，进行善后处理，哈哈
                    if ((task.completeCount + task.failedCount) === task.totalCount) {
                        this.tasks = this.tasks.filter(t => t.taskId !== taskId);
                        // 断开ftp连接
                        task.ftpClient.end();
                        // 计算耗时
                        const costTime = Date.now() - task.startTime;
                        this.$db.task.update({_id: taskId}, {
                            $set: {
                                lastFireTime: task.fireTime,
                                lastSyncCost: costTime,
                                lastSyncCount: task.completeCount
                            }
                        }, (err, numReplaced) => {
                            if (err) {
                                // 抛出异常，页面进行提示
                                this.$bus.$emit(this.$event.RUNTIME_ERROR, 'CronTask: 更新任务[' + task.taskName + ']状态失败, e = ' + err);
                            } else {
                                // 刷新首页
                                this.$bus.$emit(this.$event.RELOAD_TASK);
                            }
                        });
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
