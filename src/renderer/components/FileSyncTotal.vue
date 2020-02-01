<template>
    <div>
        <el-dialog
                title="文件同步历史"
                :visible="visible"
                width="80%"
                @close="handleClose">
            <div style="height: 400px;overflow-y: auto;">
                <p v-for="(item, index) in histories">
                    <span>{{index + 1}}.</span>
                    &nbsp;&nbsp;
                    <span>{{item.flag}}</span>
                    <!--&nbsp;-->
                    <!--<span>(大小：{{item.size}}, 最后修改时间：{{dayjs(item.mtimeMs).format('YYYY-MM-DD HH:mm:ss')}})</span>-->
                </p>
            </div>
            <div slot="footer"></div>
        </el-dialog>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    export default {
        name: "FileSyncTotal",
        data() {
            return {
                visible: false,
                histories: [],
                dayjs
            }
        },
        methods: {
            show(task) {
                this.visible = true;
                this.$db.file.find({taskId: task._id}).sort({flag: -1}).exec((err, docs) => {
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
