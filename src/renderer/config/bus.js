import Vue from 'vue';

const bus = new Vue();
const events = {
    CONFIG_CHANGE: 'config_change'
};

export default {
    bus,
    events
};
