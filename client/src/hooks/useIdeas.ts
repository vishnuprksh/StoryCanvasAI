import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Idea, InsertIdea } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useIdeas(storyId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch ideas for this story
  const {
    data: ideas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/stories/${storyId}/ideas`],
    enabled: !!storyId,
  });

  // Group ideas by category
  const groupedIdeas = (ideas as Idea[]).reduce(
    (acc: Record<string, Idea[]>, idea: Idea) => {
      if (!acc[idea.category]) {
        acc[idea.category] = [];
      }
      acc[idea.category].push(idea);
      return acc;
    },
    {}
  );

  // Get active ideas
  const activeIdeas = (ideas as Idea[]).filter((idea) => idea.isActive);

  // Add new idea
  const addIdeaMutation = useMutation({
    mutationFn: async (idea: Omit<InsertIdea, "storyId">) => {
      return await apiRequest("POST", `/api/ideas`, {
        ...idea,
        storyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}/ideas`] });
      toast({
        title: "Idea added",
        description: "Your idea has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add idea: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Toggle idea active status
  const toggleIdeaMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await apiRequest("PUT", `/api/ideas/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}/ideas`] });
    },
  });

  // Delete idea
  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/ideas/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}/ideas`] });
      toast({
        title: "Idea deleted",
        description: "Your idea has been removed",
      });
    },
  });

  return {
    ideas: ideas as Idea[],
    groupedIdeas,
    activeIdeas,
    isLoading,
    error,
    addIdea: (idea: Omit<InsertIdea, "storyId">) => addIdeaMutation.mutate(idea),
    toggleIdea: (id: number, isActive: boolean) => toggleIdeaMutation.mutate({ id, isActive }),
    deleteIdea: (id: number) => deleteIdeaMutation.mutate(id),
    isPendingAdd: addIdeaMutation.isPending,
    isPendingToggle: toggleIdeaMutation.isPending,
    isPendingDelete: deleteIdeaMutation.isPending,
  };
}
