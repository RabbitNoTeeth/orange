<template>
    <div>
        <el-dialog
                :title="title"
                :visible="visible"
                width="50%"
                @close="handleClose">
            <div>
                <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" size="mini">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="周期" prop="interval">
                        <el-input v-model="formData.interval"></el-input>
                    </el-form-item>
                    <el-form-item label="协议" prop="protocol">
                        <el-select v-model="formData.protocol" placeholder="请选择协议" style="width: 100%">
                            <el-option label="ftp" value="ftp"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="ftp地址" prop="ftpUrl">
                        <el-input v-model="formData.ftpUrl"></el-input>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="ftp用户名" prop="ftpUsername">
                        <el-input v-model="formData.ftpUsername"></el-input>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="ftp密码" prop="ftpPassword">
                        <el-input v-model="formData.ftpPassword"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="mini">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TaskForm",
        data() {
            return {
                formData: {},
                mode: 'add',
                visible: false,
                formRules: {
                    name: [
                        {required: true, message: '请输入任务名称', trigger: 'blur'}
                    ],
                    interval: [
                        {required: true, message: '请输入任务周期', trigger: 'blur'}
                    ],
                    protocol: [
                        {required: true, message: '请选择任务协议', trigger: 'change'}
                    ],
                    ftpUrl: [
                        {required: true, message: '请输入ftp地址', trigger: 'blur'}
                    ],
                    ftpUsername: [
                        {required: true, message: '请输入ftp用户名', trigger: 'blur'}
                    ],
                    ftpPassword: [
                        {required: true, message: '请输入ftp密码', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            title() {
                return this.mode === 'add' ? '新增任务' : '编辑任务';
            }
        },
        methods: {
            show(task) {
                this.mode = task ? 'edit' : 'add';
                this.formData = task ? {...task} : {};
                this.visible = true;
            },
            handleClose() {
                this.formData = {};
                this.visible = false;
            },
            handleSubmit() {
                const app = this;
                app.$refs['formRef'].validate((valid) => {
                    if (valid) {
                        if (app.mode === 'add') {
                            app.$db.insert({
                                ...app.formData,
                                lastSyncTime: null,
                                lastSyncCount: null,
                                totalSyncCount: 0
                            }, (e, data) => {
                                if (e) {
                                    app.$message.error('任务创建失败: ' + e);
                                } else {
                                    app.$message.success('任务[' + data._id + ']创建成功');
                                    app.$bus.$emit(app.$event.RELOAD_TASK);
                                    app.visible = false;
                                }
                            })
                        } else {
                            app.$db.update({ _id: app.formData._id }, { $set: {
                                    name: app.formData.name,
                                    interval: app.formData.interval,
                                    protocol: app.formData.protocol,
                                    ftpUrl: app.formData.ftpUrl,
                                    ftpUsername: app.formData.ftpUsername,
                                    ftpPassword: app.formData.ftpPassword
                                } }, (e, numReplaced) => {
                                if (e) {
                                    app.$message.error('任务更新失败: ' + e);
                                } else {
                                    app.$message.success('任务[' + app.formData._id + ']更新成功');
                                    app.$bus.$emit(app.$event.RELOAD_TASK);
                                    app.visible = false;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });

            }
        }
    }
</script>

<style scoped>

</style>
