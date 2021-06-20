import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code8.js", "utf-8");
let ast = parse(code);

traverse(ast, {
  "IfStatement|ConditionalExpression"(path) {
    let { consequent, alternate } = path.node;
    let testPath = path.get("test");
    const evaluateTest = path.evaluateTruthy();
    if (evaluateTest === true) {
      path.replaceWithMultiple(consequent);
    } else if (evaluateTest === false) {
      if (alternate != null) {
        path.replaceWithMultiple(alternate);
      } else {
        path.remove();
      }
    }
  },
  EmptyStatement(path) {
    path.remove();
  },
  "VariableDeclarator|FunctionDeclaration"(path) {
    //在setTimeout函数或者eval函数里无法检测是否被引用，所以慎用。
    let { node, scope } = path;
    let binding = scope.getBinding(node.id.name);
    if (binding && !binding.referenced && binding.constant) {
      //没有被引用，也没有被改变
      path.remove();
    }
  },
});

const { code: output } = generate(ast);
console.log(output);
