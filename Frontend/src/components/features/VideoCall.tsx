import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const setupMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    setupMediaDevices();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error('Error attempting to enable full-screen mode:', err);
      }
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      if (localVideoRef.current) {
        // Stop current video track
        localStream?.getVideoTracks().forEach(track => track.stop());
        
        // Replace video track with screen share track
        const newStream = new MediaStream([
          ...localStream?.getAudioTracks() || [],
          screenStream.getVideoTracks()[0]
        ]);
        
        localVideoRef.current.srcObject = newStream;
        setLocalStream(newStream);
        
        // Listen for when user stops screen sharing
        screenStream.getVideoTracks()[0].onended = async () => {
          const newCameraStream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
          
          const revertedStream = new MediaStream([
            ...localStream?.getAudioTracks() || [],
            newCameraStream.getVideoTracks()[0]
          ]);
          
          localVideoRef.current!.srcObject = revertedStream;
          setLocalStream(revertedStream);
        };
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      setLocalStream(null);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    navigate(-1);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages(prev => [...prev, { text: newMessage, time: timeString }]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24" ref={containerRef}>
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
                    onClick={endCall}
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
                    onClick={shareScreen}
                    className="p-4 rounded-full bg-gray-800 text-white hover:opacity-90 transition-colors"
                  >
                    <FiShare2 size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFullScreen}
                    className="p-4 rounded-full bg-gray-800 text-white hover:opacity-90 transition-colors"
                  >
                    <FiMaximize size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
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
                    {messages.map((msg, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-white">{msg.text}</p>
                          <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-grow px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-code-green text-gray-900 rounded-lg hover:bg-code-green/90 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Panel */}
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 z-50"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
                <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Settings</h3>
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Camera
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        <option>Default Camera</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Microphone
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        <option>Default Microphone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Speaker
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        <option>Default Speaker</option>
                      </select>
                    </div>
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
