let mysql = require('mysql')

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'node_comm'
})

connection.connect()

exports.query = function(sql, params, callback) {
  connection.query(sql, params, (err, data) => {
    callback && callback(err, data)
  })
}