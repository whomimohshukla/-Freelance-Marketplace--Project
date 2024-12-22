import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiImage, FiSmile, FiMoreVertical, FiSearch, FiPhone, FiVideo, FiMessageSquare as FiMessage } from 'react-icons/fi';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  lastActive: string;
  status: 'online' | 'offline' | 'away';
}

const Messaging = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I saw your profile and I think you'd be perfect for my project.",
      sender: 'Alice Johnson',
      timestamp: '10:30 AM',
      isOwn: false,
      status: 'read'
    },
    {
      id: '2',
      content: "Thanks! I'd love to hear more about it. Could you share some details?",
      sender: 'You',
      timestamp: '10:32 AM',
      isOwn: true,
      status: 'read'
    },
    {
      id: '3',
      content: "Of course! It's a React-based web application for a fitness tracking platform...",
      sender: 'Alice Johnson',
      timestamp: '10:35 AM',
      isOwn: false,
      status: 'read'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      lastMessage: "Of course! It's a React-based web application...",
      unreadCount: 2,
      lastActive: '2 min ago',
      status: 'online'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      lastMessage: 'The design looks great! When can we...',
      unreadCount: 0,
      lastActive: '5 min ago',
      status: 'away'
    },
    {
      id: '3',
      name: 'Carol White',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
      lastMessage: "I've reviewed your proposal and...",
      unreadCount: 1,
      lastActive: '1 hour ago',
      status: 'offline'
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-150px)]">
            {/* Contacts Sidebar */}
            <div className="border-r border-gray-700/50">
              <div className="p-4 border-b border-gray-700/50">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900/50 text-white rounded-xl border border-gray-700/50 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
                {contacts.map(contact => (
                  <motion.div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    whileHover={{ x: 4 }}
                    className={`p-4 cursor-pointer hover:bg-gray-700/30 transition-colors border-l-2 ${
                      selectedContact?.id === contact.id 
                        ? 'border-code-green bg-gray-700/30' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <span 
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                            contact.status === 'online' 
                              ? 'bg-green-500' 
                              : contact.status === 'away'
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-medium truncate">
                            {contact.name}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {contact.lastActive}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">
                          {contact.lastMessage}
                        </p>
                      </div>
                      {contact.unreadCount > 0 && (
                        <span className="bg-code-green text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col bg-gray-900/30">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-700/50 backdrop-blur-xl bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={selectedContact.avatar}
                            alt={selectedContact.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span 
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-800 ${
                              selectedContact.status === 'online' 
                                ? 'bg-green-500' 
                                : selectedContact.status === 'away'
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                            }`}
                          />
                        </div>
                        <div>
                          <h2 className="text-white font-medium">
                            {selectedContact.name}
                          </h2>
                          <p className="text-gray-400 text-sm">
                            {selectedContact.status === 'online' ? 'Online' : selectedContact.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
                          <FiPhone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
                          <FiVideo className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map(message => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl p-4 ${
                            message.isOwn
                              ? 'bg-code-green text-gray-900'
                              : 'bg-gray-700/50 text-white'
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                          <div className={`flex items-center justify-end space-x-2 mt-2 text-xs ${
                            message.isOwn ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.isOwn && message.status && (
                              <span>• {message.status}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700/50 backdrop-blur-xl bg-gray-800/30">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                        >
                          <FiPaperclip className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                        >
                          <FiImage className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                        >
                          <FiSmile className="w-5 h-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-900/50 text-white rounded-xl px-4 py-2 border border-gray-700/50 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="bg-code-green text-gray-900 p-2 rounded-xl hover:bg-code-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 text-gray-600 mb-4">
                    <FiMessage className="w-full h-full" />
                  </div>
                  <h3 className="text-white text-xl font-medium mb-2">
                    Select a Conversation
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    Choose a contact from the list to start messaging
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Messaging;
