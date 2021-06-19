import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import fs from "fs";

const code = fs.readFileSync("codes/code1.js", "utf-8");
let ast = parse(code);
traverse(ast, {
  CallExpression(path) {
    let node = path.node;
    if (
      node.callee.object.name === "console" &&
      node.callee.property.name === "log"
    ) {
      path.remove();
    }
  },
});
const { code: output } = generate(ast, {
  retainLines: true,
});
console.log(output);
