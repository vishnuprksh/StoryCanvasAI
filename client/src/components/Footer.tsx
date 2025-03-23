import { formatDistanceToNow } from "date-fns";

interface FooterProps {
  wordCount: number;
  lastSaved: Date | null;
}

export default function Footer({ wordCount, lastSaved }: FooterProps) {
  const getLastSavedText = () => {
    if (!lastSaved) return "Not saved yet";
    return `Last saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`;
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span>{wordCount.toLocaleString()} words</span>
            <span className="mx-2">·</span>
            <span>{getLastSavedText()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
              <i className="ri-question-line mr-1.5"></i>
              Help
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
              <i className="ri-feedback-line mr-1.5"></i>
              Feedback
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
