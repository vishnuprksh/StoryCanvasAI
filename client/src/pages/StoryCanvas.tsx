import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import EditorPanel from "@/components/EditorPanel";
import IdeasPanel from "@/components/IdeasPanel";
import Footer from "@/components/Footer";
import { Story } from "@shared/schema";

export default function StoryCanvas() {
  // Fetch the current story (for now just use the first story)
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['/api/stories/1'],
    refetchOnMount: true
  });

  // Track word count for the footer
  const [wordCount, setWordCount] = useState<number>(0);
  
  // Track last saved timestamp
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update word count when the story changes
  useEffect(() => {
    if (story) {
      setWordCount(story.wordCount || 0);
    }
  }, [story]);

  const handleContentChange = (content: string) => {
    // Very basic word count calculation (could be improved)
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleSave = () => {
    setLastSaved(new Date());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-600">
          Loading your story...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">
          Error loading story: {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSave={handleSave} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <EditorPanel 
          story={story as Story} 
          onContentChange={handleContentChange}
          onSave={handleSave}
        />
        <IdeasPanel storyId={(story as Story)?.id} />
      </main>
      
      <Footer wordCount={wordCount} lastSaved={lastSaved} />
    </div>
  );
}
