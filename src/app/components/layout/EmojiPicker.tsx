import React, { useState, useMemo } from 'react';
import { Search, Smile, Flag, LucideIcon } from 'lucide-react';
import { Editor as TinyMCEEditor } from 'tinymce';

const emojiCategories = {
  Smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', 
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😜', '😎', 
    '🤔', '😴', '🤗', '😰', '😭', '😡', '😱', '🥳', '🤠'
  ],
  Flags: [
    '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', 
    '🇦🇨', '🇪🇺', '🌀', '⚑', '🎌'
  ],
  Symbols: [
    '❤️', '🔥', '✨', '🌟', '💡', '🎉', '🏆', '💯', 
    '✅', '❌', '⭐', '🚀', '💕', '🤝', '🌈', '💖', 
    '📌', '📅', '📆', '🕒', '🔔', '🎨', '🎶', '💬', 
    '📋', '📝', '🎯', '🎊', '📢', '📷', '🎥', '🔗', 
    '💎', '🎤', '🏷️', '📍', '🔒', '📂', '📖'
  ]
} as const;

const categoryIcons: Record<keyof typeof emojiCategories, LucideIcon> = {
  Smileys: Smile,
  Flags: Flag,
  Symbols: Smile
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  editorRef: React.MutableRefObject<TinyMCEEditor | null>;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, editorRef }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>('Smileys');

  const filteredEmojis = useMemo(() => {
    const categoryEmojis = emojiCategories[activeCategory];
    return categoryEmojis.filter(emoji => 
      emoji.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategory]);

  const handleEmojiClick = (emoji: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(emoji);
    }
    onEmojiSelect(emoji);
  };

  return (
    <div style={{
      width: '300px',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        margin: '10px',
        padding: '5px 10px'
      }}>
        <Search size={16} color="#888" />
        <input 
          type="text" 
          placeholder="Search emojis"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            marginLeft: '10px',
            flex: 1,
            backgroundColor: 'transparent'
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '10px'
      }}>
        {(Object.keys(emojiCategories) as Array<keyof typeof emojiCategories>).map((category) => {
          const Icon = categoryIcons[category];
          return (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: activeCategory === category ? '#f0f0f0' : 'transparent',
                border: 'none',
                borderBottom: activeCategory === category ? '2px solid #3498db' : 'none',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} />
              <span style={{ marginLeft: '5px' }}>{category}</span>
            </button>
          );
        })}
      </div>

      {/* Emoji Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '5px',
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '0 10px 10px'
      }}>
        {filteredEmojis.map((emoji) => (
          <button 
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'transform 0.1s',
              borderRadius: '6px',
              padding: '5px'
            }}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1.2)';
              target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1)';
              target.style.backgroundColor = 'transparent';
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;