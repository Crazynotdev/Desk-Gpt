import React, { useState } from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  apiKey: string;
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ apiKey, onSave, onClose }) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    try {
      const result = await (window as any).electron.testApiKey(inputValue);
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ valid: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave(inputValue);
  };

  const handleRevoke = async () => {
    await (window as any).electron.revokeApiKey();
    setInputValue('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="setting-group">
          <label>Groq API Key</label>
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your Groq API key"
          />
          <small>Get your API key from https://console.groq.com</small>
        </div>

        {testResult && (
          <div className={`test-result ${testResult.valid ? 'success' : 'error'}`}>
            {testResult.valid ? '✓ API key is valid' : `✗ ${testResult.error}`}
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={handleTest} disabled={!inputValue || testing} className="btn-test">
            {testing ? 'Testing...' : 'Test API Key'}
          </button>
          <button onClick={handleRevoke} className="btn-revoke">
            Revoke
          </button>
          <button onClick={handleSave} className="btn-save">
            Save
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;