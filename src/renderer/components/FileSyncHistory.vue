<template>
    <div>
        <el-dialog
                title="文件同步历史"
                :visible="visible"
                width="80%"
                @close="handleClose">
            <div style="height: 400px;overflow-y: auto">
                <p v-for="(item, index) in histories">
                    <span>{{index + 1}}.</span>
                    &nbsp;&nbsp;
                    <span v-if="item.success" style="color: green">[<i class="el-icon-check"></i>]</span>
                    <span v-else style="color: red">[<i class="el-icon-close"></i>]</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span v-if="item.type === 'add'" style="color: green">{{item.flag}}</span>
                    <span v-if="item.type === 'update'" style="color: dodgerblue">{{item.flag}}</span>
                </p>
            </div>
            <div slot="footer"></div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "FileSyncHistory",
        data() {
            return {
                visible: false,
                histories: []
            }
        },
        methods: {
            show(task) {
                this.visible = true;
                this.$db.history.find({taskId: task._id, fireTime: task.lastFireTime}).sort({createTime: -1}).exec((err, docs) => {
                   if (err) {
                       this.$message.error('查询文件同步历史失败：' + err)
                   } else {
                       this.histories = docs
                   }
                });
            },
            handleClose() {
                this.histories = [];
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>
