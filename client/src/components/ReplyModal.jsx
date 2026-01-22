import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Sparkles, Send, Copy, Loader2, MessageSquareText, Zap } from 'lucide-react';
import toast from 'react-hot-toast' ;

const ReplyModal = ({ isOpen, onClose, lead }) => {
  const [replyText, setReplyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const generateAIReply = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/v1/leads/${lead._id}/generate-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to generate reply');

      const data = await response.json();
      setReplyText(data.aiReply || data.suggestedReply);
      
      toast.success('AI Reply Generated! ✨', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      });
    } catch (error) {
      console.error('Error generating reply:', error);
      toast.error('Failed to generate AI reply', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/v1/leads/${lead._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText }),
      });

      if (!response.ok) throw new Error('Failed to send reply');

      toast.success('Reply Sent Successfully! 🚀', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        },
      });
      
      setReplyText('');
      onClose();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(replyText);
    setCopied(true);
    toast.success('Copied to clipboard! 📋', {
      style: {
        background: '#18181b',
        color: '#fff',
        border: '1px solid rgba(99, 102, 241, 0.3)',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as={motion.div}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ 
                  scale: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }
                }}
                className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl transition-all"
              >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                        <MessageSquareText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-white">
                          AI-Powered Reply
                        </Dialog.Title>
                        <p className="text-sm text-white/80 mt-0.5">
                          {lead.source} • {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Original Message */}
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                      Original Message
                    </label>
                    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
                      <p className="text-zinc-200 text-sm leading-relaxed">
                        {lead.originalContent}
                      </p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {lead.aiSummary && (
                    <div>
                      <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block flex items-center">
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        AI Analysis
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20"></div>
                        <div className="relative bg-zinc-800/70 border border-indigo-500/30 rounded-xl p-4">
                          <p className="text-zinc-200 text-sm leading-relaxed">
                            {lead.aiSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate AI Reply Button */}
                  <motion.button
                    onClick={generateAIReply}
                    disabled={isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>AI is thinking...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        <span>Generate AI Reply</span>
                      </>
                    )}
                  </motion.button>

                  {/* Reply Text Area */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Your Reply
                      </label>
                      {replyText && (
                        <button
                          onClick={copyToClipboard}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here, or use AI to generate one..."
                      rows={6}
                      disabled={isGenerating}
                      className={`w-full bg-zinc-800/50 border ${
                        isGenerating ? 'shimmer border-indigo-500/50' : 'border-zinc-700/50'
                      } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-4 text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 resize-none`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-zinc-500">
                        {replyText.length} characters
                      </p>
                      {isGenerating && (
                        <p className="text-xs text-indigo-400 animate-pulse flex items-center space-x-1">
                          <Sparkles className="h-3 w-3" />
                          <span>Generating...</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-zinc-900/50 border-t border-zinc-800 p-6 flex items-center justify-end space-x-3">
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 rounded-xl font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={sendReply}
                    disabled={isSending || !replyText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Reply</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReplyModal;
