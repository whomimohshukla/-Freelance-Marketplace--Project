import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMessageSquare,
  FiVideo,
  // FiUser,
  FiSearch,
  FiMoreVertical,
  FiSend,
  FiPaperclip,
  FiSmile,
  FiPhone,
  // FiVideoOff
} from 'react-icons/fi';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

// messaging interface

const Messaging = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'John Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      lastMessage: 'Hey, can we discuss the project details?',
      time: '2m ago',
      unread: 2
    },
    {
      id: '2',
      name: 'Sarah Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      lastMessage: 'The designs are ready for review',
      time: '1h ago',
      unread: 0
    },
    // Add more contacts as needed
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex gap-8">
          {/* Contacts List */}
          <div className="w-96 flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px]">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id
                          ? 'bg-gray-800/80'
                          : 'hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium">{contact.name}</h3>
                            <span className="text-xs text-gray-400">{contact.time}</span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                        </div>
                        {contact.unread > 0 && (
                          <span className="bg-code-green text-gray-900 text-xs font-medium px-2 py-1 rounded-full">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-grow">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px] h-[calc(100vh-200px)] flex flex-col">
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h2 className="text-white font-medium">{selectedContact.name}</h2>
                          <span className="text-sm text-gray-400">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/features/video-call?user=${selectedContact.id}`}
                          className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                        >
                          <FiVideo size={20} />
                        </Link>
                        <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                          <FiPhone size={20} />
                        </button>
                        <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                          <FiMoreVertical size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow overflow-y-auto py-6">
                      {/* Messages will be rendered here */}
                    </div>

                    {/* Message Input */}
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                          <FiPaperclip size={20} />
                        </button>
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-grow px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                          <FiSmile size={20} />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          className="p-2 rounded-lg bg-code-green text-gray-900 hover:bg-code-green/90 transition-colors"
                        >
                          <FiSend size={20} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <FiMessageSquare size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Chat Selected</h3>
                    <p className="text-gray-400">Select a contact to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
