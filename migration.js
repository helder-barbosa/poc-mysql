const db = require('./db')
const fs = require('fs')

const initMigration = async (connection) => {
  const [results] = await connection.query(`show tables like 'migration_version'`)

  if (results.length === 0) {
    await connection.query('START TRANSACTION;')
    await connection.query(`
      CREATE TABLE migration_version (
        id INT NOT NULL AUTO_INCREMENT,
        version INT NOT NULL,
        PRIMARY KEY(id)
      );
    `)
    await connection.query('INSERT INTO migration_version (id, version) values (1 , 0)')
    await connection.query('COMMIT;')
  }
}

const getCurrentVersion = async (connection) => {
  const [results] = await connection.query('select * from migration_version where id = 1')
  return results[0].version
}

const migration = async () => {
  const connection = await db
  await initMigration(connection)

  const currentVersion = await getCurrentVersion(connection)
  const targetVersion = 100

  const migrations = fs.readdirSync('./migrations')

  const migrationSorted = migrations
    .map(version => {
      return version.split('.')[0]
    })
    .map(version => parseInt(version))
    .sort((a, b) => {
      if (a > b) {
        return 1
      }
      return -1
    })

  for await (const migration of migrationSorted) {
    if (migration > currentVersion && targetVersion >= migration) {
      const m = require('./migrations/' + migration + '.js')
      await connection.query('START TRANSACTION;')
      if (m.up) {
        await m.up(connection)
      }

      await connection.query('update migration_version set version = ? where id = ?', [migration, 1])
      await connection.query('COMMIT;')

    }

  }


}

migration()