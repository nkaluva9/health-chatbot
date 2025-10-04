import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Archive,
  Trash2,
  Clock,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';
import type { ChatSession } from '../types/chat';
import { ChatHistoryService } from '../services/chatHistoryService';

interface SessionHistorySidebarProps {
  userId: string;
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onSettingsClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SessionHistorySidebar({
  userId,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onSettingsClick,
  isOpen,
  onClose,
}: SessionHistorySidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [userId, isOpen, showArchived]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await ChatHistoryService.getSessions(userId, showArchived);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      loadSessions();
      return;
    }

    try {
      const data = await ChatHistoryService.searchSessions(userId, term);
      setSessions(data);
    } catch (error) {
      console.error('Failed to search sessions:', error);
    }
  };

  const handleArchive = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await ChatHistoryService.archiveSession(sessionId);
      loadSessions();
    } catch (error) {
      console.error('Failed to archive session:', error);
    }
  };

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this conversation?')) {
      return;
    }

    try {
      await ChatHistoryService.deleteSession(sessionId);
      loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredSessions = searchTerm
    ? sessions
    : sessions;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Chat History
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            New Conversation
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowArchived(false)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                !showArchived
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                showArchived
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </p>
              {!searchTerm && (
                <p className="text-xs mt-2">Start a new conversation to get started</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    onSessionSelect(session.id);
                    onClose();
                  }}
                  className={`p-4 cursor-pointer transition-all group hover:bg-blue-50 ${
                    currentSessionId === session.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                      {session.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {session.messageCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(session.lastMessageAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!session.isArchived && (
                      <button
                        onClick={(e) => handleArchive(session.id, e)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center gap-1 transition-colors"
                        title="Archive conversation"
                      >
                        <Archive className="w-3 h-3" />
                        Archive
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded flex items-center gap-1 transition-colors"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onSettingsClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Settings className="w-5 h-5" />
            Privacy Settings
          </button>
        </div>
      </div>
    </>
  );
}
