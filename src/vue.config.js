/*
 * @Descripttion:
 * @Author: yuyi
 * @Date: 2020-11-28 21:15:35
 * @LastEditors: yuyi
 * @LastEditTime: 2020-11-28 21:16:01
 */
let path = require('path');

function resolve (dir) {
    path.join(__dirname, dir);
}

module.exports = {
    configureWebpack: {
        resolve: {
            extensions: ['js', 'vue'],
            alias: {
                '@': resolve('src')
            }
        }
    }
}
