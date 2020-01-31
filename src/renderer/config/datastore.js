import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const task = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/orange_data_task.db')
});

const file = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/orange_data_file.db')
});

export default {
    task,
    file
}
