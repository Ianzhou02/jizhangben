var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel')
const md5 = require('md5')
const jwt = require('jsonwebtoken')


//登入
router.post('/login', (req,res)=>{
    let {username, password} = req.body
    UserModel.findOne({
        username: username,
        password: md5(password)
    },(err, data)=>{
        if(err){
            res.json({
                code:'2001',
                msg:'數據庫讀取失敗',
                data:null
            })
            return
        }
        if(!data){
            res.json({
                code:'2001',
                msg:'用戶名或密碼錯誤',
                data:null
            })
            return
        }

        let token = jwt.sign({
            username: data.username,
            _id: data._id
        },'atguigu',{
            expiresIn:60*60*24
        })

        res.json(
            {
                code: '0000',
                msg:"登入成功",
                data:token
            }
        )
    })
})

//退出登入
router.post('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})
module.exports = router;