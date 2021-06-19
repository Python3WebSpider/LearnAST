import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";

const code = "const a = 1;";
let ast = parse(code);
traverse(ast, {
  VariableDeclaration(path) {
    let init = types.binaryExpression(
      "+",
      types.identifier("a"),
      types.numericLiteral(1)
    );
    let declarator = types.variableDeclarator(types.identifier("b"), init);
    let declaration = types.variableDeclaration("const", [declarator]);
    path.insertAfter(declaration);
    path.stop();
  },
});
const { code: output } = generate(ast, {
  retainLines: true,
});
console.log(output);
