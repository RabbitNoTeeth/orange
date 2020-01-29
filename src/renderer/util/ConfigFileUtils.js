/**
 * 配置文件操作工具类
 */
const configFilePath = './config.json';
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

/**
 * 加载配置文件
 * @returns {string} 配置对象
 */
export function readConfig() {
    mkdirp.sync(path.dirname(configFilePath));
    let data = fs.readFileSync(configFilePath, {flag: 'a+', encoding: 'utf8'});
    if (!data && data === '') {
        data = {
            tasks: []
        };
        fs.writeFile(configFilePath, JSON.stringify(data), {flag: 'a'}, e => {});
    }
    return data;
}
