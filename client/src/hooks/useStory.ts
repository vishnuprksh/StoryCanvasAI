import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Story } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useStory(storyId: number) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch story
  const { data: story, isLoading, error } = useQuery({
    queryKey: [`/api/stories/${storyId}`],
    enabled: !!storyId,
  });

  // Update story
  const updateStoryMutation = useMutation({
    mutationFn: async (data: { title?: string; content?: string }) => {
      return await apiRequest("PUT", `/api/stories/${storyId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}`] });
      setLastSaved(new Date());
      toast({ title: "Success", description: "Story saved successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save story: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Update state when story changes
  useEffect(() => {
    if (story) {
      setContent(story.content || "");
      setTitle(story.title || "Untitled Story");
      setWordCount(story.wordCount || 0);
    }
  }, [story]);

  // Calculate word count
  const updateWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, " ");
    const words = plainText.split(/\s+/).filter((word) => word.length > 0);
    return words.length;
  };

  // Update content and recalculate word count
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const newWordCount = updateWordCount(newContent);
    setWordCount(newWordCount);
  };

  // Save story
  const saveStory = () => {
    updateStoryMutation.mutate({
      title,
      content,
      wordCount,
    });
  };

  return {
    story,
    isLoading,
    error,
    content,
    title,
    wordCount,
    lastSaved,
    isPending: updateStoryMutation.isPending,
    setTitle,
    handleContentChange,
    saveStory,
  };
}
