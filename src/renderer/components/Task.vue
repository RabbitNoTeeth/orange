<template>
    <div style="margin-bottom: 15px;margin-right: 15px;width: 307px;float: left">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-weight: bold;font-size: 20px">{{task.name}}</span>
                <div style="float: right;">
                    <el-button style="color: green" type="text" icon="el-icon-position" size="mini" @click="handleFireBtnClick"></el-button>
                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEditBtnClick"></el-button>
                    <el-button style="color: red" type="text" icon="el-icon-delete" size="mini" @click="handleDelBtnClick"></el-button>
                </div>
            </div>
            <div class="text item">
                <span>创建时间：</span>
                <span>{{task.createTime}}</span>
            </div>
            <!--<div class="text item">-->
                <!--<span>修改时间：</span>-->
                <!--<span>{{task.updateTime}}</span>-->
            <!--</div>-->
            <div class="text item">
                <span>Cron：</span>
                <span>{{task.cron}}</span>
            </div>
            <div class="text item">
                <span>同步方式：</span>
                <span v-if="task.direction === 'upload'">上传</span>
                <span v-if="task.direction === 'download'">下载</span>
            </div>
            <div class="text item">
                <span>协议类型：</span>
                <span>{{task.protocol}}</span>
            </div>
            <div v-if="task.protocol === 'ftp'" class="text item">
                <span>本地根目录：</span>
                <span>{{task.ftpLocalRootPath}}</span>
            </div>
            <div v-if="task.protocol === 'ftp'" class="text item">
                <span>远程根目录：</span>
                <span>{{task.ftpRemoteRootPath}}</span>
            </div>
            <div v-if="task.protocol === 'ftp'" class="text item">
                <span>Ip：</span>
                <span>{{task.ftpIp}}</span>
            </div>
            <div v-if="task.protocol === 'ftp'" class="text item">
                <span>端口：</span>
                <span>{{task.ftpPort}}</span>
            </div>
            <div class="text item">
                <span>同步文件总数：</span>
                <span>{{task.totalSyncCount}}</span>
            </div>
            <div class="text item">
                <span>上次执行时间：</span>
                <span>{{task.lastFireTime}}</span>
            </div>
            <div class="text item">
                <span>上次执行耗时：</span>
                <span>{{task.lastSyncCost}} ms</span>
            </div>
            <div class="text item">
                <span>上次同步文件数：</span>
                <span>{{task.lastSyncCount}}</span>
            </div>
            <div class="text item">
                <span>下次执行时间：</span>
                <span>{{task.nextFireTime}}</span>
            </div>
        </el-card>
        <task-form ref="taskFormRef"></task-form>
    </div>
</template>

<script>
    import TaskForm from "./TaskForm";
    export default {
        name: "Task",
        components: {TaskForm},
        props: {
            task: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        methods: {
            handleFireBtnClick() {
                this.$confirm('手动执行该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$cronTaskPool.get(this.task).fire();
                }).catch(() => {
                    // do nothing
                });
            },
            handleEditBtnClick() {
                this.$refs.taskFormRef.show(this.task);
            },
            handleDelBtnClick() {
                this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$db.task.remove({ _id: this.task._id }, {}, (err, numRemoved) => {
                        if (err) {
                            this.$message.error('任务[' + this.task._id + ']删除失败: ' + err);
                        } else {
                            this.$message.success('任务[' + this.task._id + ']删除成功');
                            this.$cronTaskPool.remove(this.task);
                            this.$bus.$emit(this.$event.RELOAD_TASK);
                        }
                    });
                }).catch(() => {
                    // do nothing
                });
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
    }
</style>
