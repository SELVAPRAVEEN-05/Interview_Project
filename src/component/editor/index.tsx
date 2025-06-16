"use client";

import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useCallback, useEffect, useState } from "react";
import styles from "./CollaborativeEditor.module.css";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { Cursors } from "../cursors";
import { Toolbar } from "../toolbar";
import { Avatars } from "../avatar";

// Types for output
interface CodeOutput {
  stdout: string;
  stderr: string;
  error?: string;
  exitCode?: number;
}

// Language configurations for different code execution
const LANGUAGE_CONFIGS = {
  c: {
    name: "C",
    fileExtension: ".c",
    compileCommand: "gcc -o output",
    runCommand: "./output",
  },
  cpp: {
    name: "C++",
    fileExtension: ".cpp",
    compileCommand: "g++ -o output",
    runCommand: "./output",
  },
  python: {
    name: "Python",
    fileExtension: ".py",
    runCommand: "python3",
  },
  javascript: {
    name: "JavaScript",
    fileExtension: ".js",
    runCommand: "node",
  },
  java: {
    name: "Java",
    fileExtension: ".java",
    compileCommand: "javac",
    runCommand: "java",
  },
};

// Run Button Component
function RunButton({
  onClick,
  isRunning,
  language,
}: {
  onClick: () => void;
  isRunning: boolean;
  language: string;
}) {
  const config = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS];

  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      className={`
        inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
        transition-all duration-200 min-w-[100px] justify-center
        ${
          isRunning
            ? "bg-orange-500 text-white cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
        }
      `}
    >
      {isRunning ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            ></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            ></path>
          </svg>
          Running...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
          Run {config?.name || language}
        </>
      )}
    </button>
  );
}

// Output Panel Component
function OutputPanel({ output }: { output: CodeOutput | null }) {
  return (
    <div className="h-full flex flex-col bg-gray-900 border-t border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-200">Output</h3>
          {output && (
            <span
              className={`px-2 py-1 text-xs rounded ${
                output.exitCode === 0
                  ? "bg-green-600 text-green-100"
                  : "bg-red-600 text-red-100"
              }`}
            >
              {output.exitCode === 0 ? "Success" : "Error"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {output ? (
          <div className="space-y-4">
            {output.stdout && (
              <div>
                <div className="text-xs text-green-400 font-medium mb-1">
                  STDOUT:
                </div>
                <pre className="text-green-300 text-sm whitespace-pre-wrap bg-gray-800 p-3 rounded">
                  {output.stdout}
                </pre>
              </div>
            )}
            {output.stderr && (
              <div>
                <div className="text-xs text-red-400 font-medium mb-1">
                  STDERR:
                </div>
                <pre className="text-red-300 text-sm whitespace-pre-wrap bg-gray-800 p-3 rounded">
                  {output.stderr}
                </pre>
              </div>
            )}
            {output.error && (
              <div>
                <div className="text-xs text-red-400 font-medium mb-1">
                  ERROR:
                </div>
                <pre className="text-red-300 text-sm whitespace-pre-wrap bg-gray-800 p-3 rounded">
                  {output.error}
                </pre>
              </div>
            )}
            {!output.stdout && !output.stderr && !output.error && (
              <div className="text-gray-400 text-sm italic">No output</div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-sm italic">
            Click "Run" to execute code
          </div>
        )}
      </div>
    </div>
  );
}

// Collaborative code editor with undo/redo, live cursors, live avatars, and run functionality
export function CollaborativeEditor() {
  const room = useRoom();
  const provider = getYjsProviderForRoom(room);
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [language, setLanguage] = useState("c");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<CodeOutput | null>(null);

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let binding: MonacoBinding;

    if (editorRef) {
      const yDoc = provider.getYDoc();
      const yText = yDoc.getText("monaco");

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        provider.awareness as unknown as Awareness
      );
    }

    return () => {
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  // Mock code execution function - replace with your actual execution logic
  const executeCode = useCallback(async () => {
    if (!editorRef) return;

    const code = editorRef.getValue();
    if (!code.trim()) {
      setOutput({ stdout: "", stderr: "No code to execute", exitCode: 1 });
      return;
    }

    setIsRunning(true);

    try {
      // This is a mock implementation
      // Replace this with your actual code execution API call
      const result = await mockCodeExecution(code, language);
      setOutput(result);
    } catch (error) {
      setOutput({
        stdout: "",
        stderr: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        exitCode: 1,
      });
    } finally {
      setIsRunning(false);
    }
  }, [editorRef, language]);

  // Mock execution function - replace with your actual implementation
  const mockCodeExecution = async (
    code: string,
    lang: string
  ): Promise<CodeOutput> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Mock different outputs based on language and code content
    if (code.includes("error") || code.includes("Error")) {
      return {
        stdout: "",
        stderr: "Compilation error: undefined reference to 'error'",
        exitCode: 1,
      };
    }

    if (code.includes("hello") || code.includes("Hello")) {
      return {
        stdout: "Hello, World!\n",
        stderr: "",
        exitCode: 0,
      };
    }

    if (lang === "c" || lang === "cpp") {
      return {
        stdout: "Program executed successfully\n",
        stderr: "",
        exitCode: 0,
      };
    }

    return {
      stdout: `Code executed in ${
        LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.name || lang
      }\n`,
      stderr: "",
      exitCode: 0,
    };
  };

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);
      if (editorRef) {
        const model = editorRef.getModel();
        if (model) {
          // Update the language of the current model
          monaco.editor.setModelLanguage(model, newLanguage);
        }
      }
    },
    [editorRef]
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {provider ? <Cursors yProvider={provider} /> : null}

      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center space-x-4">
          {editorRef ? <Toolbar editor={editorRef} /> : null}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1 text-sm bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>

          {/* Run Button */}
          <RunButton
            onClick={executeCode}
            isRunning={isRunning}
            language={language}
          />
        </div>

        <Avatars />
      </div>

      {/* Main content area - split into two equal halves */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top half - Code Editor */}
        <div className="h-1/2 border-b border-gray-700">
          <Editor
            onMount={handleOnMount}
            height="100%"
            theme="vs-dark"
            language={language}
            defaultValue=""
            options={{
              tabSize: 4,
              padding: { top: 20 },
              fontSize: 14,
              lineNumbers: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Bottom half - Output Panel */}
        <div className="h-1/2">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  );
}
