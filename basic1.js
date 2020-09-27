import {parse} from '@babel/parser'

const fs = require('fs')

const code = fs.readFileSync('codes/code1.js', {
  encoding: 'utf-8'
})
let ast = parse(code)
console.log(ast)