import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code6.js", "utf-8");
let ast = parse(code);

traverse(ast, {
  VariableDeclarator(path) {
    // var定义的三元表达式转if-else
    let { id, init } = path.node;
    if (!types.isConditionalExpression(init)) return;

    const ParentPath = path.parentPath;
    const ParentNode = path.parent;
    if (!types.isVariableDeclaration(ParentNode)) return;

    if (types.isForStatement(ParentPath.parentPath)) return;

    let kind = ParentNode.kind;
    let { test, consequent, alternate } = init;
    ParentPath.replaceWith(
      types.ifStatement(
        test,
        types.blockStatement([
          types.variableDeclaration(kind, [types.variableDeclarator(id, consequent)]),
        ]),
        types.blockStatement([
          types.variableDeclaration(kind, [types.variableDeclarator(id, alternate)]),
        ])
      )
    );
  },
});

const { code: output } = generate(ast);
console.log(output);
