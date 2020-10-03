import traverse from "@babel/traverse"
import {parse} from "@babel/parser"
import generate from '@babel/generator'

import fs from 'fs'

const code = fs.readFileSync('codes/code1.js', 'utf-8')
let ast = parse(code)
traverse(ast, {
  enter(path) {
    let node = path.node
    if (node.type === 'NumericLiteral' && node.value === 3) {
      node.value = 5
    }
    if (node.type === 'StringLiteral' && node.value === 'hello') {
      node.value = 'hi'
    }
  }
})

const output = generate(ast, {
  retainLines: true,
}).code
console.log(output)

