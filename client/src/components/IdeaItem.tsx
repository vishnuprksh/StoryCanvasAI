import { useState } from "react";
import { Idea } from "@shared/schema";

interface IdeaItemProps {
  idea: Idea;
  onToggle: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
}

export default function IdeaItem({ idea, onToggle, onDelete }: IdeaItemProps) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div 
      className={`bg-gray-50 rounded-lg p-3 border border-gray-200 mb-2 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer ${idea.isActive ? 'border-primary-300 bg-primary-50' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onToggle(idea.id, !idea.isActive)}
    >
      <div className="flex justify-between">
        <h4 className="font-medium text-gray-800">{idea.name}</h4>
        <div className="flex items-center space-x-2">
          {showActions && (
            <button 
              className="text-gray-400 hover:text-red-500 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idea.id);
              }}
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          )}
          <span className={`${idea.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} text-xs px-2 py-0.5 rounded-full`}>
            {idea.isActive ? 'Active' : 'Unused'}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
    </div>
  );
}
