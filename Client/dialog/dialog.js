/**
 * Created by xiaoxiaosu on 2016/3/22.
 */
require('./dialog.less')
var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');

var Dialog = React.createClass({
    getInitialState:function(){
        return {
            to : [],
            currentUserId:"",
            message:[]
        }
    },
    render:function(){
        return (
            <div className="dialog">
                <ToList to={this.state.to}/>
                <MessageBox currentUserId={this.state.currentUserId} message={this.state.message}/>
            </div>
        )
    },
    addUser:function(id){
        var model = root.friend.getBy_Id(id),
            obj = model.toJSON(),
            state = this.state.to;

        if(!_.find(state,function(obj){
                return obj._id == id
            })
        ){
            state.push(obj)
        }
        var message = obj.message


        this.setState({
            to:state,
            currentUserId:obj._id,
            message:message
        })
    },
    removeUser:function(id){

    },
    componentDidMount:function(){
        _.extend(this,Backbone.Events)
        this.listenTo(root.event,'add-to',function(id){
            this.addUser(id)
        })

        this.listenTo(root.friend,'receive-message',function(id){
            this.setState({
                message:root.friend.getBy_Id(id).get('message')
            })
        })
    }
})

var ToList = React.createClass({
    render:function(){
        var nodes = this.props.to.map(function(obj,i){
            return (
                <li key={'message-item-'+i}>
                    <p>{obj.username}</p>
                </li>
            )
        })
        return (
            <ul className="to-list">
                {nodes}
            </ul>
        )
    }
})

var MessageBox = React.createClass({
    getInitialState:function(){
        return {
            text:'',
        }
    },
    render:function(){
        var messageNodes = this.props.message.map(function(m,i){
            return (
                <li key={'message-item-'+m.type+"-"+i}>
                    <span>{m.type}</span><br/>
                    <span>{m.username}:</span><br/>
                    <span>{m.text}</span>
                </li>
            )
        })
        return (
            <div className="message-box">
                <ul className="message-list">
                    {messageNodes}
                </ul>
                <div>
                    <textarea onChange={this.change} value={this.state.text}>

                    </textarea>
                    <button onClick={this.submit}>发送</button>
                </div>
            </div>
        )
    },
    change:function(e){
        this.setState({
            text:e.target.value
        })
    },
    submit:function(){
        console.log(this.props.currentUserId)
        var id = this.props.currentUserId
        var model = root.friend.getBy_Id(id);

        var that = this

        var message =model.get("message")
        message.push({
            type:'send',
            text:that.state.text,
            username:root.myself.get('username')
        })
        model.set('message',message)
        this.setState({
            text:""
        })
        root.socket.emit('send-message',{
            from:root.myself.get("id"),
            text:that.state.text,
            to:id
        })
    }
})

module .exports = Dialog