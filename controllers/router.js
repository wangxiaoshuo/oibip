/**
 * Created by Administrator on 2017/8/10.
 */
'use strict';

var _ = require('lodash')
var multer = require('multer')
var upload = multer({dest:'upload/'})

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
    frontendRoutes(app)
}
function requestHandler(app) {
    app.use(function (req, res, next) {
        req.session = req.session || {}

        var host = req.headers.host
        if(DEFAULAT_HOST.exec(host)){
            req.session.host = 'default'
        }else{
            req.session.host = 'default'
        }
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
            options.host = req.session.host
            options.time = new Date().getTime()

            res.format({
                html: function () {
                    if (req.user && options) options.user = req.user
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
            // this.go('err', {err: 1, msg: err.message || err})
            res.go('error', {message: err.message || err})
        }
        res.warn = function (msg) {
            console.warn(new Date, msg)
            // this.go('err', {err: 1, msg: msg})
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
    app.get('/register.html',common.registerView)
    app.post('/verify/login',common.verifyLogin)
    app.post('/account/add',common.accountAdd)
    app.post('/has/login',common.hasLogin)
    app.post('/rm/session/user',common.rmUserSession)
}

function adminRoutes(app){
    var admin = require('./admin.js')
}
function frontendRoutes(app){
    var frontend = require('./frontend.js')
    app.get('/',frontend.indexView)
    app.get('/my/space.html',frontend.mySpaceView)
    //个人中心-个人资料
    app.get('/site/setting.html',frontend.settingView)
    //个人中心-主页
    app.get('/site/index.html',frontend.siteIndexView)
    //个人中心-头像
    app.get('/site/face.html',frontend.faceView)
    app.get('/account.html',frontend.accountView)
    app.post('/user/free/update',frontend.userFreeUpdate)
    app.post('/user/cost/update',frontend.userCostUpdate)
    app.post('/user/detail/update',frontend.userDetailUpdate)
}

function isLogin(req,res,next){
    if (req.session.username) {
        next();
    } else {
        res.redirect('/admin/login.html');
    }
}


