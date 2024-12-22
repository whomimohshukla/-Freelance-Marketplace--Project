import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiSend,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram
} from 'react-icons/fi';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      content: 'support@skillbridge.com',
      subContent: 'Response within 2-4 hours',
      link: 'mailto:support@skillbridge.com'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      content: '+91 (800) 123-4567',
      subContent: 'Toll-free number',
      link: 'tel:+918001234567'
    },
    {
      icon: FiMapPin,
      title: 'Locations',
      content: 'Mumbai (HQ)',
      subContent: [
        'Bandra Kurla Complex, Mumbai - 400051',
        'Cyber City, Gurugram - 122002',
        'Whitefield, Bangalore - 560066'
      ],
      link: 'https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai'
    },
    {
      icon: FiClock,
      title: 'Support Hours',
      content: '24/7 Customer Support',
      subContent: [
        'Technical Support: 24/7',
        'Sales Team: Mon-Sat 9AM-8PM IST',
        'Business Hours: Mon-Fri 10AM-7PM IST'
      ],
      link: '#'
    }
  ];

  const socialLinks = [
    { icon: FiFacebook, link: '#', label: 'Facebook' },
    { icon: FiTwitter, link: '#', label: 'Twitter' },
    { icon: FiLinkedin, link: '#', label: 'LinkedIn' },
    { icon: FiInstagram, link: '#', label: 'Instagram' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Have questions or need assistance? We're here to help! Reach out to our support team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block"
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
                    <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px] hover:bg-gray-800/50 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gray-800/50">
                          <item.icon className="h-6 w-6 text-code-green" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{item.title}</h3>
                          <p className="text-gray-400">{item.content}</p>
                          {Array.isArray(item.subContent) ? (
                            <div className="mt-2 space-y-1">
                              {item.subContent.map((content, idx) => (
                                <p key={idx} className="text-gray-500 text-sm">{content}</p>
                              ))}
                            </div>
                          ) : item.subContent && (
                            <p className="text-gray-500 text-sm mt-1">{item.subContent}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-400 hover:text-code-green transition-colors duration-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-[11px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent transition-all duration-300"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isSubmitting
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-code-green text-gray-900 hover:bg-code-green/90'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <FiMessageSquare className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                  {submitStatus === 'success' && (
                    <div className="text-green-400 text-sm text-center">
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="text-red-400 text-sm text-center">
                      Failed to send message. Please try again later.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
