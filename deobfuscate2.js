import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code2.js", "utf-8");
let ast = parse(code);

traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (!types.isObjectExpression(init)) return;

    let name = id.name;
    let properties = init.properties;

    let scope = path.scope;
    let binding = scope.getBinding(name);
    if (!binding || binding.constantViolations.length > 0) {
      return;
    }
    let paths = binding.referencePaths;
    paths.map(function (refer_path) {
      let bindpath = refer_path.parentPath;
      if (!types.isVariableDeclarator(bindpath.node)) return;
      let bindname = bindpath.node.id.name;
      bindpath.scope.rename(bindname, name, bindpath.scope.block);
      bindpath.remove();
    });
    scope.traverse(scope.block, {
      AssignmentExpression: function (_path) {
        const left = _path.get("left");
        const right = _path.get("right");
        if (!left.isMemberExpression()) return;
        const object = left.get("object");
        const property = left.get("property");
        if (
          object.isIdentifier({ name: name }) &&
          property.isStringLiteral() &&
          _path.scope == scope
        ) {
          properties.push(
            types.ObjectProperty(
              types.valueToNode(property.node.value),
              right.node
            )
          );
          _path.remove();
        }
        if (
          object.isIdentifier({ name: name }) &&
          property.isIdentifier() &&
          _path.scope == scope
        ) {
          properties.push(
            types.ObjectProperty(
              types.valueToNode(property.node.name),
              right.node
            )
          );
          _path.remove();
        }
      },
    });
  },
});

const { code: output } = generate(ast);
console.log(output);
