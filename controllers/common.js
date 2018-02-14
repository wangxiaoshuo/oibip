/**
 * Created by Administrator on 2017/12/6.
 */
var mongoose = require("mongoose")
var Admin = mongoose.models.admin
var Judge = mongoose.models.judge
var User = mongoose.models.user
var Config = require('../config.js')
var Constant = Config['Constant'] || {}
var template = require('./lib/template.js')
var md5 = require("blueimp-md5").md5
var _ = require("lodash")
var P = require("bluebird")
var Util = require("../lib/util.js")
var Path = require("path")
var json = {state: -1, message: '操作失败', data: {}}
var moment = require("moment")
moment.locale('zh-cn')
exports.loginView = function (req, res, next) {
    var options = {
        // L: Lang.getFile(req.session.lang, 'index')
    }
    res.go('/common/login', options)
}
exports.registerView = function (req, res, next) {
    var options = {
        // L: Lang.getFile(req.session.lang, 'index')
    }
    res.go('/common/register', options)
}
//登录
exports.verifyLogin = function(req,res,next){
    var username = req.body.login
    var pwd = req.body.pwd
    User.PfindOne({username:username})
        .then(function(user){
            var data
            if(user){
                if(user.password == pwd){
                    req.session.username = username
                    message = "登录成功!"
                    data = {result:true,message:message}
                    res.send(data)
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
    var username = req.body.login
    var pwd = req.body.pwd
    var sex = req.body.sex
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
                    sex:sex
                }).then(function(){
                    req.session.username = username
                    var data = {result:true,message:"注册成功,开始你的美丽邂逅吧！"}
                    res.send(data)
                })
            }
        })

}

//判断用户是否登录
exports.hasLogin = function (req,res,next) {
    var username = req.session.username
    var data
    if(username){
        User.PfindOne({username:username})
            .then(function(user){
                var nickname = user.nickname
                var charm = user.charm
                var credit = user.credit
                var gold = user.gold
                console.log(nickname)
                if(nickname){
                    data = {lt:true,user_name:nickname,charm:charm,credit:credit,gold:gold}
                }else{
                    data = {lt:true,user_name:username,charm:charm,credit:credit,gold:gold}
                }
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