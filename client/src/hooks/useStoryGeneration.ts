import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Idea } from "@shared/schema";

export function useStoryGeneration(storyId: number, onSuccess: (content: string) => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContentMutation = useMutation({
    mutationFn: async (data: {
      prompt: string;
      useIdeas: boolean;
      style: "detailed" | "concise" | "poetic";
    }) => {
      const response = await apiRequest("POST", `/api/stories/${storyId}/generate`, data);
      return response.json();
    },
    onSuccess: (data) => {
      onSuccess(data.generatedContent);
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

  const generateContent = (prompt: string, useIdeas: boolean, style: "detailed" | "concise" | "poetic") => {
    setIsGenerating(true);
    
    generateContentMutation.mutate(
      { prompt, useIdeas, style },
      {
        onSettled: () => {
          // Add a delay to let the animation complete
          setTimeout(() => {
            setIsGenerating(false);
          }, 3000);
        },
      }
    );
  };

  return {
    generateContent,
    isGenerating: isGenerating || generateContentMutation.isPending,
  };
}
