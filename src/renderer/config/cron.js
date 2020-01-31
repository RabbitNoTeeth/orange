import CronTask from './../model/CronTask';

class CronTaskPool {

    constructor() {
        this.taskMap = new Map();
    }

    get(task) {
        return this.taskMap.get(task._id);
    }

    put(task) {
        const taskMap = this.taskMap;
        const key = task._id;
        const cronTask = new CronTask(task);
        if (taskMap.has(key)) {
            taskMap.get(key).stop();
        }
        taskMap.set(key, cronTask);
        cronTask.start();
    }

    update(task) {
        const taskMap = this.taskMap;
        const key = task._id;
        if (taskMap.has(key)) {
            const cronTask = taskMap.get(key);
            cronTask.stop();
            cronTask.setTime(task.cron);
            cronTask.start();
        }
    }

    remove(task) {
        const taskMap = this.taskMap;
        const key = task._id;
        if (taskMap.has(key)) {
            taskMap.get(key).stop();
        }
        taskMap.delete(key);
    }

    has(task) {
        return this.taskMap.has(task._id);
    }

}

export default new CronTaskPool();
