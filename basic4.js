import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import fs from "fs";

const code = fs.readFileSync("codes/code1.js", "utf-8");
let ast = parse(code);
traverse(ast, {
  NumericLiteral(path) {
    if (path.node.value === 3) {
      path.node.value = 5;
    }
  },
  StringLiteral(path) {
    if (path.node.value === "hello") {
      path.node.value = "hi";
    }
  },
});
const { code: output } = generate(ast, {
  retainLines: true,
});
console.log(output);
