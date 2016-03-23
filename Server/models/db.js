/**
 * Created by xiaoxiaosu on 2016/3/12.
 */
var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1:27017/webqq');

db.once('open',function(callback){
    console.log('数据库连接成功')
})

module.exports = db;