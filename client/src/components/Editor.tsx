import { useEditor, EditorContent } from "@tiptap/react";
import { getEditorExtensions } from "@/lib/tiptap";
import { useCallback, useEffect } from "react";
import { Idea } from "@shared/schema";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
  ideas?: Idea[];
}

export default function Editor({ content, onChange, onBlur, ideas = [] }: EditorProps) {
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: ({ event }) => {
      onBlur?.();
    },
  });

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  // Mark active ideas in the content
  const processContentWithIdeas = useCallback((editor: any) => {
    if (!editor) return;

    // Instead of trying to manually manipulate the editor state, which is more complex,
    // we'll use Tiptap's commands API to set content with our marked ideas
    
    // Get the current content
    const content = editor.getHTML();
    
    // Get active ideas from the passed ideas prop
    const activeIdeas = ideas.filter(idea => idea.isActive).map(idea => idea.name);
    if (activeIdeas.length === 0) return;
    
    let markedContent = content;
    
    activeIdeas.forEach(idea => {
      const regex = new RegExp(`\\b${idea}\\b`, 'g');
      markedContent = markedContent.replace(
        regex, 
        `<span class="idea-tag text-gray-800 bg-gray-100 px-1 rounded">${idea}<span class="idea-indicator"></span></span>`
      );
    });
    
    // Only update if content changed
    if (markedContent !== content) {
      editor.commands.setContent(markedContent, false);
    }
  }, [ideas]);

  useEffect(() => {
    if (editor) {
      processContentWithIdeas(editor);
    }
  }, [editor, processContentWithIdeas, ideas]);

  return (
    <EditorContent 
      editor={editor} 
      className="prose-lg max-w-none font-serif focus:outline-none min-h-[200px]" 
    />
  );
}
