import {readConfig} from './../../util/ConfigFileUtils'

const tasks = readConfig();
const taskMap = new Map();
tasks.forEach(item => {
    // todo 初始化定时任务
    taskMap.set(item.id, item);
});

const state = {
    main: taskMap
}

const mutations = {
    // 新增任务
    add(state, task) {
        state.main.set(task.id, task)
        // todo 新增定时任务
        // todo 更新本地配置文件
    },
    // 更新任务
    update(state, task) {
        state.main.set(task.id, task)
        // todo 更新定时任务
        // todo 更新本地配置文件
    },
    // 删除任务
    remove(state, task) {
        state.main.delete(task.id)
        // todo 删除定时任务
        // todo 更新本地配置文件
    }
}

const actions = {
    // 新增任务
    add(context, task) {
        return new Promise((resolve, reject) => {
            try {
                context.commit('add', task)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    },
    // 更新任务
    update(context, task) {
        return new Promise((resolve, reject) => {
            try {
                context.commit('update', task)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    },
    // 删除任务
    remove(context, task) {
        return new Promise((resolve, reject) => {
            try {
                context.commit('remove', task)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    }
}

export default {
    state,
    mutations,
    actions
}
