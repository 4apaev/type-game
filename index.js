'use strict';

global.log = console.log.bind(console)

const { PORT=5000 } = process.env;
const Fs = require('fs')
const DB = require('./db')
const app = require('miniserver')()

app
  .use(require('miniserver/middleware/logger')('statusCode', 'method', 'url'))
  .post(require('miniserver/middleware/body'))

  .get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    Fs.createReadStream('./index.html').pipe(res)
  })

  .get('/score', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
        ok: true,
        result: DB.list()
      }))
  })

  .post('/score', (req, res) => {
    let out, code;
    const { name='', score=-1 } = req.body

    if (validate(name, score)) {
      DB.add(name, score)
      code = 200
      out = {
        ok: true,
        result: DB.list()
      }
    } else {
      code = 400
      out = { ok: false }
    }

    res.writeHead(code, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(out))

  })

  .get(require('miniserver/middleware/static')())

app.listen(PORT, () => log(`running on localhost:${ PORT }`))


function validate(name, score) {
    return 'string'===typeof name
      && name.length > 1
      && name.length < 50
      && /[A-z]/.test(name)

      && score===0|score
      && score > -1
      && isFinite(score);
  }