var express = require('express');
var router = express.Router();
const AccountModel = require('../../models/AccountModel');
const jwt = require('jsonwebtoken');

//檢測登入中間件
let checkTokenMiddleware = (req,res,next) => {
  let token = req.get('token')
  if(!token){
    return res.json({
      code:'2003',
      msg:'token缺失',
      data:null
    })
  }

  jwt.verify(token,'atguigu',(err,data)=>{
    if(err){
      return res.json({
        code:'2004',
        msg:'token校驗失敗',
        data:null
      })
    }
    req.user = data
    next()
  })
  

}


/* GET home page. */
router.get('/account',checkTokenMiddleware, function (req, res, next) {
  //獲取帳單信息
  console.log(req.user)
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.json({
        code: '1001',
        msg: "讀取失敗",
        data: null
      })
      return
    }
    res.json({
      code: '0000',
      msg: '讀取成功',
      data: data
    })

  })

});



//添加紀錄
router.post('/account',checkTokenMiddleware, (req, res) => {
  console.log(req.body)

  let time = new Date(req.body.time)
  let type = Number(req.body.type)
  let amount = Number(req.body.amount)

  //新增資料
  AccountModel.create({
    title: req.body.title,
    time: time,
    type: type,
    amount: amount,
    remark: req.body.remark
  }, (err, data) => {
    if (err) {
      res.json({
        code: "1002",
        msg: "添加失敗",
        data: null
      })
      return
    }
    res.json({
      code: '0000',
      msg: "添加成功",
      data: data
    })
  })

})

//獲取單個帳單
router.get('/account/:id',checkTokenMiddleware, (req, res) => {
  let { id } = req.params
  AccountModel.findById(id, (err, data) => {
    if (err) {
      return res.json({
        code: "1004",
        msg: "讀取失敗",
        data: null
      })
    }
    res.json({
      code: "0000",
      msg: "讀取成功",
      data: data
    })
  })
})

//更新單個帳單
router.patch('/account/:id',checkTokenMiddleware, (req, res) => {
  let { id } = req.params
  let time = new Date(req.body.time)
  let type = Number(req.body.type)
  let amount = Number(req.body.amount)
  AccountModel.updateOne({ _id: id }, {
    title: req.body.title,
    time: time,
    type: type,
    amount: amount,
    remark: req.body.remark
  }, (err, data) => {
    if (err) {
      return res.json({
        code: "1005",
        msg: "更新失敗",
        data: null
      })
    }
    res.json({
      code: "0000",
      msg: "更新成功",
      data: data
    })
  })
})


//刪除
router.delete('/account/:id',checkTokenMiddleware, (req, res) => {
  let id = req.params.id
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.json({
        code: "1003",
        msg: "刪除失敗",
        data: null
      })
      return
    }
    res.json({
      code: "0000",
      msg: "刪除成功",
      data: {}
    })
  })

})
module.exports = router;