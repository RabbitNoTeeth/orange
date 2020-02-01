import {CronJob, CronTime} from 'cron';
import db from './../config/datastore';
import dayjs from 'dayjs';
import protocols from './../protocol/index';

class CronTask {

    constructor(task) {
        const self = this;
        self.task = task;
        self.cronJob = new CronJob(task.cron,
            function () {
                // 起始时间
                const startTime = Date.now();
                // 根据协议动态执行
                db.file.find({taskId: self.task._id}, (e1, files) => {
                    if (!e1) {
                        protocols[self.task.protocol + self.task.direction].sync(self.task, files, self.lastFireTime());
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
