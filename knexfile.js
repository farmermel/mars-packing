module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/mars_packing',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    setNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/mars_packing_test',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    setNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    setNullAsDefault: true
  }
};