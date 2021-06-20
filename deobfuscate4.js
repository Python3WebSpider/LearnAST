import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code4.js", "utf-8");
let ast = parse(code);

traverse(ast, {
  ExpressionStatement(path) {
    var node = path.node;

    if (!types.isCallExpression(node.expression)) return;

    if (
      node.expression.arguments == undefined ||
      node.expression.callee.params == undefined ||
      node.expression.arguments.length > node.expression.callee.params.length
    )
      return;

    var argumentList = node.expression.arguments;
    var paramList = node.expression.callee.params;
    for (var i = 0; i < argumentList.length; i++) {
      var argumentName = argumentList[i].name;
      var paramName = paramList[i].name;

      path.traverse({
        MemberExpression: function (_path) {
          var _node = _path.node;
          if (
            !types.isIdentifier(_node.object) ||
            _node.object.name !== paramName
          )
            return;

          _node.object.name = argumentName;
        },
      });
    }
    node.expression.arguments = [];
    node.expression.callee.params = [];
  },
});

const { code: output } = generate(ast);
console.log(output);
