const db = require('./db')
const fs = require('fs')

const migration = async () => {
  const connection = await db

  const migrations = fs.readdirSync('./migrations')
  for await (const migration of migrations) {
    const m = require('./migrations/' + migration)
    await m.down(connection)
  }


}

migration()