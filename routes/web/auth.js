var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel')
const md5 = require('md5')


//註冊頁面
router.get('/reg',(req,res)=>{
    res.render("reg")
})

//註冊
router.post('/reg',(req,res)=>{
    //獲取請求體
    // console.log(req.body)
    if(req.body.username.trim()==='' || req.body.password.trim()===''){
        res.render('fail',{
            msg:'註冊失敗，帳號密碼不得為空',
            url:'/reg'
        })
        return
    }
    UserModel.create({...req.body, password: md5(req.body.password)},(err,data)=>{
        
        if(err){
            res.status(500)
            res.render('fail',{
                msg:'註冊失敗，請稍後再試',
                url:'/reg'
            })
            return
        }
        res.render('success',{
            msg:"註冊成功",
            url:"/login"
        })
    })
})

//登入頁面
router.get('/login',(req,res)=>{
    res.render('login')
})

//登入
router.post('/login', (req,res)=>{
    let {username, password} = req.body
    UserModel.findOne({
        username: username,
        password: md5(password)
    },(err, data)=>{
        if(err){
            res.status(500)
            res.render('fail',{
                msg:"登入失敗，請稍後再試",
                url:"/login"
            })
            return
        }
        if(!data){
            res.render('fail',{
                msg:"登入失敗，帳號或密碼錯誤",
                url:"/login"
            })
            return
        }
        req.session.username = data.username;
        req.session._id = data._id;
        res.redirect('/account')
    })
})

//退出登入
router.post('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})
module.exports = router;