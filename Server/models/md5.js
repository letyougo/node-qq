/**
 * Created by xiaoxiaosu on 2016/3/11.
 */
var crypto = require('crypto');

module.exports = function(text){
    return crypto.createHash('md5').update(text).digest('base64')
}