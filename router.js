let express = require('express')
let db = require('./server/db.js')
let router = express.Router()
let crypto = require('crypto') //加密
let url = '/public/img/'
let secretkey = 'password' //唯一秘钥
let URL = require('url') //解析路径

router.get('/', (req, res) => {
  let parseObj = URL.parse(req.url, true) // 获取 前端传递的参数，并解析成对象
  let pageIndex = parseInt(parseObj.query.page)
    ? parseInt(parseObj.query.page)
    : 1
  let pageSize = parseInt(parseObj.query.limit)
    ? parseInt(parseObj.query.limit)
    : 40
  let info = []
  db.query('select * from main_info', (err, data) => {
    if (err) {
      console.log(er)
    } else {
      db.query(
        'select * from main_info limit ?,?',
        [(pageIndex - 1) * pageSize, pageSize],
        (err2, data2) => {
          if (err2) {
            console.log(err2)
          } else {
            // console.log(data2.length)
            info = data2
            // console.log(info)
            res.render('main', {
              info: info,
              user: req.session.user,
              totalPage: data.length / pageSize,
              url: '',
              page: pageIndex
            })
          }
        }
      )
    }
  })
})

router.get('/good', (req, res) => {
  let parseObj = URL.parse(req.url, true)
  let pageSize = parseInt(parseObj.query.limit)
    ? parseInt(parseObj.query.limit)
    : 40
  let pageIndex = parseInt(parseObj.query.page)
    ? parseInt(parseObj.query.page)
    : 1
  // console.log(pageSize)
  let info = []
  db.query('select * from good_info', [], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      db.query(
        'select * from good_info limit ?,?',
        [(pageIndex - 1) * pageSize, pageSize],
        (err2, data2) => {
          if (err2) {
            console.log(err2)
          } else {
            info = data2
            res.render('main', {
              info: info,
              user: req.session.user,
              page: pageIndex,
              totalPage: data.length / pageSize,
              url: 'good'
            })
          }
        }
      )
    }
  })
})

router.get('/share', (req, res) => {
  let info = []
  let parseObj = URL.parse(req.url, true)
  let pageIndex = parseInt(parseObj.query.page)
    ? parseInt(parseObj.query.page)
    : 1
  let pageSize = parseInt(parseObj.query.pageSize)
    ? parseInt(parseObj.query.pageSize)
    : 40
  db.query('select * from share_info', [], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      db.query(
        'select * from share_info limit ?,?',
        [(pageIndex - 1) * pageSize, pageSize],
        (err2, data2) => {
          if (err2) {
            console.log(err2)
          } else {
            info = data2
            res.render('main', {
              info: info,
              page: pageIndex,
              url: 'share',
              totalPage: data.length / pageSize,
              user: req.session.user
            })
          }
        }
      )
    }
  })
})
router.get('/ask', (req, res) => {
  let info = []
  let parseObj = URL.parse(req.url, true)
  let pageIndex = parseInt(parseObj.query.page)
    ? parseInt(parseObj.query.page)
    : 1
  let pageSize = parseInt(parseObj.query.limit)
    ? parseInt(parseObj.query.limit)
    : 40
  db.query('select * from ask_info', [], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      db.query(
        'select * from ask_info limit ?,?',
        [(pageIndex - 1) * pageSize, pageSize],
        (err2, data2) => {
          if (err2) {
            console.log(err2)
          } else {
            info = data2
            res.render('main', {
              info: info,
              user: req.session.user,
              page: pageIndex,
              totalPage: data.length / pageSize,
              url: 'ask'
            })
          }
        }
      )
    }
  })
})
router.get('/job', (req, res) => {
  let info = []
  let parseObj = URL.parse(req.url, true)
  let pageIndex = parseInt(parseObj.query.page)
    ? parseInt(parseObj.query.page)
    : 1
  let pageSize = parseInt(parseObj.query.limit)
    ? parseInt(parseObj.query.limit)
    : 40
  db.query('select * from job_info', [], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      db.query(
        'select * from job_info limit ?,?',
        [(pageIndex - 1) * pageSize, pageSize],
        (err2, data2) => {
          if (err2) {
            console.log(err2)
          } else {
            info = data2
            res.render('main', {
              info: info,
              user: req.session.user,
              page: pageIndex,
              totalPage: data.length / pageSize,
              url: 'job'
            })
          }
        }
      )
    }
  })
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  let params = req.body
  let cipher = crypto.createCipher('aes192', secretkey) // 使用aes192加密
  let password = cipher.update(params.password, 'utf8', 'hex') // 编码方式从 utf8 转为 hex
  password += cipher.final('hex')
  db.query(
    'select * from user_info where email= ? and password= ? ',
    [params.email, password],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Server Error！'
        })
      } else if (data.length == 0) {
        return res.status(200).json({
          err_code: 1,
          message: '您输入的账号有误，请重新输入！'
        })
      } else {
        req.session.user = data[0]
        res.status(200).json({
          err_code: 0,
          message: '登录成功'
        })
      }
    }
  )
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  let params = req.body
  db.query(
    'select * from user_info where email= ?',
    [params.email],
    (err, data) => {
      if (err) {
        // console.log(1)
        return res.status(500).json({
          err_code: 500,
          message: 'Server Error'
        })
      }
      if (data.length != 0) {
        // console.log(2)
        return res.status(200).json({
          err_code: 1,
          message: '邮箱已存在'
        })
      }
      // console.log(3)
      let cipher = crypto.createCipher('aes192', secretkey) // 使用aes192加密
      let password = cipher.update(params.password, 'utf8', 'hex') // 编码方式从 utf8 转为 hex
      password += cipher.final('hex')
      params.avatar = url + params.avatar
      db.query(
        'insert into user_info values(?,?,?,?)',
        [params.email, password, params.name, params.avatar],
        (err, data) => {
          if (err) {
            // console.log(4)
            return res.status(500).json({
              err_code: 500,
              message: 'Server Error'
            })
          } else {
            // console.log(5)
            req.session.user = params
            res.status(200).json({
              err_code: 0,
              message: '注册成功'
            })
          }
        }
      )
    }
  )
})

router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})

router.get('/userinfo', (req, res) => {
  // console.log(req.session.user)
  let params = req.session.user
  let decipher = crypto.createDecipher('aes192', secretkey)
  let password = decipher.update(params.password, 'hex', 'utf8')
  password += decipher.final('utf8')
  let user = {
    email: params.email,
    password: password,
    avatar: params.avatar,
    name: params.name
  }
  // console.log(password)
  res.render('userinfo', {
    user: user
  })
})

router.post('/updateUserInfo', (req, res) => {
  let params = req.body
  // console.log(params)
  let cipher = crypto.createCipher('aes192', secretkey) // 使用aes192加密
  let password = cipher.update(params.password, 'utf8', 'hex') // 编码方式从 utf8 转为 hex
  password += cipher.final('hex')
  // console.log(password)
  // console.log(params)
  db.query(
    'update user_info set password=? , name=? where email=?',
    [password, params.name, params.email],
    (err, data) => {
      if (err) {
        // console.log(err)
        return res.status(500).json({
          err_code: 500,
          message: 'Server Error'
        })
      } else {
        req.session.user.password = password
        req.session.user.name = params.name
        res.status(200).json({
          err_code: 0,
          message: '更新成功'
        })
      }
    }
  )
})

router.post('/updateUserAvatar', (req, res) => {
  let avatar = url + req.body.avatar
  let email = req.session.user.email
  db.query(
    'update user_info set avatar=? where email=?',
    [avatar, email],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Server Error'
        })
      } else {
        req.session.user.avatar = avatar
        res.status(200).json({
          err_code: 0,
          message: '更新成功'
        })
      }
    }
  )
})

router.get('/search', (req, res) => {
  let parseObj = URL.parse(req.url, true)
  let pageIndex = parseInt(parseObj.query.page)
    ? parseInt(parseObj.query.page)
    : 1
  let pageSize = parseInt(parseObj.query.limit)
    ? parseInt(parseObj.query.limit)
    : 6
  let search = parseObj.query.content
  let info = []
  db.query(
    'select * from main_info where content like ?',
    ['%' + search + '%'],
    (err, data) => {
      if (err) {
        console.log(err)
      } else {
        db.query(
          'select * from main_info where content like ? limit ?,?',
          ['%' + search + '%', (pageIndex - 1) * pageSize, pageSize],
          (err2, data2) => {
            if (err) {
              console.log(err2)
            } else {
              // info = data.slice((pageIndex-1)*pageSize,pageSize*pageIndex)
              info = data2
              res.render('search', {
                info: info,
                totalPage: data.length / pageSize,
                user: req.session.user,
                page: pageIndex,
                result: search
              })
            }
          }
        )
      }
    }
  )
})

module.exports = router
