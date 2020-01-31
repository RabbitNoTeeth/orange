import {CronJob, CronTime} from 'cron';
import db from './../config/datastore';
import dayjs from 'dayjs';
import bus from './../config/bus';
import protocols from './../protocol/index';

class CronTask {

    constructor(task) {
        const self = this;
        self.task = task;
        self.cronJob = new CronJob(task.cron,
            function () {
                // 起始时间
                console.log('任务[' + self.task.name + ']开始执行');
                const startTime = Date.now();
                // 根据协议动态执行
                db.file.find({taskId: self.task._id}, (e1, files) => {
                    if (!e1) {
                        const {syncFileCount, insertFiles, updateFiles} = protocols[self.task.protocol + self.task.direction].sync(self.task, files);
                        // 保存新增的文件信息
                        insertFiles.forEach(f => {
                            db.file.insert({taskId: self.task._id, ...f}, (err, newDocs) => {});
                        });
                        // 更新变更的文件信息
                        updateFiles.forEach(f => {
                            const updateF = {...f};
                            delete updateF._id;
                            db.file.update({taskId: self.task._id, flag: f.flag}, { $set: { ...updateF } }, { multi: true }, (e, numReplaced) => {});
                        });
                        // 计算耗时
                        const endTime = Date.now();
                        const costTime = endTime - startTime;
                        // 更新任务信息
                        const lastFirTime = self.lastFireTime();
                        db.task.update({_id: self.task._id}, {
                            $set: {
                                lastFireTime: lastFirTime,
                                lastSyncCost: costTime,
                                lastSyncCount: syncFileCount
                            }
                        }, function (err, numReplaced) {
                            if (err) {
                                // 抛出异常，页面进行提示
                                bus.bus.$emit(bus.events.RUNTIME_ERROR, 'CronTask: 更新任务[' + self.task.name + ']状态失败, e = ' + err);
                            } else {
                                // 刷新首页
                                bus.bus.$emit(bus.events.RELOAD_TASK);
                            }
                            console.log('任务[' + self.task.name + ']执行完毕');
                        });
                    }
                });
            },
            null, false, 'Asia/Shanghai')
    }

    setTime(cron) {
        this.cronJob.setTime(new CronTime(cron));
    }

    lastFireTime() {
        return dayjs(this.cronJob.lastDate()).format('YYYY-MM-DD HH:mm:ss');
    }

    nextFireTime() {
        return dayjs(this.cronJob.nextDate()).format('YYYY-MM-DD HH:mm:ss');
    }

    start() {
        this.cronJob.start();
    }

    fire() {
        this.cronJob.fireOnTick();
    }

    stop() {
        this.cronJob.stop();
    }

}

export default CronTask;
