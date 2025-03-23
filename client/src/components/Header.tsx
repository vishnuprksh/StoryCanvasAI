import { useState } from "react";
import { PenLine } from "lucide-react";

interface HeaderProps {
  onSave: () => void;
}

export default function Header({ onSave }: HeaderProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, 800);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <PenLine className="h-8 w-8 text-primary-600" />
          <h1 className="text-xl font-semibold text-gray-800">StoryCanvas</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <i className="ri-file-list-line text-xl"></i>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <i className="ri-settings-4-line text-xl"></i>
          </button>
          <button 
            className={`bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${isSaving ? 'opacity-75' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <i className="ri-loader-2-line animate-spin mr-1.5"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="ri-save-line mr-1.5"></i>
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
