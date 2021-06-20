import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as types from "@babel/types";
import fs from "fs";

const code = fs.readFileSync("obfuscates/code5.js", "utf-8");
let ast = parse(code);

traverse(ast, {
  WhileStatement(path) {
    // 反控制流平坦化
    var node = path.node;
    // 判断是否是目标节点
    if (
      !(types.isBooleanLiteral(node.test) || types.isUnaryExpression(node.test))
    )
      // 如果while中不为true或!![]
      return;
    if (!(node.test.prefix || node.test.value))
      // 如果while中的值不为true
      return;
    if (!types.isBlockStatement(node.body)) return;
    var body = node.body.body;
    if (
      !types.isSwitchStatement(body[0]) ||
      !types.isMemberExpression(body[0].discriminant) ||
      !types.isBreakStatement(body[1])
    )
      return;

    // 获取数组名及自增变量名
    var swithStm = body[0];
    var arrName = swithStm.discriminant.object.name;
    var argName = swithStm.discriminant.property.argument.name;
    let arr = [];

    // 找到path节点的前一个兄弟节点，即数组所在的节点，然后获取数组
    let all_presibling = path.getAllPrevSiblings();
    // console.log(all_presibling)
    all_presibling.forEach((pre_path) => {
      const { declarations } = pre_path.node;
      let { id, init } = declarations[0];
      if (arrName == id.name) {
        // 数组节点
        arr = init.callee.object.value.split("|");
        pre_path.remove();
      }
      if (argName == id.name) {
        // 自增变量节点
        pre_path.remove();
      }
    });

    // SwitchCase节点集合
    var caseList = swithStm.cases;
    // 存放按正确顺序取出的case节点
    var resultBody = [];
    arr.map((targetIdx) => {
      var targetBody = caseList[targetIdx].consequent;
      // 删除ContinueStatement块(continue语句)
      if (types.isContinueStatement(targetBody[targetBody.length - 1]))
        targetBody.pop();
      resultBody = resultBody.concat(targetBody);
    });
    path.replaceInline(resultBody);
  },
});

const { code: output } = generate(ast);
console.log(output);
