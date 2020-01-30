import Vue from 'vue';

const bus = new Vue();
const events = {
    RELOAD_TASK: 'reload_task'
};

export default {
    bus,
    events
};
