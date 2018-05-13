/**
 * Created by Administrator on 2017/12/6.
 */

var mongoose = require("mongoose")
var User = mongoose.models.user
var Music = mongoose.models.music
var Monitor = mongoose.models.mointor
var Poster = mongoose.models.poster
var Config = require('../config.js')
var Constant = Config['Constant'] || {}
var fs = require('fs')
var request = require('request');
var multer = require('multer')
var md5 = require("blueimp-md5").md5
var _ = require("lodash")
var P = require("bluebird")
var Util = require("../lib/util.js")
var Path = require("path")
var json = {state: -1, message: '操作失败', data: {}}
var moment = require("moment")
moment.locale('zh-cn')

//后台管理
exports.adminView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(doc){
            var nickName = doc.nickName
            if(!nickName){
                nickName = username
            }
            Monitor.PfindOne({id:1})
                .then(function(doc1){
                    var mointor = doc1
                    User.find({}).sort({create_at:-1}).limit(6)
                        .then(function (newUser) {
                            var newUser = JSON.stringify(newUser)
                            Music.find({}).sort({update_at:-1}).limit(6)
                                .then(function (newMusic) {
                                    var newMusic = JSON.stringify(newMusic)
                                    var options = {
                                        nickName:nickName,
                                        tx:doc.tx,
                                        mointor:mointor,
                                        newUser:newUser,
                                        newMusic:newMusic
                                    }
                                    res.go('/home/admin', options)
                                })
                        })

                })

        })

}

//用户管理
exports.userQueryView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(doc){
            var nickName = doc.nickName
            if(!nickName){
                nickName = username
            }
            User.find({}).sort({update_at:-1}).limit(10)
                .then(function(doc1){
                    var userInfo = JSON.stringify(doc1)
                    var options = {
                        nickName:nickName,
                        tx:doc.tx,
                        userInfo:userInfo
                    }
                    res.go('/home/user_query', options)
                })
        })

}

//用户管理
exports.userReportView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(doc){
            var nickName = doc.nickName
            if(!nickName){
                nickName = username
            }
            var options = {
                nickName:nickName,
                tx:doc.tx,
            }
            res.go('/home/user_report', options)
        })

}

//歌曲管理
exports.musicQueryView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(doc){
            var nickName = doc.nickName
            if(!nickName){
                nickName = username
            }
            Music.find({}).sort({update_at:-1}).limit(10)
                .then(function(doc1){
                    var musicInfo = JSON.stringify(doc1)
                    var options = {
                        nickName:nickName,
                        tx:doc.tx,
                        musicInfo:musicInfo
                    }
                    res.go('/home/music-query', options)
                })
        })

}

//歌曲管理
exports.uplaodMusicView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(doc){
            var nickName = doc.nickName
            if(!nickName){
                nickName = username
            }
            User.find({}).sort({update_at:-1}).limit(10)
                .then(function(doc1){
                    var userInfo = JSON.stringify(doc1)
                    var options = {
                        nickName:nickName,
                        tx:doc.tx,
                        userInfo:userInfo
                    }
                    res.go('/home/music-upload', options)
                })
        })

}

exports.musicDel = function(req,res,next){
    var id = req.body.id
    console.log("id",id)
    Music.remove({_id:id})
        .then(function(){
            res.send(true)
        })
}

exports.musicSearch = function(req,res,next){
    var m_name = req.body.search_text
    Music.PfindOne({m_name:m_name})
        .then(function(doc){
            if(!!doc){
                res.send(JSON.stringify(doc))
            }else{
                res.send(null)
            }
        })
}

exports.userSearch = function(req,res,next){
    var username = req.body.search_text
    User.PfindOne({username:username})
        .then(function(doc){
            if(!!doc){
                res.send(JSON.stringify(doc))
            }else{
                res.send(null)
            }
        })
}

exports.userDel = function(req,res,next){
    var id = req.body.id
    console.log("id",id)
    User.PdeleteById(id)
        .then(function(){
            res.send(true)
        })
}


exports.posterView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(doc){
            var nickName = doc.nickName
            if(!nickName){
                nickName = username
            }
            var options = {
                nickName:nickName,
                tx:doc.tx,
            }
            res.go('/home/poster', options)
        })

}

exports.uploadPoster = function (req,res,next) {
    var type = req.body.type
    req.session.kind = type
    Poster.find({})
        .then(function (doc) {
            if(doc.length>0){
                res.send(true)
            }else{
                Poster.Pinsert({id:1,poster:"",update_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
                    .then(function () {
                        res.send(true)
                    })
            }
        })


}