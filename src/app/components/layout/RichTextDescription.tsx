import React, { useState } from 'react';

const RichTextDescription = ({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (value: string) => void 
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleFormatting = (type: 'bold' | 'italic') => {
    const textarea = document.getElementById('rich-description') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let formattedText;
    if (type === 'bold') {
      formattedText = `**${selectedText}**`;
      setIsBold(!isBold);
    } else {
      formattedText = `*${selectedText}*`;
      setIsItalic(!isItalic);
    }

    const newValue = value.slice(0, start) + formattedText + value.slice(end);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <div className="flex mb-2 space-x-2">
        <button 
          type="button" 
          onClick={() => handleFormatting('bold')}
          className={`px-2 py-1 rounded ${isBold ? 'bg-blue-200' : 'bg-gray-100'}`}
        >
          B
        </button>
        <button 
          type="button" 
          onClick={() => handleFormatting('italic')}
          className={`px-2 py-1 rounded ${isItalic ? 'bg-blue-200' : 'bg-gray-100'}`}
        >
          I
        </button>
      </div>
      <textarea
        id="rich-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Опишіть детально вашу подію..."
        className="w-full h-64 p-2 border rounded"
      />
    </div>
  );
};

export default RichTextDescription;