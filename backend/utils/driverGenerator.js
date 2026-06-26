// backend/utils/driverGenerator.js

function generateJSDriver(userCode, meta) {
  let driver = `
// --- DRIVER CODE ---
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (lines.length > 0 && lines[0] !== '') {
    let lineIdx = 0;
    while (lineIdx < lines.length) {
        const args = [];
`;
  for (let i = 0; i < meta.params.length; i++) {
    driver += `        args.push(JSON.parse(lines[lineIdx++]));\n`;
  }
  driver += `        const result = ${meta.name}(...args);\n`;
  driver += `        console.log(JSON.stringify(result).replace(/\\s/g, ''));\n`;
  driver += `    }\n}\n`;
  return userCode + '\n' + driver;
}

function generatePythonDriver(userCode, meta) {
  // LeetCode Python snippets usually require List, Dict, etc.
  const prep = `from typing import *\nimport json\nimport sys\n\n`;
  let driver = `
# --- DRIVER CODE ---
lines = sys.stdin.read().strip().split('\\n')
if lines and lines[0]:
    line_idx = 0
    while line_idx < len(lines):
        args = []
`;
  for (let i = 0; i < meta.params.length; i++) {
    driver += `        args.append(json.loads(lines[line_idx])); line_idx += 1\n`;
  }
  driver += `        sol = Solution()\n`;
  driver += `        res = sol.${meta.name}(*args)\n`;
  driver += `        print(json.dumps(res, separators=(',', ':')))\n`;
  return prep + userCode + '\n' + driver;
}

function generateCppDriver(userCode, meta) {
  const prep = `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <unordered_map>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\n`;
  let driver = `
// --- DRIVER CODE ---
vector<int> __parse_integer_array(string s) {
    vector<int> res;
    string temp = "";
    for (char c : s) {
        if (c == '[' || c == ']' || c == ' ' || c == '"') continue;
        if (c == ',') { if (!temp.empty()) { res.push_back(stoi(temp)); temp = ""; } }
        else { temp += c; }
    }
    if (!temp.empty()) res.push_back(stoi(temp));
    return res;
}
vector<string> __parse_string_array(string s) {
    vector<string> res;
    string temp = "";
    bool in_quote = false;
    for (char c : s) {
        if (c == '"') {
            if (in_quote) { res.push_back(temp); temp = ""; in_quote = false; }
            else { in_quote = true; }
        } else if (in_quote) { temp += c; }
    }
    return res;
}
string __serialize_integer_array(vector<int>& v) {
    string res = "[";
    for (int i=0; i<v.size(); i++) {
        res += to_string(v[i]);
        if (i < v.size()-1) res += ",";
    }
    res += "]";
    return res;
}
string __serialize_string_array(vector<string>& v) {
    string res = "[";
    for (int i=0; i<v.size(); i++) {
        res += "\\"" + v[i] + "\\"";
        if (i < v.size()-1) res += ",";
    }
    res += "]";
    return res;
}
int main() {
    string line;
    while(getline(cin, line)) {
        if(line.empty()) continue;
`;
  
  for (let i = 0; i < meta.params.length; i++) {
    const p = meta.params[i];
    if (p.type === 'integer[]') {
      driver += `        vector<int> p${i} = __parse_integer_array(line);\n`;
    } else if (p.type === 'string[]') {
      driver += `        vector<string> p${i} = __parse_string_array(line);\n`;
    } else if (p.type === 'integer') {
      driver += `        int p${i} = stoi(line);\n`;
    } else if (p.type === 'string') {
      driver += `        string p${i} = line; if(p${i}.size()>=2 && p${i}.front()=='"' && p${i}.back()=='"') p${i} = p${i}.substr(1, p${i}.size()-2);\n`;
    } else if (p.type === 'boolean') {
      driver += `        bool p${i} = (line == "true" || line == "1");\n`;
    } else if (p.type === 'double') {
      driver += `        double p${i} = stod(line);\n`;
    } else {
      // Fallback for unsupported types, just read as string to avoid compile errors
      driver += `        string p${i} = line;\n`;
    }
    
    if (i < meta.params.length - 1) {
      driver += `        getline(cin, line);\n`;
    }
  }
  
  driver += `        Solution sol;\n`;
  const callArgs = meta.params.map((p, i) => `p${i}`).join(', ');
  
  if (meta.return && meta.return.type === 'integer[]') {
    driver += `        vector<int> ret = sol.${meta.name}(${callArgs});\n`;
    driver += `        cout << __serialize_integer_array(ret) << endl;\n`;
  } else if (meta.return && meta.return.type === 'string[]') {
    driver += `        vector<string> ret = sol.${meta.name}(${callArgs});\n`;
    driver += `        cout << __serialize_string_array(ret) << endl;\n`;
  } else if (meta.return && meta.return.type === 'boolean') {
    driver += `        bool ret = sol.${meta.name}(${callArgs});\n`;
    driver += `        cout << (ret ? "true" : "false") << endl;\n`;
  } else {
    driver += `        auto ret = sol.${meta.name}(${callArgs});\n`;
    driver += `        cout << ret << endl;\n`;
  }
  
  driver += `    }\n    return 0;\n}\n`;
  
  return prep + userCode + '\n' + driver;
}

function generateJavaDriver(userCode, meta) {
  const prep = `import java.util.*;\nimport java.io.*;\n\n`;
  
  let driver = `
// --- DRIVER CODE ---
public class Main {
    public static List<Integer> __parse_integer_array(String s) {
        List<Integer> res = new ArrayList<>();
        StringBuilder temp = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '[' || c == ']' || c == ' ' || c == '"') continue;
            if (c == ',') {
                if (temp.length() > 0) { res.add(Integer.parseInt(temp.toString())); temp.setLength(0); }
            } else { temp.append(c); }
        }
        if (temp.length() > 0) res.add(Integer.parseInt(temp.toString()));
        return res;
    }
    
    public static int[] __parse_integer_array_primitive(String s) {
        List<Integer> list = __parse_integer_array(s);
        int[] arr = new int[list.size()];
        for(int i=0; i<list.size(); i++) arr[i] = list.get(i);
        return arr;
    }

    public static String __serialize_integer_array(int[] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i=0; i<arr.length; i++) {
            sb.append(arr[i]);
            if (i < arr.length-1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
    
    public static String __serialize_integer_list(List<Integer> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i=0; i<list.size(); i++) {
            sb.append(list.get(i));
            if (i < list.size()-1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line;
        while ((line = br.readLine()) != null) {
            if (line.trim().isEmpty()) continue;
`;
  
  for (let i = 0; i < meta.params.length; i++) {
    const p = meta.params[i];
    if (p.type === 'integer[]') {
      driver += `            int[] p${i} = __parse_integer_array_primitive(line);\n`;
    } else if (p.type === 'integer') {
      driver += `            int p${i} = Integer.parseInt(line);\n`;
    } else if (p.type === 'string') {
      driver += `            String p${i} = line; if(p${i}.length()>=2 && p${i}.startsWith("\\"") && p${i}.endsWith("\\"")) p${i} = p${i}.substring(1, p${i}.length()-1);\n`;
    } else if (p.type === 'boolean') {
      driver += `            boolean p${i} = line.equals("true") || line.equals("1");\n`;
    } else if (p.type === 'double') {
      driver += `            double p${i} = Double.parseDouble(line);\n`;
    } else {
      driver += `            String p${i} = line;\n`; // Fallback
    }
    
    if (i < meta.params.length - 1) {
      driver += `            line = br.readLine();\n`;
    }
  }
  
  driver += `            Solution sol = new Solution();\n`;
  const callArgs = meta.params.map((p, i) => `p${i}`).join(', ');
  
  if (meta.return && meta.return.type === 'integer[]') {
    driver += `            int[] ret = sol.${meta.name}(${callArgs});\n`;
    driver += `            System.out.println(__serialize_integer_array(ret));\n`;
  } else if (meta.return && meta.return.type === 'list<integer>') {
    driver += `            List<Integer> ret = sol.${meta.name}(${callArgs});\n`;
    driver += `            System.out.println(__serialize_integer_list(ret));\n`;
  } else {
    driver += `            System.out.println(sol.${meta.name}(${callArgs}));\n`;
  }
  
  driver += `        }\n    }\n}\n`;

  // Java userCode usually is `class Solution { ... }`. We must not put it inside Main.
  return prep + userCode + '\n' + driver;
}

module.exports = function generateDriver(language, userCode, metaDataStr) {
  if (!metaDataStr) return userCode;
  
  let meta;
  try {
    meta = JSON.parse(metaDataStr);
  } catch (e) {
    return userCode;
  }
  
  if (!meta || !meta.name || !meta.params) return userCode;
  
  // If we encounter a complex type like ListNode, fallback to standard IO
  // because we don't have deserializers for them.
  const complexTypes = ['ListNode', 'TreeNode', 'list<ListNode>', 'list<TreeNode>'];
  const hasComplexParam = meta.params.some(p => complexTypes.includes(p.type));
  const hasComplexReturn = meta.return && complexTypes.includes(meta.return.type);
  if (hasComplexParam || hasComplexReturn) {
    return userCode;
  }

  switch (language.toLowerCase()) {
    case 'javascript': return generateJSDriver(userCode, meta);
    case 'python':     return generatePythonDriver(userCode, meta);
    case 'cpp':        return generateCppDriver(userCode, meta);
    case 'java':       return generateJavaDriver(userCode, meta);
    default:           return userCode;
  }
};
