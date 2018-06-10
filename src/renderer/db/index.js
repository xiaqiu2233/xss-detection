import mysql from 'mysql2/promise'

const db = {
  conn: null,
  config: {
    // host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'xss-detection'
  },
  async connect () {
    this.conn = await mysql.createConnection(this.config)
    return this
  },
  async close () {
    await this.conn && this.conn.close()
  },

  async insert (table, data) {
    let keys = Object.keys(data)
    let sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`
    // console.log(sql, Object.values(data))
    var sqlParams = [...Object.values(data)]
    const [result] = await this.conn.query(sql, sqlParams)
    return result
  },

  async query (table, condition, limit) {
    let c = Object.entries(condition).map(item => item.join('=')).join(' AND ')
    let sql = `SELECT * FROM ${table} WHERE ${c} ${limit}`
    const [result] = await this.conn.query(sql)
    return result
  },

  async update (table, data, condition) {
    let c = Object.entries(condition).map(item => item.join('=')).join(' AND ')
    let keys = Object.keys(data)
    let sql = `UPDATE ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')}) WHERE ${c}`
    console.log(sql, Object.values(data))
    var sqlParams = [...Object.values(data)]
    const [result] = await this.conn.query(sql, sqlParams)
    return result
  },

  async getNoneVisitedPages (allPage = false) {
    // let sql = `SELECT * FROM page WHERE inject_points IS null ${allPage ? '' : 'LIMIT 0,1'}`
    let sql = `SELECT * FROM page WHERE visited=0 ${allPage ? '' : 'LIMIT 0,1'}`

    const [result] = await this.conn.query(sql)
    return result
  },

  async updatePageToVisited (url) {
    let sql = `UPDATE page SET visited=? WHERE url=?`
    console.log(sql)
    var sqlParams = [1, url]
    const [result] = await this.conn.query(sql, sqlParams)
    return result
  }

}

export default db
