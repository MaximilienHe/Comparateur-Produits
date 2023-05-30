import mysql from 'mysql'

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed: ', error)
  } else {
    console.log('Database connection successful')
  }
})

function query(sql, args = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (error, rows) => {
      if (error) {
        reject(error)
      } else {
        resolve(rows)
      }
    })
  })
}

export default { query }
