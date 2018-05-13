/**
 * Created by Administrator on 2017/12/6.
 */
var mongoose = require("mongoose")
var Admin = mongoose.models.admin
var Judge = mongoose.models.judge
var User = mongoose.models.user
var Monitor = mongoose.models.mointor
var Music = mongoose.models.music
var Config = require('../config.js')
var Constant = Config['Constant'] || {}
var md5 = require("blueimp-md5").md5
var _ = require("lodash")
var P = require("bluebird")
var Util = require("../lib/util.js")
const PATH = require('path');
var json = {state: -1, message: '操作失败', data: {}}
var moment = require("moment")
moment.locale('zh-cn')

//通用模块
//增加网站浏览量
exports.addVisitNum = function(req,res,next){
    Monitor.PfindOne({id:1})
        .then(function(doc){
            console.log("aaaaaa",!!doc)
            if(!!doc){
                Monitor.update({id:1},{$set:{visitNum:doc.visitNum + 1}})
                    .then(function () {
                        next()
                    })
            }else{
                Monitor.Pinsert({id:1,musicNum:0,m_playNum:0,userNum:0,download:0,newUserNum:0,newMusicNum:0,visitNum:1,site:"www.oibip.com"})
                    .then(function () {
                        next()
                    })
            }
        })
}

//z增加歌曲播放量
exports.addMusicPlayNum = function(req,res,next){
    Monitor.PfindOne({id:1})
        .then(function(doc){
            console.log("aaaaaa",!!doc)
            if(!!doc){
                Monitor.update({id:1},{$set:{m_playNum:doc.m_playNum + 1}})
                    .then(function () {
                        next()
                    })
            }else{
                Monitor.Pinsert({id:1,musicNum:0,m_playNum:1,userNum:0,download:0,newUserNum:0,newMusicNum:0,visitNum:0,site:"www.oibip.com"})
                    .then(function () {
                        next()
                    })
            }
        })
}

//z记录单个歌曲播放量
exports.addSelfPlayNum = function(req,res,next){
    var m_name = req.query.m_name
    Music.PfindOne({m_name:m_name})
        .then(function (doc) {
            var playNum = doc.playNum
            Music.update({m_name:m_name},{$set:{playNum:playNum+1}})
                .then(function () {
                    next()
                })
        })

}

//增加歌曲下载量
exports.addMusicDownNum = function(req,res,next){
    Monitor.PfindOne({id:1})
        .then(function(doc){
            console.log("aaaaaa",!!doc)
            if(!!doc){
                Monitor.update({id:1},{$set:{download:doc.download + 1}})
                    .then(function () {
                        next()
                    })
            }else{
                Monitor.Pinsert({id:1,musicNum:0,m_playNum:1,userNum:0,download:0,newUserNum:0,newMusicNum:0,visitNum:0,site:"www.oibip.com"})
                    .then(function () {
                        next()
                    })
            }
        })
}

//获取歌曲总数
exports.getMusicNum = function(req,res,next){
    Music.find({})
        .then(function (doc) {
            Monitor.update({id:1},{$set:{musicNum:doc.length}})
                .then(function () {
                    next()
                })
        })
}

//获取今日新增歌曲数
exports.getNewMusicNum = function(req,res,next){
    Music.find({})
        .then(function (doc) {
            Monitor.update({id:1},{$set:{musicNum:doc.length}})
                .then(function () {
                    next()
                })
        })
}

//获取用户总数
exports.getUserNum = function(req,res,next){
    User.find({})
        .then(function (doc) {
            Monitor.update({id:1},{$set:{userNum:doc.length}})
                .then(function () {
                    next()
                })
        })
}





//更新用户最新上线时间
/*exports.updateUserDate = function(req,res,next){
    User.update({username:req.session.username},{$set:{update_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}})
        .then(function(doc){

        })
}*/

exports.loginView = function (req, res, next) {
    var options = {
        // L: Lang.getFile(req.session.lang, 'index')
    }
    res.go('/home/login', options)
}
exports.registerView = function (req, res, next) {
    var options = {
        // L: Lang.getFile(req.session.lang, 'index')
    }
    res.go('/home/register', options)
}
//登录
exports.verifyLogin = function(req,res,next){
    var username = req.body.username
    var pwd = req.body.pwd
    var message = ""
    var isAdmin = false
    User.PfindOne({username:username})
        .then(function(user){
            var data = ""
            if(user){
                if(user.password == pwd){
                    req.session.username = username
                    if(user.role > 1){
                        isAdmin = true
                    }
                    User.update({username:req.session.username},{$set:{update_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}})
                        .then(function(doc){
                            message = "登录成功!"
                            data = {result:true,message:message,isAdmin:isAdmin}
                            res.send(data)
                        })
                }else{
                    message = "密码错误，请重新输入!"
                    data = {result:false,message:message}
                    res.send(data)
                }
            }else{
                message = "用户名不存在，请重新输入！"
                data = {result:false,message:message}
                res.send(data)
            }
        }).catch(function(err){
        message = "服务器繁忙！"
        res.send(message)
    })
}
//注册
exports.accountAdd = function(req,res,next){
    var username = req.body.username
    var pwd = req.body.pwd
    var tx = req.body.tx
    User.PfindOne({username:username})
        .then(function(doc){
            if(doc){
                var message = "账号已存在!"
                var data = {result:false,message:message}
                res.send(data)
            }else{
                User.Pinsert({
                    username:username,
                    password:pwd,
                    tx:tx,
                    role:0,
                    create_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    update_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }).then(function(){
                    req.session.username = username
                    var data = {result:true,message:"注册成功！"}
                    res.send(data)
                })
            }
        })

}

//判断用户是否登录
exports.hasLogin = function (req,res,next) {
    var username = req.session.username
    var data = ""
    if(username){
        console.log("111111111")
        User.PfindOne({username:username})
            .then(function(user){
                var nickname = user.nickname;
                var tx = "/"+user.tx
                if(!user.nickname){
                    nickname = user.username
                }
                if(!user.tx){
                    tx = "/images/erji.png"
                }
                console.log(nickname)
                var data = {lt:true,nickName:nickname,tx:tx}
                res.send(data)
            })
    }else{
       data = {lt:false}
        res.send(data)
    }
}

//注销
exports.rmUserSession = function (req,res,next) {
    delete req.session.username
    var data = {lt:true}
    res.send(data)
}
