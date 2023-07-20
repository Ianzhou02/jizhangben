var express = require('express');
var router = express.Router();
const AccountModel = require('../../models/AccountModel')

//檢測登入中間件
let checkLoginMiddleware = (req,res,next) =>{
  if(!req.session.username){
    return res.redirect("/login")
  }
  next()
}


//首頁
router.get('/',(req,res)=>{
  res.redirect('/account')
})

//帳本頁面
router.get('/account',checkLoginMiddleware, function (req, res, next) {
  //獲取帳單信息
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.status(500).render('fail', {
        msg: '顯示失敗~~',
        url: '/account'
      })
      return
    }
    //轉換data資料
    let data2 = []
    data.forEach((item) => {
      data2.push({
        title: item.title,
        time: item.time.toLocaleDateString(),
        type: item.type.toString(),
        amount: item.amount,
        remark: item.remark,
        id: item._id
      })
    })
    res.render('list', { accounts: data2 })

  })

});

//添加帳本頁面
router.get('/account/create',checkLoginMiddleware, function (req, res, next) {

  res.render('create')
});

//添加紀錄
router.post('/account',checkLoginMiddleware, (req, res) => {
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
      res.status(500).render('fail', {
        msg: '添加失敗~~',
        url: '/account'
      })
      return
    }
    res.render('success', {
      msg: '添加成功~~',
      url: '/account'
    })
  })

})

//刪除
router.get('/account/:id',checkLoginMiddleware, (req, res) => {
  let id = req.params.id
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).render('fail', {
        msg: '刪除失敗~~',
        url: '/account'
      })
      return
    }
    res.render('success', {
      msg: '刪除成功~~',
      url: '/account'
    })
  })
})

//更新帳單頁面
router.get('/account/update/:id',checkLoginMiddleware, (req, res) => {
  let { id } = req.params
  AccountModel.findById(id, (err, data) => {
    if (err) {
      res.status(500).render('fail', {
        msg: '讀取失敗~~',
        url: '/account'
      })
      return
    }
    let data2 = {
      id: data._id,
      title: data.title,
      time: data.time.toLocaleDateString(),
      type: data.type.toString(),
      amount: data.amount,
      remark: data.remark
    }
    res.render('update', {
      item: data2
    })
  })
})

//更新單個帳單
router.post('/account/:id',checkLoginMiddleware, (req, res) => {

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
      res.status(500).render('fail', {
        msg: '更新失敗~~',
        url: '/account'
      })
      return
    }
    res.render('success', {
      msg: '更新成功~~',
      url: '/account'
    })
  })

})
module.exports = router;