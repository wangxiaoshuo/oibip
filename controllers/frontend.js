/**
 * Created by Administrator on 2017/12/11.
 */
var mongoose = require("mongoose")
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
exports.indexView = function (req, res, next) {
    var options = {
        // L: Lang.getFile(req.session.lang, 'index')
    }
    res.go('/frontend/index', options)
}

exports.mySpaceView = function (req, res, next) {
    var options = {
       username:req.session.username
    }
    res.go('/frontend/myspace', options)
}

exports.siteIndexView= function (req,res,next) {
    var options = {
        username:req.session.username
    }
    res.go('/frontend/site/space', options)
}
exports.settingView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(user){
            var sex = user.sex
            var qm = user.qm
            var born_at = user.born_at
            var job_city = user.job_city
            var gold = user.gold
            var nickname = user.nickname
            var born_city = user.born_city
            var options
            var user_name
            var born_city_province
            var born_city_city
            var born_city_area
            var xueli = user.xueli
            var job = user.job
            var qg = user.qg
            var height = user.height
            var smoke = user.smoke
            var drink = user.drink
            var favourite = user.favourite
            var character = user.character
            if(born_city){
                born_city_province = user.born_city.province
                born_city_city = user.born_city.city
                born_city_area = user.born_city.area
            }else{
                born_city_province = "----选择省----",
                    born_city_city = "----选择市----",
                    born_city_area = "----选择区----"
            }

            if(nickname){
                user_name = nickname
            }else{
                user_name = username
            }

            if(job_city && born_at){
               options = {
                    nickname:user_name,
                    username:username,
                    sex:sex,
                    qm:qm,
                    gold:gold,
                    born_at:born_at,
                    job_city_province:job_city.province,
                    job_city_city:job_city.city,
                    job_city_area:job_city.area,
                   born_city_province:born_city_province,
                   born_city_city:born_city_city,
                   born_city_area:born_city_area,
                   xueli:xueli,
                   job:job,
                   height:height,
                   qg:qg,
                   smoke:smoke,
                   drink:drink,
                   favourite:favourite,
                   character:character,
                }
            }else{
                options = {
                    nickname:user_name,
                    username:username,
                    sex:sex,
                    qm:qm,
                    gold:gold,
                    born_at:"2000-01-01",
                    job_city_province:"----选择省----",
                    job_city_city:"----选择市----",
                    job_city_area:"----选择区----",
                    born_city_province:born_city_province,
                    born_city_city:born_city_city,
                    born_city_area:born_city_area,
                    xueli:xueli,
                    job:job,
                    height:height,
                    qg:qg,
                    smoke:smoke,
                    drink:drink,
                    favourite:favourite,
                    character:character
                }
            }

            console.log(options)
            res.go('/frontend/site/setting', options)
        })
}
exports.faceView = function (req,res,next) {
    var options = {
        username:req.session.username
    }
    res.go('/frontend/site/face', options)
}

exports.accountView =function (req,res,next) {
    var options = {

    }
    res.go('/frontend/space', options)
}

exports.userFreeUpdate = function (req,res,next) {
    var qm = req.body.qm
    var born_at = req.body.born_at
    var job_city_province = req.body.job_city_province
    var job_city_city = req.body.job_city_city
    var job_city_area = req.body.job_city_area
    var age = req.body.age
    var username = req.session.username
    User.PfindOneAndUpdate({username:username},{$set:{qm:qm,born_at:born_at,age:age,job_city:{province:job_city_province,city:job_city_city,area:job_city_area}}})
        .then(function () {
            res.send(true)
        })
}
exports.userCostUpdate = function (req,res,next) {
    var qm = req.body.qm
    var born_at = req.body.born_at
    var job_city_province = req.body.job_city_province
    var job_city_city = req.body.job_city_city
    var job_city_area = req.body.job_city_area
    var age = req.body.age
    var nickname = req.body.nickname
    var username = req.session.username
    var gold = req.body.gold
    User.PfindOneAndUpdate({username:username},{$set:{qm:qm,born_at:born_at,age:age,job_city:{province:job_city_province,city:job_city_city,area:job_city_area},gold:gold,nickname:nickname}})
        .then(function () {
            res.send(true)
        })
}
exports.userDetailUpdate = function (req,res,next) {
    var born_city_province = req.body.born_city_province
    var born_city_city = req.body.born_city_city
    var born_city_area = req.body.born_city_area
    var xueli = req.body.xueli
    var job = req.body.job
    var qg = req.body.qg
    var height = req.body.height
    var smoke = req.body.smoke
    var drink = req.body.drink
    var aihao = req.body.aihao
    var xingge = req.body.xingge
    var username = req.session.username
    User.PfindOneAndUpdate({username:username},{$set:{born_city:{province:born_city_province,city:born_city_city,area:born_city_area},xueli:xueli,job:job,qg:qg,height:height,smoke:smoke,drink:drink,favourite:aihao,character:xingge}})
        .then(function(){
            res.send(true)
        })
}
