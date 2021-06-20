import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code7.js", "utf-8");
let ast = parse(code);

traverse(ast, {
  "UnaryExpression|BinaryExpression|ConditionalExpression|CallExpression": (
    path
  ) => {
    // 常量计算
    if (path.type == "UnaryExpression") {
      const { operator, argument } = path.node;
      if (operator == "-" && types.isLiteral(argument)) {
        return;
      }
    }
    const { confident, value } = path.evaluate();
    // 无限计算则退出，如1/0与-(1/0)
    if (value == Infinity || value == -Infinity) return;
    confident && path.replaceWith(types.valueToNode(value));
  },
});

const { code: output } = generate(ast);
console.log(output);
