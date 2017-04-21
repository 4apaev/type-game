'use strict';

// const { keys, create } = Object
// const DB = create(null)

const n = 10
const DB = []

module.exports = { add, list }

function add(name, score) {

  if (DB.length < n)
    DB.push({ name, score })
  else {
    for(let i=0; i<n;i++) {
      if (DB[ i ].score <=score ) {
        DB[ i ] = { name, score }
        break;
      }
    }
  }

  return DB.sort((a, b) => b.score - a.score)
}

function list() {
  return DB
}