import React from 'react';
import './Sidebar.css';

interface Conversation {
  id: string;
  title: string;
  messages: any[];
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onSettings,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>DeskGPT</h1>
        <button className="btn-new" onClick={onNewConversation}>
          + New Chat
        </button>
      </div>

      <div className="conversations">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation ${conv.id === currentConversationId ? 'active' : ''}`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <span className="title">{conv.title}</span>
            <button
              className="btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn-settings" onClick={onSettings}>
          ⚙️ Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;