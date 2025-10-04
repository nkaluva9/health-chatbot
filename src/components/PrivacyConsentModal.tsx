import { useState } from 'react';
import { Shield, Lock, Trash2, Clock, FileText } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function PrivacyConsentModal({ isOpen, onAccept, onDecline }: PrivacyConsentModalProps) {
  const [hasReadNotice, setHasReadNotice] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7" />
              <h2 className="text-2xl font-bold">Healthcare Privacy Notice</h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium">
              This healthcare chatbot assistant is designed to help answer general health questions.
              Your privacy and data security are our top priorities.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              What Information We Store
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Your conversation messages with the chatbot</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Session metadata (timestamps, conversation titles)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Your privacy preferences and settings</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              How We Protect Your Data
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span><strong>Encrypted Storage:</strong> All data is encrypted at rest and in transit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span><strong>Secure Access:</strong> Only you can access your conversation history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span><strong>HIPAA Compliant:</strong> Our infrastructure meets healthcare security standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span><strong>No Sharing:</strong> Your data is never shared with third parties</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Data Retention
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Conversations automatically expire after 90 days (configurable: 30/60/90 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Maximum of 100 conversation sessions stored (configurable: 25/50/100)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Oldest conversations are automatically archived when limit is reached</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Your Rights
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Delete any conversation at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Modify your data retention preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Export your conversation history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Request complete account data deletion</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">⚠️ Important: What NOT to Share</h4>
            <p className="text-sm text-amber-800 mb-2">
              For your safety, please do NOT share:
            </p>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Social Security Numbers or government IDs</li>
              <li>• Insurance policy numbers or member IDs</li>
              <li>• Medical record numbers</li>
              <li>• Credit card or financial information</li>
              <li>• Exact dates of birth (use age ranges instead)</li>
              <li>• Full names of healthcare providers or facilities</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-300 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✓ Safe to Share</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• General symptoms and health concerns</li>
              <li>• Medication names (not prescriptions)</li>
              <li>• General health questions</li>
              <li>• Age ranges instead of exact dates</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="readNotice"
              checked={hasReadNotice}
              onChange={(e) => setHasReadNotice(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="readNotice" className="text-sm text-gray-700 cursor-pointer select-none">
              I have read and understand this privacy notice. I consent to storing my conversation
              history with the understanding that I can delete it at any time.
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-xl border-t flex gap-4">
          <button
            onClick={onDecline}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            disabled={!hasReadNotice}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              hasReadNotice
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
