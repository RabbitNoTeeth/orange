import Vue from 'vue';

const bus = new Vue();
const events = {
    RELOAD_TASK: 'reload_task',
    RUNTIME_ERROR: 'runtime_error',
    ADD_FILE_SYNC_RATE: 'add_file_sync_rate',
    UPDATE_FILE_SYNC_RATE: 'update_file_sync_rate',
};

export default {
    bus,
    events
};
