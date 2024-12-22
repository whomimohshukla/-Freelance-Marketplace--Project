import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiPhoneOff,
  FiMaximize,
  FiMessageSquare,
  FiShare2,
  FiSettings
} from 'react-icons/fi';

const VideoCall = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Request camera and microphone permissions
    const setupMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    setupMediaDevices();

    // Cleanup
    return () => {
      const stream = localVideoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    const audioTrack = stream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { sender: 'You', text: newMessage, time }]);
      setNewMessage('');
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Area */}
          <div className="flex-grow">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px]">
                {/* Remote Video */}
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Local Video (Picture-in-Picture) */}
                  <div className="absolute bottom-4 right-4 w-48 aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAudio}
                    className={`p-4 rounded-full ${
                      isAudioEnabled ? 'bg-gray-800' : 'bg-red-500'
                    } text-white hover:opacity-90 transition-colors`}
                  >
                    {isAudioEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVideo}
                    className={`p-4 rounded-full ${
                      isVideoEnabled ? 'bg-gray-800' : 'bg-red-500'
                    } text-white hover:opacity-90 transition-colors`}
                  >
                    {isVideoEnabled ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <FiPhoneOff size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="p-4 rounded-full bg-gray-800 text-white hover:opacity-90 transition-colors"
                  >
                    <FiMessageSquare size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-full bg-gray-800 text-white hover:opacity-90 transition-colors"
                  >
                    <FiShare2 size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-full bg-gray-800 text-white hover:opacity-90 transition-colors"
                  >
                    <FiMaximize size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-full bg-gray-800 text-white hover:opacity-90 transition-colors"
                  >
                    <FiSettings size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-96"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
                <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px] h-[600px] flex flex-col">
                  <h3 className="text-lg font-medium text-white mb-4">Chat</h3>
                  
                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-medium text-code-green">
                            {message.sender}
                          </span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-300 bg-gray-800/50 rounded-lg p-3">
                          {message.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-grow px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-code-green text-gray-900 rounded-lg font-medium hover:bg-code-green/90 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
