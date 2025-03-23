import { useEditor, EditorContent } from "@tiptap/react";
import { getEditorExtensions } from "@/lib/tiptap";
import { useCallback, useEffect } from "react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
}

export default function Editor({ content, onChange, onBlur }: EditorProps) {
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

    // This is a simple implementation. For a real app, you would
    // need a more sophisticated approach to identify and mark ideas
    const ideaTerms = ["Avaloria", "Lyra", "Crystal of Eldoria"];
    
    editor.view.state.doc.descendants((node: any, pos: number) => {
      if (node.isText) {
        const text = node.text;
        
        ideaTerms.forEach(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'g');
          let match;
          
          while ((match = regex.exec(text)) !== null) {
            const from = pos + match.index;
            const to = from + term.length;
            
            editor.view.dispatch(
              editor.view.state.tr
                .addMark(
                  from, 
                  to, 
                  editor.schema.marks.span.create({
                    class: 'idea-tag text-gray-800 bg-secondary-50 px-1 rounded'
                  })
                )
            );
            
            // Add the indicator
            editor.view.dispatch(
              editor.view.state.tr
                .addMark(
                  from, 
                  to, 
                  editor.schema.marks.span.create({
                    class: 'idea-indicator'
                  })
                )
            );
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (editor) {
      processContentWithIdeas(editor);
    }
  }, [editor, processContentWithIdeas]);

  return (
    <EditorContent 
      editor={editor} 
      className="prose-lg max-w-none font-serif focus:outline-none min-h-[200px]" 
    />
  );
}
