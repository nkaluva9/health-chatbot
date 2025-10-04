import { useState, useEffect } from 'react';
import { X, Save, Shield, Clock, Database, Trash2, CheckCircle } from 'lucide-react';
import type { UserChatPreferences } from '../types/chat';
import { ChatHistoryService } from '../services/chatHistoryService';

interface DataRetentionSettingsProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DataRetentionSettings({ userId, isOpen, onClose }: DataRetentionSettingsProps) {
  const [, setPreferences] = useState<UserChatPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [retentionDays, setRetentionDays] = useState<30 | 60 | 90>(90);
  const [maxSessions, setMaxSessions] = useState(100);
  const [autoArchive, setAutoArchive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [userId, isOpen]);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await ChatHistoryService.getUserPreferences(userId);

      if (data) {
        setPreferences(data);
        setRetentionDays(data.retentionDays);
        setMaxSessions(data.maxSessions);
        setAutoArchive(data.autoArchive);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await ChatHistoryService.createOrUpdatePreferences(userId, {
        retentionDays,
        maxSessions,
        autoArchive,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7" />
              <h2 className="text-2xl font-bold">Privacy & Data Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                Configure how long we keep your conversation data and how many sessions to store.
                All changes take effect immediately.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Data Retention Period</h3>
                    <p className="text-sm text-gray-600">
                      How long should we keep your conversations?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[30, 60, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setRetentionDays(days as 30 | 60 | 90)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        retentionDays === days
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl font-bold text-gray-900">{days}</div>
                      <div className="text-xs text-gray-600 mt-1">days</div>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">ℹ️</span>
                  Conversations older than {retentionDays} days will be automatically deleted.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Maximum Sessions</h3>
                    <p className="text-sm text-gray-600">
                      How many conversation sessions to keep?
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Max sessions: <span className="text-blue-600 font-bold">{maxSessions}</span>
                    </label>
                  </div>

                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="25"
                    value={maxSessions}
                    onChange={(e) => setMaxSessions(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">ℹ️</span>
                  When you reach {maxSessions} sessions, the oldest ones will be automatically archived.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Auto-Archive</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Automatically archive old conversations when limit is reached
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoArchive}
                          onChange={(e) => setAutoArchive(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">ℹ️</span>
                      {autoArchive
                        ? 'Old conversations will be moved to archive instead of being deleted.'
                        : 'Old conversations may be permanently deleted when limit is reached.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Current Settings Summary
                </h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Conversations expire after <strong>{retentionDays} days</strong></li>
                  <li>• Maximum <strong>{maxSessions} sessions</strong> stored</li>
                  <li>• Auto-archive is <strong>{autoArchive ? 'enabled' : 'disabled'}</strong></li>
                  <li>• All data is encrypted and secure</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-xl border-t flex gap-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              saveSuccess
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl disabled:opacity-50'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
