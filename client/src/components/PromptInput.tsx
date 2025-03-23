import { useState } from "react";

interface PromptInputProps {
  onGenerate: (prompt: string, useIdeas: boolean, style: "detailed" | "concise" | "poetic") => void;
  isGenerating: boolean;
}

export default function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [useIdeas, setUseIdeas] = useState(true);
  const [style, setStyle] = useState<"detailed" | "concise" | "poetic">("detailed");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, useIdeas, style);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-start space-x-4">
        <div className="flex-1">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-1">
            Continue the story...
          </label>
          <textarea
            id="prompt-input"
            rows={3}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-serif"
            placeholder="Describe what happens next..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="use-ideas"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={useIdeas}
                onChange={(e) => setUseIdeas(e.target.checked)}
                disabled={isGenerating}
              />
              <label htmlFor="use-ideas" className="ml-2 block text-sm text-gray-700">
                Use saved ideas
              </label>
            </div>
            <div className="flex items-center">
              <select
                className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                disabled={isGenerating}
              >
                <option value="detailed">Detailed</option>
                <option value="concise">Concise</option>
                <option value="poetic">Poetic</option>
              </select>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center self-end ${
            isGenerating || !prompt.trim() ? "opacity-75 cursor-not-allowed" : ""
          }`}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <i className="ri-loader-2-line animate-spin mr-1.5"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="ri-quill-pen-line mr-1.5"></i>
              Generate
            </>
          )}
        </button>
      </form>
    </div>
  );
}
