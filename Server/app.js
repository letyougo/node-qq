
/**
 * Module dependencies.
 */
var express = require('express'),
    app = express(),

    cookieParser = require('cookie-parser');


app.use(express.static('./public'));

app.use(cookieParser());


console.log()
app.set('view engine','ejs');

var index = require('./routes/index'),
    user = require('./routes/user');

//app.all('/', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    next();
//});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});


app.get('/',index.index);
app.get('/login',user.login)
app.post('/login',user.postLogin)
app.get('/getFriend',index.getFriend)

var http = require('http').Server(app);
http.listen(3000)
io = require('socket.io')(http);


var users = {}


var host = {},
    _ = require('underscore');

io.sockets.on('connection',function(socket){


    socket.on('login',function(obj){
        host[obj.id] = socket
    })
    socket.on('send-message',function(obj){
        console.log(obj)
        if(host[obj.to]){
            host[obj.to].emit('receive-message',obj)
        }
    })

    socket.on('disconnect',function(id){
        //host = _.omit(host,id)
    })
})

