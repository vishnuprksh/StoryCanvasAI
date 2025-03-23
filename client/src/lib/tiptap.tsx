import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';

// Custom extension for handling ideas
const IdeaHighlight = Extension.create({
  name: 'ideaHighlight',
  
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              if (!attributes.class) {
                return {};
              }
              
              return { class: attributes.class };
            },
          },
        },
      },
    ];
  },
});

// Get all extensions needed for the editor
export const getEditorExtensions = () => [
  StarterKit,
  Placeholder.configure({
    placeholder: 'Begin your story here...',
  }),
  IdeaHighlight
];

// Custom React component for idea nodes
export const IdeaNodeView = ({ node, updateAttributes }: any) => {
  return (
    <span className="idea-tag text-gray-800 bg-gray-100 px-1 rounded">
      {node.content}
      <span className="idea-indicator"></span>
    </span>
  );
};

// Helper function to mark ideas in content
export const markIdeasInContent = (content: string, ideas: string[]): string => {
  let markedContent = content;
  
  ideas.forEach(idea => {
    const regex = new RegExp(`\\b${idea}\\b`, 'g');
    markedContent = markedContent.replace(
      regex, 
      `<span class="idea-tag text-gray-800 bg-gray-100 px-1 rounded">${idea}<span class="idea-indicator"></span></span>`
    );
  });
  
  return markedContent;
};
