import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, func: any) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel: string, func: any) => ipcRenderer.once(channel, (event, ...args) => func(...args)),
  },
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  saveApiKey: (apiKey: string) => ipcRenderer.invoke('save-api-key', apiKey),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  revokeApiKey: () => ipcRenderer.invoke('revoke-api-key'),
  testApiKey: (apiKey: string) => ipcRenderer.invoke('test-api-key', apiKey),
  sendChatMessage: (message: string, conversationId: string) =>
    ipcRenderer.invoke('send-chat-message', message, conversationId),
  loadChatHistory: (conversationId: string) => ipcRenderer.invoke('load-chat-history', conversationId),
  saveChatHistory: (conversationId: string, messages: any[]) =>
    ipcRenderer.invoke('save-chat-history', conversationId, messages),
});