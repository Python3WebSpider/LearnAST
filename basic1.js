import { parse } from "@babel/parser";
import fs from "fs";

const code = fs.readFileSync("codes/code1.js", "utf-8");
let ast = parse(code);
console.log(ast);
console.log(ast.program.body);
