/**
 * Created by xiaoxiaosu on 2016/3/22.
 */
    require('./panel.less')
var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');

var Panel = React.createClass({

    render:function(){

        return (
            <div className="panel">
                <Myself/>
                <FriendList/>
            </div>
        )
    },
})

var Myself = React.createClass({
    getInitialState:function(){
        return {
            username:root.myself.get("username")
        }
    },
    render:function(){
        return(
            <div className="myself">
                <label>{this.state.username}</label>
            </div>
        )
    },
    componentDidMount:function(){
        _.extend(this,Backbone.Events)
        this.listenTo(root.myself,'change',function(){
            this.setState({username:root.myself.get("username")})
        })

    }
})

var FriendList = React.createClass({
    getInitialState:function(){
        return {
            friend:root.friend.toJSON()
        }
    },
    render:function(){
        var nodes = this.state.friend.map(function(v){
            return (
                <FriendItem online={v.online} username={v.username} _id={v._id} key={'friend-item-'+v._id}/>
            )
        })
        return(
            <ul className="friend-list">
                {nodes}
            </ul>
        )
    },
    componentDidMount:function(){
        _.extend(this,Backbone.Events)
        this.listenTo(root.friend,'add change reset remove',function(){
            this.setState({friend:root.friend.toJSON()})
        })
    }
})

var FriendItem = React.createClass({
    render:function(){
        return (
            <li className="friend-item">
                <p onClick={this.handleClick}>username--{this.props.username}({this.props.online?"在线":"离线"})</p>
            </li>
        )
    },
    handleClick:function(e){
        root.event.trigger('add-to',this.props._id)
    }
})

module .exports = Panel