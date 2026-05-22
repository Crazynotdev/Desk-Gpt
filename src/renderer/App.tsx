import React, { useState, useEffect } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    const key = await (window as any).electron.getApiKey();
    setApiKey(key);
  };

  const createNewConversation = () => {
    const id = Date.now().toString();
    setConversations([...conversations, { id, title: 'New Chat', messages: [] }]);
    setCurrentConversationId(id);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const handleSaveApiKey = async (key: string) => {
    await (window as any).electron.saveApiKey(key);
    setApiKey(key);
    setShowSettings(false);
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        onSettings={() => setShowSettings(true)}
      />
      <main className="main-content">
        {currentConversationId ? (
          <ChatWindow conversationId={currentConversationId} apiKey={apiKey} />
        ) : (
          <div className="welcome">
            <h1>Welcome to DeskGPT</h1>
            <p>Start a new conversation to begin chatting.</p>
            <button onClick={createNewConversation}>New Chat</button>
          </div>
        )}
      </main>
      {showSettings && (
        <SettingsModal
          apiKey={apiKey || ''}
          onSave={handleSaveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;