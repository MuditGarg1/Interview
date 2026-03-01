import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { ChevronDown, Download, Trash2 } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { name: "JavaScript", value: "javascript" },
  { name: "Python", value: "python" },
  { name: "Java", value: "java" },
  { name: "C++", value: "cpp" },
  { name: "C#", value: "csharp" },
  { name: "TypeScript", value: "typescript" },
  { name: "Go", value: "go" },
  { name: "Rust", value: "rust" },
  { name: "SQL", value: "sql" },
  { name: "HTML", value: "html" },
  { name: "CSS", value: "css" },
];

export default function CodeEditor({ socket, roomId, role }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const ignoreUpdateRef = useRef(false);
  const debounceTimerRef = useRef(null);

  const isInterviewer = role === "interviewer" || role === "host";
  const storageKey = `code_${roomId}_${language}`;

  // Load code from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [storageKey]);

  // Socket synchronization
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join-code-room", roomId);

    const onSync = serverCode => {
      ignoreUpdateRef.current = true;
      setCode(serverCode);
      localStorage.setItem(storageKey, serverCode);
      setTimeout(() => {
        ignoreUpdateRef.current = false;
      }, 50);
    };

    const onUpdate = serverCode => {
      ignoreUpdateRef.current = true;
      setCode(serverCode);
      localStorage.setItem(storageKey, serverCode);
      setTimeout(() => {
        ignoreUpdateRef.current = false;
      }, 50);
    };

    socket.on("code-sync", onSync);
    socket.on("code-update", onUpdate);

    return () => {
      socket.emit("leave-code-room", roomId);
      socket.off("code-sync", onSync);
      socket.off("code-update", onUpdate);
    };
  }, [socket, roomId, storageKey]);

  const handleChange = value => {
    const newCode = value || "";
    setCode(newCode);
    
    // Save to localStorage immediately
    localStorage.setItem(storageKey, newCode);

    if (ignoreUpdateRef.current) return;

    // Debounce socket emission to reduce spam (300ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!isInterviewer) {
      debounceTimerRef.current = setTimeout(() => {
        socket.emit("code-change", { roomId, code: newCode });
      }, 300);
    }
  };

  const handleLanguageChange = newLanguage => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = lang => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      typescript: "ts",
      go: "go",
      rust: "rs",
      sql: "sql",
      html: "html",
      css: "css",
    };
    return extensions[lang] || "txt";
  };

  const clearCode = () => {
    if (confirm("Are you sure you want to clear all code?")) {
      setCode("");
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-slate-900/50 to-black/60 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-indigo-500/20 bg-gradient-to-r from-slate-900/80 to-black/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold">
                Editor
              </span>
              <span className="text-[12px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full">
                {isInterviewer ? "📋 READ ONLY" : "✏️ LIVE"}
              </span>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-700/60 transition text-gray-200"
              >
                {SUPPORTED_LANGUAGES.find(l => l.value === language)?.name || "Language"}
                <ChevronDown size={14} />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-full mt-1 left-0 w-32 bg-slate-900/95 border border-slate-700/60 rounded-lg z-50 shadow-xl backdrop-blur">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.value}
                      onClick={() => handleLanguageChange(lang.value)}
                      className={`w-full text-left px-3 py-2 text-sm transition hover:bg-indigo-500/20 ${
                        language === lang.value
                          ? "bg-indigo-500/30 text-indigo-300 font-semibold"
                          : "text-gray-300"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isInterviewer && (
            <div className="flex items-center gap-2">
              <button
                onClick={downloadCode}
                title="Download code"
                className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg transition"
              >
                <Download size={16} />
              </button>
              <button
                onClick={clearCode}
                title="Clear code"
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleChange}
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            minimap: { enabled: true, scale: 2 },
            readOnly: isInterviewer,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            bracketPairColorization: {
              enabled: true,
            },
            "bracketPairColorization.independentColorPoolPerBracketType": true,
          }}
        />
      </div>

      {/* Footer - Line Count & Status */}
      <div className="px-4 py-2 border-t border-indigo-500/20 bg-black/30 text-[11px] text-gray-500 flex items-center justify-between">
        <span>Lines: {code.split("\n").length} | Characters: {code.length}</span>
        {!isInterviewer && <span className="text-indigo-400">● Auto-saving</span>}
      </div>
    </div>
  );
}
