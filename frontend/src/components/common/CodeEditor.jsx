import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const handleEditorChange = (data) => {
    console.log(data);
  };

  return (
    <div className="p-10 ">
      <Editor
        height="90vh"
        defaultLanguage="cpp"
        defaultValue="#include <iostream>
using namespace std;
                    
int main(){
// write code here

return 0; 

}"
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
