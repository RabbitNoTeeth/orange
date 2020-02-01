import ftp from 'ftp';
import fs from 'fs';
import bus from './../config/bus';
import db from './../config/datastore';
import dayjs from 'dayjs';

/**
 * 读取本地文件列表
 * @param path
 * @param localFiles
 */
function readLocalFiles(path, localFiles) {
    const fileStat = fs.statSync(path);
    if (fileStat.isFile()) {
        localFiles.push({
            flag: path,
            size: fileStat.size,
            mtimeMs: fileStat.mtimeMs
        })
    } else {
        const children = fs.readdirSync(path);
        children.forEach(child => {
            if (path.indexOf('\\') > -1) {
                readLocalFiles(path + '\\' + child, localFiles);
            } else {
                readLocalFiles(path + '/' + child, localFiles);
            }
        });
    }
}

/**
 * 比对需要同步的文件
 * @param dbFiles
 * @param localFiles
 * @param insertFiles
 * @param updateFiles
 */
function fileMatching(dbFiles, localFiles, insertFiles, updateFiles) {
    localFiles.forEach(lf => {
        const targetFile = dbFiles.find(df => df.flag === lf.flag);
        if (targetFile) {
            if (targetFile.size !== lf.size || targetFile.mtimeMs !== lf.mtimeMs) {
                lf.type = 'update';
                updateFiles.push(lf);
            }
        } else {
            lf.type = 'add';
            insertFiles.push(lf);
        }
    });
}

export default {

    /**
     * 文件同步
     * @param task
     * @param files
     * @param fireTime
     */
    sync(task, files, fireTime) {
        const insertFiles = [];
        const updateFiles = [];

        // 创建ftp连接
        const ftpClient = new ftp();
        ftpClient.on('ready', () => {
            // 读取本地文件
            const localFiles = [];
            readLocalFiles(task.ftpLocalRootPath, localFiles);
            // 对比需要同步的文件
            fileMatching(files, localFiles, insertFiles, updateFiles);
            // 上传至ftp服务器
            const uploadFiles = [...insertFiles, ...updateFiles];

            if (uploadFiles.length > 0) {
                bus.bus.$emit(bus.events.ADD_FILE_SYNC_RATE, {
                    taskId: task._id,
                    taskName: task.name,
                    completeCount: 0,
                    failedCount: 0,
                    totalCount: uploadFiles.length,
                    ftpClient: ftpClient,
                    startTime: Date.now(),
                    fireTime
                });
                uploadFiles.forEach(f => {
                    let localFilePath = f.flag;
                    let remoteFilePath = localFilePath.replace(task.ftpLocalRootPath, task.ftpRemoteRootPath)
                    if (localFilePath.indexOf('\\') > -1) {
                        localFilePath = localFilePath.replace(/\\/g, '/');
                    }
                    if (remoteFilePath.indexOf('\\') > -1) {
                        remoteFilePath = remoteFilePath.replace(/\\/g, '/');
                    }
                    const remoteDir = remoteFilePath.substring(0, remoteFilePath.lastIndexOf('/'));
                    ftpClient.mkdir(remoteDir, true, (e) => {
                        if (!e) {
                            ftpClient.put(localFilePath, remoteFilePath, (err) => {
                                if (err) {
                                    f.success = false;
                                    bus.bus.$emit(bus.events.RUNTIME_ERROR, 'ftpupload: 文件[' + localFilePath + ']上传失败, e = ' + err);
                                    bus.bus.$emit(bus.events.UPDATE_FILE_SYNC_RATE, {
                                        taskId: task._id,
                                        success: false
                                    });
                                } else {
                                    f.success = true;
                                    bus.bus.$emit(bus.events.UPDATE_FILE_SYNC_RATE, {
                                        taskId: task._id,
                                        success: true
                                    });
                                    // 更新数据库中文件同步状态
                                    if (insertFiles.find(inf => inf.flag === f.flag)) {
                                        db.file.insert({taskId: task._id, ...f}, (err, newDocs) => {});
                                    } else {
                                        const updateF = {...f};
                                        delete updateF._id;
                                        db.file.update({taskId: task._id, flag: f.flag}, { $set: { ...updateF } }, { multi: true }, (e, numReplaced) => {});
                                    }
                                }
                                // 保存历史记录
                                const history = {...f};
                                history.fireTime = fireTime;
                                history.createTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                db.history.insert({taskId: task._id, ...history}, (err, newDocs) => {});
                            });
                        } else {
                            bus.bus.$emit(bus.events.RUNTIME_ERROR, 'ftpupload: 文件夹[' + remoteDir + ']创建失败');
                        }
                    });
                });
            } else {
                db.task.update({_id: task._id}, {
                    $set: {
                        lastFireTime: fireTime,
                        lastSyncCost: 0,
                        lastSyncCount: 0
                    }
                }, (err, numReplaced) => {
                    if (err) {
                        // 抛出异常，页面进行提示
                        bus.bus.$emit(bus.events.RUNTIME_ERROR, 'CronTask: 更新任务[' + task.name + ']状态失败, e = ' + err);
                    } else {
                        // 刷新首页
                        bus.bus.$emit(bus.events.RELOAD_TASK);
                    }
                });
                ftpClient.end();
            }
        });
        ftpClient.connect({
            host: task.ftpIp,
            port: task.ftpPort,
            user: task.ftpUsername,
            password: task.ftpPassword
        });
    }

}
