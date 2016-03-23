
/*
 * GET home page.
 */
var user = require('../models/user.js');

exports.index = function(req,res){
    if(req.cookies.qqLogin){
        var _id = req.cookies.qqLogin._id;
        res.render('index',{
            myself:req.cookies.qqLogin
        })
    }else {
        res.redirect('login')
    }
}

exports .getFriend = function(req,res){
    var _id = req.cookies.qqLogin._id;
    user.findOne({_id:_id},function(err,data){
        if(err){console.log(err)}

        data.getFriend(function(list){
            res.send(list)
        })
    })
}

