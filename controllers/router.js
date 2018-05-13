/**
 * Created by Administrator on 2017/8/10.
 */
'use strict';

var _ = require('lodash')
var multer = require('multer')
var upload = multer({dest:'upload/'})
var mongoose = require("mongoose")
var Monitor = mongoose.models.mointor

var Config = require('../config.js')
var Constant = Config['Constant'] || {}
var IS_CONFUSION = Constant['IS_CONFUSION'] || false
var Template = require('./lib/template.js')
var DEFAULAT_HOST = /^open\.oibip\.com$/

module.exports = function(app){
    requestHandler(app)
    //路由设置
    commonRoutes(app)
    adminRoutes(app)
    homeRoutes(app)
}
function requestHandler(app) {
    app.use(function (req, res, next) {
        req.session = req.session || {}

        res.set({
            'strict-transport-security': 'max-age=31536000; includeSubDomains',
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'SAMEORIGIN',
            'x-xss-protection': '1; mode=block'
        })
        res.go = function (view, options) {
            options = options || {}
            var o = {views: app.get('views'), APPVersion: app.get("version"), env: app.settings.env}
            _.extend(options, o)

            options.is_confusion = IS_CONFUSION
            options.time = new Date().getTime()

            res.format({
                html: function () {
                    Template.render(view, options, function (err, data) {
                        if (err) {
                            res.send(err.message)
                            console.trace(err)
                        } else {
                            res.send(data)
                        }
                    })
                },
                json: function (view, options) {
                    res.jsonp(options)
                }
            })
        }
        res.err = function (err) {
            console.trace(err)
            res.go('error', {message: err.message || err})
        }
        res.warn = function (msg) {
            console.warn(new Date, msg)
            res.go('error', {message: msg})
        }

        req.isAjax = (req.header('x-requested-with') === "XMLHttpRequest")
        next()
    })
}

function commonRoutes(app){
    var common = require('./common.js')
    var admin = require('./admin.js')
    app.get('/login.html',common.loginView)
    app.post('/login',common.verifyLogin)
    app.get('/register.html',common.registerView)
    app.post('/register',common.accountAdd)
    app.post('/has/login',common.hasLogin)
}

function adminRoutes(app){
    var admin = require('./admin.js')
    var common = require('./common.js')
    //后台管理
    app.get("/admin.html",common.getMusicNum,common.getUserNum,admin.adminView)

    //用户管理
    app.get("/uquery.html",common.getMusicNum,admin.userQueryView)
    app.get("/ureport.html",common.getMusicNum,admin.userReportView)
    app.post("/user/Search",admin.userSearch)
    app.post("/user/del",admin.userDel)

    app.get("/mquery.html",common.getMusicNum,admin.musicQueryView)
    app.get("/upmusic.html",common.getMusicNum,admin.uplaodMusicView)
    app.post("/music/Search",admin.musicSearch)
    app.post("/music/del",admin.musicDel)

    app.get("/poster.html",admin.posterView)
    app.post('/upload/poster',admin.uploadPoster)
}
function homeRoutes(app){
    var common = require('./common.js')
    var home = require('./home.js')
    app.get('/',common.addVisitNum,home.indexView)
    app.get('/yc.html',common.addVisitNum,home.ycView)
    app.get('/bz.html',common.addVisitNum,home.bzView)
    app.get('/bd.html',common.addVisitNum,home.bdView)

    app.post("/search/music",home.searchMusic)
    //主页-个人资料
    app.get('/site/setting.html',home.settingView)
    app.post('/user/cost/update',home.userCostUpdate)
    //主页-头像
    app.get('/site/tx.html',common.addVisitNum,home.txView)
    app.post('/upload/tx',home.uploadTx)
    app.post('/file-upload.html',home.upload)
    //主页-发布作品
    app.get('/site/fb.html',common.addVisitNum,home.fbView)
    app.post('/upload/music',home.uploadMusic)
    //主页-账号安全
    app.get('/site/safe.html',common.addVisitNum,home.safeView)
    app.post("/set/email",home.safeEmail)
    app.post("/set/qq",home.safeQQ)
    app.post("/set/wx",home.safeWx)
    app.post("/set/tel",home.safeTel)
    app.post("/set/pwd",home.safePwd)
    //主页-我的收藏
    app.get('/site/sc.html',common.addVisitNum,home.scView)

    //播放器
    app.get('/music/play.html',common.addVisitNum,common.addMusicPlayNum,common.addSelfPlayNum,home.musicPlay)

}

function isLogin(req,res,next){
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login.html');
    }
}
function addVisitNum(req,res,next){
    Monitor.find({})
        .then(function(doc){
            console.log("aaaaaa",doc)
            if(doc.length > 0){

            }else{
                Monitor.Pinsert({musicNum:0})
                    .then(function () {
                        next()
                    })
            }
            next()
        })
}

