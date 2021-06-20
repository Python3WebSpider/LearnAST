import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code1.js", "utf-8");
let ast = parse(code);
traverse(ast, {
  StringLiteral({ node }) {
    if (node.extra && /\\[ux]/gi.test(node.extra.raw)) {
      node.extra.rawValue = node.extra.raw;
      // or just set to undefined
      // node.extra = undefined;
    }
  },
});
const { code: output } = generate(ast);
console.log(output);
