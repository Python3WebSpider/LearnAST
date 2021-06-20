import fs from "fs";
import obfuscator from "javascript-obfuscator";
const code = fs.readFileSync("codes/code3.js", "utf-8");
const options = {
  compact: false,
  controlFlowFlattening: true,
};

function obfuscate(code, options) {
  return obfuscator.obfuscate(code, options).getObfuscatedCode();
}
console.log(obfuscate(code, options));
