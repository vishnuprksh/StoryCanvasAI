import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Idea, InsertIdea } from "@shared/schema";
import IdeaCategory from "./IdeaCategory";
import { useToast } from "@/hooks/use-toast";

type CategoryMap = Record<string, Idea[]>;

interface IdeasPanelProps {
  storyId: number;
}

export default function IdeasPanel({ storyId }: IdeasPanelProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch ideas for this story
  const { data: ideas = [], isLoading, error } = useQuery({
    queryKey: [`/api/stories/${storyId}/ideas`],
    enabled: !!storyId,
  });

  // Group ideas by category
  const groupedIdeas: CategoryMap = (ideas as Idea[]).reduce((acc: CategoryMap, idea: Idea) => {
    if (!acc[idea.category]) {
      acc[idea.category] = [];
    }
    acc[idea.category].push(idea);
    return acc;
  }, {});

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

  // Update idea status (active/inactive)
  const updateIdeaMutation = useMutation({
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

  const handleAddNewIdea = (category: string, name: string, description: string) => {
    addIdeaMutation.mutate({
      category,
      name,
      description,
      isActive: true,
    });
  };

  const handleToggleIdea = (id: number, isActive: boolean) => {
    updateIdeaMutation.mutate({ id, isActive });
  };

  const handleDeleteIdea = (id: number) => {
    deleteIdeaMutation.mutate(id);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // Create a sample idea in the new category
      addIdeaMutation.mutate({
        category: newCategoryName.trim(),
        name: "New Idea",
        description: "Description of your new idea",
        isActive: true,
      });
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  if (isLoading) {
    return (
      <div className="border-t lg:border-t-0 lg:border-l border-gray-200 w-full lg:w-80 xl:w-96 bg-white overflow-auto p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t lg:border-t-0 lg:border-l border-gray-200 w-full lg:w-80 xl:w-96 bg-white overflow-auto p-8">
        <div className="text-red-500">Error loading ideas: {String(error)}</div>
      </div>
    );
  }

  return (
    <div className="border-t lg:border-t-0 lg:border-l border-gray-200 w-full lg:w-80 xl:w-96 bg-white overflow-auto" id="ideas-panel">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Story Ideas</h2>
        <button 
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          onClick={() => toast({
            title: "Add new idea",
            description: "Select a category below and click the + button to add a new idea"
          })}
        >
          <i className="ri-add-line mr-1"></i>
          New Idea
        </button>
      </div>
      
      <div className="p-4">
        {Object.entries(groupedIdeas).map(([category, ideas]) => (
          <IdeaCategory
            key={category}
            category={category}
            ideas={ideas}
            onAddIdea={handleAddNewIdea}
            onToggleIdea={handleToggleIdea}
            onDeleteIdea={handleDeleteIdea}
          />
        ))}
        
        {isAddingCategory ? (
          <div className="mt-4">
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              autoFocus
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                className="text-gray-500 text-sm"
                onClick={() => setIsAddingCategory(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-600 text-white px-3 py-1 rounded text-sm"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full border border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center mt-4"
            onClick={() => setIsAddingCategory(true)}
          >
            <i className="ri-add-line mr-2"></i>
            Add new category
          </button>
        )}
      </div>
    </div>
  );
}
