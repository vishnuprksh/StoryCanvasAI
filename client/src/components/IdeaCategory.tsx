import { useState } from "react";
import IdeaItem from "./IdeaItem";
import { Idea } from "@shared/schema";

interface IdeaCategoryProps {
  category: string;
  ideas: Idea[];
  onAddIdea: (category: string, name: string, description: string) => void;
  onToggleIdea: (id: number, isActive: boolean) => void;
  onDeleteIdea: (id: number) => void;
}

export default function IdeaCategory({ 
  category, 
  ideas, 
  onAddIdea, 
  onToggleIdea, 
  onDeleteIdea 
}: IdeaCategoryProps) {
  const [isAddingIdea, setIsAddingIdea] = useState(false);
  const [newIdeaName, setNewIdeaName] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  
  const handleAddIdea = () => {
    if (newIdeaName.trim()) {
      onAddIdea(category, newIdeaName.trim(), newIdeaDescription.trim() || "Description of your idea");
      setNewIdeaName("");
      setNewIdeaDescription("");
      setIsAddingIdea(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{category}</h3>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => setIsAddingIdea(true)}
        >
          <i className="ri-add-line"></i>
        </button>
      </div>
      
      {ideas.map(idea => (
        <IdeaItem
          key={idea.id}
          idea={idea}
          onToggle={onToggleIdea}
          onDelete={onDeleteIdea}
        />
      ))}
      
      {isAddingIdea && (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-2">
          <input
            type="text"
            className="w-full px-2 py-1 mb-2 text-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Idea name..."
            value={newIdeaName}
            onChange={(e) => setNewIdeaName(e.target.value)}
            autoFocus
          />
          <textarea
            className="w-full px-2 py-1 mb-2 text-gray-700 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Description..."
            rows={2}
            value={newIdeaDescription}
            onChange={(e) => setNewIdeaDescription(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="text-gray-500 text-xs"
              onClick={() => setIsAddingIdea(false)}
            >
              Cancel
            </button>
            <button
              className="bg-primary-600 text-white px-2 py-1 rounded text-xs"
              onClick={handleAddIdea}
            >
              Add Idea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
