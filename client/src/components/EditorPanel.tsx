import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Story } from "@shared/schema";
import Editor from "./Editor";
import PromptInput from "./PromptInput";
import { animateText } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";

interface EditorPanelProps {
  story: Story;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

export default function EditorPanel({ story, onContentChange, onSave }: EditorPanelProps) {
  const [title, setTitle] = useState(story?.title || "Untitled Story");
  const [content, setContent] = useState(story?.content || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const generatingContentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
    }
  }, [story]);

  // Update story title and content
  const updateStoryMutation = useMutation({
    mutationFn: async (data: { title?: string; content?: string }) => {
      return await apiRequest("PUT", `/api/stories/${story.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${story.id}`] });
      onSave();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Generate content
  const generateContentMutation = useMutation({
    mutationFn: async (data: { 
      prompt: string; 
      useIdeas: boolean;
      style: "detailed" | "concise" | "poetic";
    }) => {
      const response = await apiRequest(
        "POST", 
        `/api/stories/${story.id}/generate`, 
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.generatedContent);
      
      // Animate the generated content
      if (generatingContentRef.current) {
        animateText(generatingContentRef.current, data.generatedContent);
      }
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: String(error),
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleSaveStory = () => {
    updateStoryMutation.mutate({ title, content });
  };

  const handleGenerate = (prompt: string, useIdeas: boolean, style: "detailed" | "concise" | "poetic") => {
    setIsGenerating(true);
    setGeneratedContent("");
    
    generateContentMutation.mutate(
      { prompt, useIdeas, style },
      {
        onSettled: () => {
          setTimeout(() => {
            setIsGenerating(false);
            
            // After animation is done, append to main content
            const newContent = content + (content.endsWith("</p>") ? '' : '<p>') + generatedContent + (content.endsWith("</p>") ? '' : '</p>');
            handleContentChange(newContent);
            
            // Clear the generated content area
            setGeneratedContent("");
          }, 3500); // Wait for animation to complete
        }
      }
    );
  };

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-auto" id="editor-panel">
      <div className="mb-6 flex items-center justify-between">
        <input 
          type="text" 
          placeholder="Untitled Story" 
          className="text-2xl font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleSaveStory}
        />
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <i className="ri-download-line"></i>
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <i className="ri-share-line"></i>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6 flex items-center overflow-x-auto">
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-bold"></i>
        </button>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-italic"></i>
        </button>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-underline"></i>
        </button>
        <span className="h-6 w-px bg-gray-200 mx-2"></span>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-heading"></i>
        </button>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-list-unordered"></i>
        </button>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-list-ordered"></i>
        </button>
        <span className="h-6 w-px bg-gray-200 mx-2"></span>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-quote-text"></i>
        </button>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-separator"></i>
        </button>
        <span className="h-6 w-px bg-gray-200 mx-2"></span>
        <button className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <i className="ri-format-clear"></i>
        </button>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="prose prose-lg max-w-none font-serif">
          <Editor 
            content={content} 
            onChange={handleContentChange}
            onBlur={handleSaveStory}
          />
          
          {isGenerating && (
            <div 
              ref={generatingContentRef}
              className="border-t border-gray-200 pt-6 opacity-80"
            >
              <p className="typewriter-effect font-serif text-gray-700"></p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Input Area */}
      <PromptInput 
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}
