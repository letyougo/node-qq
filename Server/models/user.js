/**
 * Created by xiaoxiaosu on 2016/3/12.
 */
var mongoose = require('mongoose'),
    db = require('./db.js');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:  String,
    password:String,
    online:Boolean,
    friend : [],
});


userSchema.methods.addFriend = function(id,callback){
    var that = this;
    this.friend.indexOf(id)>-1 || this.friend.push(id)
    User.findOne({_id:id},function(err,data){
        data.friend.indexOf(that.id)>-1 || data.friend.push(that.id)
        data.save()
        callback(err)
    })
}
userSchema.methods.getFriend = function(callback){
    var f = [],
        list = this.friend


    var inter = function(i){
        User.findOne({_id:list[i]},function(err,friend){
            if(err){
                console.log(err)
                return
            }
            if(i == list.length){
                callback(f)
                return
            }
            f.push(friend)
            i++
            inter(i)
        })
    }

    inter(0)
}


var User = db.model('user', userSchema);

module.exports = User;

