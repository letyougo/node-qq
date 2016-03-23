
/*
 * GET users listing.
 */
var formidable = require('formidable'),
    user = require('../models/user.js');
exports.login = function(req, res){
    res.render('login')
};

exports.postLogin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        user.findOne({username:fields.username},function(err,data){
            if(!data){
                res.send('<a href="/login">'+'没有找到该用户'+'</a>')
                return
            }else {
                if(data.password != fields.password){
                    res.send('<a href="/login">'+'密码错误'+'</a>')
                    return
                }
            }

            res.cookie('qqLogin',data,{maxAge:900000,httpOnly:true})
            res.redirect('/')
        })
    });
}
