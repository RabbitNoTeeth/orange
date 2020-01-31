import Vue from 'vue';

const bus = new Vue();
const events = {
    RELOAD_TASK: 'reload_task',
    RUNTIME_ERROR: 'runtime_error'
};

export default {
    bus,
    events
};
