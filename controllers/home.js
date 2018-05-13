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


function test(opt){
    console.log(opt)
}

exports.searchMusic = function(req,res,next){
    var search = req.body.search
    Music.PfindOne({m_name:search})
        .then(function(doc){
            if(!!doc){
                var m_name = doc.m_name
                res.send({m_name:m_name})
            }else{
                res.send(false)
            }

        })
}

exports.indexView = function (req, res, next) {
    Music.find({type:0}).sort({update_at:-1}).limit(10)
        .then(function(doc){
            var yc = JSON.stringify(doc)
            console.log("yc",yc)
            Music.find({type:1}).sort({update_at:-1}).limit(10)
                .then(function(doc1){
                    var bz = JSON.stringify(doc1)
                    Poster.PfindOne({id:1})
                        .then(function (poster) {
                            var posterArr = poster.poster

                            var options = {
                                yc:yc,
                                bz:bz,
                                posterArr:JSON.stringify(posterArr)
                                // L: Lang.getFile(req.session.lang, 'index')
                            }
                            res.go('/home/index', options)
                        })

                })
        })

}
exports.ycView = function (req, res, next) {
    Music.find({type:0}).sort({playNum:-1})
        .then(function(doc){
            var hot_yc = JSON.stringify(doc)

            Music.find({type:0}).sort({update_at:-1})
                .then(function (doc2) {
                    var new_yc = JSON.stringify(doc2)

                    Poster.PfindOne({id:1})
                        .then(function (poster) {
                            var posterArr = JSON.stringify(poster.poster)
                            var options = {
                                hot_yc:hot_yc,
                                new_yc:new_yc,
                                posterArr:posterArr
                                // L: Lang.getFile(req.session.lang, 'index')
                            }
                            res.go('/home/yc', options)
                        })

                })

        })
}
exports.bzView = function (req, res, next) {
    Music.find({type:1}).sort({playNum:-1})
        .then(function(doc){
            var hot_bz = JSON.stringify(doc)

            Music.find({type:1}).sort({update_at:-1})
                .then(function (doc2) {
                    var new_bz = JSON.stringify(doc2)
                    Poster.PfindOne({id:1})
                        .then(function (poster) {
                            var posterArr = JSON.stringify(poster.poster)
                            var options = {
                                hot_bz:hot_bz,
                                new_bz:new_bz,
                                posterArr:posterArr
                                // L: Lang.getFile(req.session.lang, 'index')
                            }
                            res.go('/home/bz', options)
                        })
                })

        })
}
exports.bdView = function (req, res, next) {
    Music.find({type:0}).sort({playNum:-1}).limit(20)
        .then(function(doc){
            var yc_sort = JSON.stringify(doc)
            Music.find({type:1}).sort({playNum:-1}).limit(20)
                .then(function(doc2){
                    var bz_sort = JSON.stringify(doc2)
                    Poster.PfindOne({id:1})
                        .then(function (poster) {
                            var posterArr = JSON.stringify(poster.poster)
                            var options = {
                                yc_sort:yc_sort,
                                bz_sort:bz_sort,
                                posterArr:posterArr
                                // L: Lang.getFile(req.session.lang, 'index')
                            }
                            res.go('/home/bd', options)
                        })
                })
        })

}


exports.musicPlay = function (req, res, next) {
    var m_name = req.query.m_name
    Music.PfindOne({m_name:m_name})
        .then(function(doc){
            var url = doc.url.replace(/(^\s*)|(\s*$)/g, "");
            test(url)
            var music = JSON.stringify(doc)
            var options = {
                music:music,
                url:url
            }
            res.go('/home/m_play', options)
        })
}
exports.mySpaceView = function (req, res, next) {
    var options = {
        username:req.session.username
    }
    res.go('/home/myspace', options)
}
exports.settingView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(user){
            var username = req.session.username
            User.PfindOne({username:username})
                .then(function(user){
                    var sex = user.sex
                    var qm = user.qm
                    var born_at = user.born_at
                    var job_city = user.job_city
                    var nickname = user.nickname
                    var options = {}
                    var user_name = ""

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
                            born_at:born_at,
                            job_city_province:job_city.province,
                            job_city_city:job_city.city,
                            job_city_area:job_city.area,
                        }
                    }else{
                        options = {
                            nickname:user_name,
                            username:username,
                            sex:sex,
                            qm:qm,
                            born_at:"2000-01-01",
                            job_city_province:"----选择省----",
                            job_city_city:"----选择市----",
                            job_city_area:"----选择区----",
                        }
                    }

                    console.log(options)
                    res.go('/home/setting', options)
                })
        })
}

exports.userCostUpdate = function (req,res,next) {
    var qm = Util.getFilterStr_g(req.body.qm)
    var born_at = req.body.born_at
    var job_city_province = req.body.job_city_province
    var job_city_city = req.body.job_city_city
    var job_city_area = req.body.job_city_area
    var nickname = req.body.nickname
    var username = req.session.username
    var sex = req.body.sex
    console.log("sex",sex,job_city_province,job_city_city)
    User.PfindOneAndUpdate({username:username},{$set:{qm:qm,sex:sex,born_at:born_at,job_city:{province:job_city_province,city:job_city_city,area:job_city_area},nickname:nickname}})
        .then(function () {
            res.send(true)
        })
}

exports.fbView = function (req,res,next) {
    var options = {
        username:req.session.username
    }
    res.go('/home/fb', options)
}
exports.safeView = function (req,res,next) {
    User.PfindOne({username:req.session.username})
        .then(function (user) {
            var email = "未绑定邮箱"
            var qq = "未绑定QQ账号"
            var wx = "未绑定微信账号"
            var tel = "未绑定电话号码"
            var pwd = "未设置密码"

            if(!!user.email){
                email = user.email
            }
            if(!!user.qq){
                qq = user.qq
            }
            if(!!user.wx){
                wx = user.wx
            }
            if(!!user.tel){
                tel = user.tel
            }
            if(!!user.password){
                pwd = user.password
            }
            var options = {
                email:email,
                qq:qq,
                wx:wx,
                tel:tel,
                pwd:pwd
            }
            res.go('/home/safe', options)
        })

}

exports.txView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(user){
            var tx = "/images/erji.png"
            if(!!user.tx){
                tx = "/"+user.tx
            }
            var options = {
                tx:tx
            }
            res.go('/home/tx', options)
        })
}

exports.scView = function (req,res,next) {
    var username = req.session.username
    User.PfindOne({username:username})
        .then(function(user){
            var music = JSON.stringify(user.sc)
            console.log("music",music)
            var options = {
                music:music
            }
            res.go('/home/sc', options)
        })
}

//上传模块
exports.upload = function (req,res,next) {
    var upload = multer({dest:'public/upload/'}).any()
    var tmp_path = []
    var tmp_mimetype = []
    var tmp_originalname = []
    var kind = req.session.kind
    var path = []
    var username = req.session.username
    console.log("username",username)
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return
        }
        console.log(req.files)
        //遍历上传上来的文件
        req.files.forEach(function (value, index, arr) {
            tmp_path[index] = value.path
            tmp_mimetype[index] = value.mimetype
            tmp_originalname[index] = value.originalname
        })
        //var tmp_path = req.file.path;
        console.log(tmp_path,tmp_mimetype,tmp_originalname)
            //创建uses存放资料的文件夹
            if(!fs.existsSync('uploads/users')){
                fs.mkdirSync('uploads/users')
            }else if(!fs.existsSync('uploads/users/'+username+'/')){
                fs.mkdirSync('uploads/users/'+username+'/')
                fs.mkdirSync('uploads/users/'+username+'/images')
                fs.mkdirSync('uploads/users/'+username+'/music')
            }
            for(var i in tmp_path){
                console.log(tmp_mimetype[i])
                //注意图片格式在不同浏览器下的变化
                if(tmp_mimetype[i] == 'image/jpeg' || tmp_mimetype[i] == 'image/pjpeg' || tmp_mimetype[i] == 'image/x-png' || tmp_mimetype[i] == 'image/png'){
                    var target_path = 'uploads/users/'+username+'/images/' + tmp_originalname[i]
                }else{
                    var target_path = 'uploads/users/'+username+'/music/' + tmp_originalname[i]
                }
                console.log(target_path)
                req.session.src = target_path

                console.log("target_path",target_path)
                if(kind == "tx"){
                    console.log("tx")
                    User.update({username:username},{$set:{tx:target_path}})
                        .then(function(doc){
                            var src = []
                            src[i] = fs.createReadStream(tmp_path[i])
                            var dest = fs.createWriteStream(target_path)
                            src[i].pipe(dest)
                            src[i].on('end',function (err) {
                                res.end()
                            })
                            src[i].on('error',function (err) {
                                res.end()
                                console.log(err)
                            })
                        })
                }else if(kind == "m"){
                    var m_name = req.session.m_name
                    var singer = req.session.singer
                    var qu = req.session.qu
                    var ci = req.session.ci
                    var sign = req.session.sign
                    var type = req.session.type
                    var m_bg = req.session.m_bg
                    User.PfindOneAndUpdate({username:username},{$addToSet:{sc:{m_name:m_name,singer:singer,qu:qu,ci:ci,sign:sign,type:type,url:target_path,by:username,m_bg:m_bg,update_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}}})
                        .then(function(doc){
                            var m_name = req.session.m_name
                            var singer = req.session.singer
                            var qu = req.session.qu
                            var ci = req.session.ci
                            var sign = req.session.sign
                            var type = req.session.type
                            var m_bg = req.session.m_bg
                            Music.Pinsert({m_name:m_name,singer:singer,qu:qu,ci:ci,sign:sign,type:type,playNum:0,url:target_path,by:username,m_bg:m_bg,update_at:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
                                .then(function(){
                                    var src = []
                                    src[i] = fs.createReadStream(tmp_path[i])
                                    var dest = fs.createWriteStream(target_path)
                                    src[i].pipe(dest)
                                    src[i].on('end',function (err) {
                                        res.end()
                                    })
                                    src[i].on('error',function (err) {
                                        res.end()
                                        console.log(err)
                                    })
                                })
                        })
                }else if(kind == "poster"){
                    console.log("poster")
                    Poster.PfindOneAndUpdate({id:1},{$addToSet:{poster:{url:target_path}}})
                        .then(function(doc){
                            var src = []
                            src[i] = fs.createReadStream(tmp_path[i])
                            var dest = fs.createWriteStream(target_path)
                            src[i].pipe(dest)
                            src[i].on('end',function (err) {
                                res.end()
                            })
                            src[i].on('error',function (err) {
                                res.end()
                                console.log(err)
                            })
                        })
                }
            }

    })
}

exports.uploadTx = function (req,res,next) {
    var type = req.body.type
    req.session.kind = type
    res.send(true)
}

exports.uploadMusic = function (req,res,next) {
    var key = req.body.key
    req.session.kind = key

    req.session.m_name = req.body.m_name
    req.session.singer = req.body.singer
    req.session.qu = req.body.qu
    req.session.ci = req.body.ci
    req.session.sign = req.body.sign
    req.session.type = req.body.type
    req.session.m_bg = req.body.m_bg
    res.send(true)
}

exports.safeEmail = function (req,res,next) {
    var email = req.body.email
    test(email)
    User.update({username:req.session.username},{$set:{email:email}})
        .then(function(){
            res.send(true)
        })

}
exports.safeQQ = function (req,res,next) {
    var qq = req.body.qq
    test("qq",qq)
    User.update({username:req.session.username},{$set:{qq:qq}})
        .then(function(){
            res.send(true)
        })

}
exports.safeWx = function (req,res,next) {
    var wx = req.body.wx
    User.update({username:req.session.username},{$set:{wx:wx}})
        .then(function(){
            res.send(true)
        })

}
exports.safeTel = function (req,res,next) {
    var tel = req.body.tel
    User.update({username:req.session.username},{$set:{tel:tel}})
        .then(function(){
            res.send(true)
        })

}
exports.safePwd = function (req,res,next) {
    var pwd = req.body.pwd
    User.update({username:req.session.username},{$set:{password:pwd}})
        .then(function(){
            res.send(true)
        })

}