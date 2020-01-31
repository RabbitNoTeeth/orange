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
                    <el-form-item label="Cron" prop="cron">
                        <el-input v-model="formData.cron"></el-input>
                    </el-form-item>
                    <el-form-item label="同步方式" prop="direction">
                        <el-select v-model="formData.direction" placeholder="请选择同步方式" style="width: 100%">
                            <el-option label="上传" value="upload"></el-option>
                            <el-option label="下载" value="download"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="协议类型" prop="protocol">
                        <el-select v-model="formData.protocol" placeholder="请选择协议" style="width: 100%">
                            <el-option label="ftp" value="ftp"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="本地根目录" prop="ftpLocalRootPath">
                        <el-input v-model="formData.ftpLocalRootPath"></el-input>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="远程根目录" prop="ftpRemoteRootPath">
                        <el-input v-model="formData.ftpRemoteRootPath"></el-input>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="Ip" prop="ftpIp">
                        <el-input v-model="formData.ftpIp"></el-input>
                    </el-form-item>
                    <el-form-item v-if="formData.protocol === 'ftp'" label="端口" prop="ftpPort">
                        <el-input v-model="formData.ftpPort"></el-input>
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
                    cron: [
                        {required: true, message: '请输入任务周期', trigger: 'blur'}
                    ],
                    protocol: [
                        {required: true, message: '请选择任务协议', trigger: 'change'}
                    ],
                    direction: [
                        {required: true, message: '请选择同步方式', trigger: 'change'}
                    ],
                    ftpLocalRootPath: [
                        {required: true, message: '请输入本地根目录', trigger: 'blur'}
                    ],
                    ftpRemoteRootPath: [
                        {required: true, message: '请输入远程根目录', trigger: 'blur'}
                    ],
                    ftpIp: [
                        {required: true, message: '请输入ftp ip', trigger: 'blur'}
                    ],
                    ftpPort: [
                        {required: true, message: '请输入ftp端口', trigger: 'blur'}
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
                        const now = Date.now();
                        const nowTime = app.$dayjs(now).format('YYYY-MM-DD HH:mm:ss');
                        if (app.mode === 'add') {
                            app.$db.task.insert({
                                ...app.formData,
                                createTime: nowTime,
                                updateTime: nowTime,
                                lastFireTime: null,
                                lastSyncCount: null,
                                lastSyncCost: null
                            }, (e, data) => {
                                if (e) {
                                    app.$message.error('任务创建失败: ' + e);
                                } else {
                                    app.$message.success('任务[' + data._id + ']创建成功');
                                    app.$cronTaskPool.put(data);
                                    app.$bus.$emit(app.$event.RELOAD_TASK);
                                    app.visible = false;
                                }
                            })
                        } else {
                            app.$db.task.update({ _id: app.formData._id }, { $set: {
                                    updateTime: nowTime,
                                    name: app.formData.name,
                                    cron: app.formData.cron,
                                    protocol: app.formData.protocol,
                                    direction: app.formData.direction,
                                    ftpLocalRootPath: app.formData.ftpLocalRootPath,
                                    ftpRemoteRootPath: app.formData.ftpRemoteRootPath,
                                    ftpIp: app.formData.ftpIp,
                                    ftpPort: app.formData.ftpPort,
                                    ftpUsername: app.formData.ftpUsername,
                                    ftpPassword: app.formData.ftpPassword
                                } }, (e, numReplaced) => {
                                if (e) {
                                    app.$message.error('任务更新失败: ' + e);
                                } else {
                                    app.$message.success('任务[' + app.formData._id + ']更新成功');
                                    app.$cronTaskPool.update(app.formData);
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
