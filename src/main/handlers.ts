import { IpcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { app } from 'electron';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const systemPrompt = require('./prompts');

const getDataPath = () => path.join(app.getPath('appData'), 'deskgpt');
const getConfigPath = () => path.join(getDataPath(), 'deskgpt-data.json');

const ensureDataDirectory = () => {
  const dataPath = getDataPath();
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }
};

const loadConfig = () => {
  ensureDataDirectory();
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return { apiKey: null, chats: {} };
};

const saveConfig = (config: any) => {
  ensureDataDirectory();
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));
};

export const handleApiKeyOperations = (ipcMain: IpcMain) => {
  ipcMain.handle('save-api-key', async (event, apiKey: string) => {
    const config = loadConfig();
    config.apiKey = apiKey;
    saveConfig(config);
    return { success: true };
  });

  ipcMain.handle('get-api-key', async () => {
    const config = loadConfig();
    return config.apiKey || null;
  });

  ipcMain.handle('revoke-api-key', async () => {
    const config = loadConfig();
    config.apiKey = null;
    saveConfig(config);
    return { success: true };
  });

  ipcMain.handle('test-api-key', async (event, apiKey: string) => {
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return { valid: true };
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  });
};

export const handleChatOperations = (ipcMain: IpcMain) => {
  ipcMain.handle('send-chat-message', async (event, message: string, conversationId: string) => {
    const config = loadConfig();
    if (!config.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            systemPrompt,
            { role: 'user', content: message }
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.choices[0].message.content;
      return { success: true, message: assistantMessage };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('load-chat-history', async (event, conversationId: string) => {
    const config = loadConfig();
    return config.chats?.[conversationId] || [];
  });

  ipcMain.handle('save-chat-history', async (event, conversationId: string, messages: any[]) => {
    const config = loadConfig();
    config.chats = config.chats || {};
    config.chats[conversationId] = messages;
    saveConfig(config);
    return { success: true };
  });
};
