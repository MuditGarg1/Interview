import { useRef, useState } from "react";

const AIInterviewSetup = () => {
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !role) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {
      await fetch("/api/interview/setup", {
        method: "POST",
        body: formData,
      });

      alert("Resume analyzed! You can start the interview now.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-zinc-900 rounded-2xl border border-zinc-700">
      <h2 className="text-xl font-semibold text-white mb-1">
        AI Interview Setup
      </h2>

      <p className="text-sm text-zinc-400 mb-6">
        Upload your resume and choose your interview role.
      </p>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box */}
      <div
        onClick={() => fileRef.current.click()}
        className="cursor-pointer border-2 border-dashed border-zinc-600 rounded-xl p-6 text-center hover:border-blue-500 transition"
      >
        <p className="text-zinc-300 font-medium">
          {file ? file.name : "Click to upload resume"}
        </p>
        <p className="text-xs text-zinc-500 mt-1">PDF only</p>
      </div>

      {/* Role Selection */}
      <div className="mt-4">
        <label className="text-sm text-zinc-300 block mb-1">
          Interview Role
        </label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2"
        >
          <option value="">Select role</option>
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="fullstack">Full Stack Developer</option>
          <option value="data">Data Scientist</option>
          <option value="devops">DevOps Engineer</option>
        </select>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!file || !role || loading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white py-2 rounded-xl transition"
      >
        {loading ? "Analyzing Resume..." : "Start Interview"}
      </button>
    </div>
  );
};

export default AIInterviewSetup;
