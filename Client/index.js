/**
 * Created by xiaoxiaosu on 2016/3/21.
 */
    require('./index.less');
var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');

var FriendCollection = Backbone.Collection.extend({
    getBy_Id:function(_id){
        return this.find(function(m){
            return m.get("_id") == _id
        })
    }
})

window.root = {
    myself : new Backbone.Model(myself),
    friend : new FriendCollection(),
    event:_.extend({},Backbone.Events),
    host:'localhost:3000'
}
// 设置全局ajax
$.ajaxSettings.timeout = 15000;
$.ajaxSettings.contentType = "application/json";
$.ajaxSettings.xhrFields = {
    withCredentials: true //设置后，跨域也会附带cookies信息
};


var Panel = require('./panel/panel.js'),
    Dialog = require('./dialog/dialog.js');

var App = React.createClass({
    render:function(){
        return (
            <div className="app">
                <Panel/>
                <Dialog/>
            </div>
        )
    },
    componentDidMount:function(){
        $.ajax({
            url:'/getFriend/',
            success:function(response){
                console.log(response)
                var res = response.map(function(obj){
                    obj.message = []
                    return obj
                })
                root.friend.reset(res)
            }
        })

        var socket = io.connect('http://localhost:3000')
        socket.emit('login',root.myself.toJSON())


        socket.on("receive-message",function(obj){
            console.log('i receive message')
            var model = root.friend.getBy_Id(obj.from),
                message = model.get('message')

            message.push({
                type:'receive',
                text:obj.text,
                username:model.get('username')
            })

            root.friend.trigger('receive-message',model.get('_id'))
        })

        socket.on('disconnect',function(){
            socket.emit('disconnect',root.myself.get('id'))
        })


        root.socket = socket
    }
})
console.log()
ReactDOM.render(<App/>,document.getElementById('react-modules'))