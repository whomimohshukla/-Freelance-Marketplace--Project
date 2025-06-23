import React, { useState } from 'react';
import { changePassword } from '../../api/user';
import { motion } from 'framer-motion';

const ChangePassword: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirm) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const { data } = await changePassword(current, newPass);
      if (data.success) {
        setMessage('Password updated');
        setCurrent('');setNewPass('');setConfirm('');
      } else {
        setError(data.message || 'Failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" placeholder="Current password" value={current} onChange={e=>setCurrent(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
        <input type="password" placeholder="New password" value={newPass} onChange={e=>setNewPass(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
        <input type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
        <button type="submit" className="w-full py-3 rounded-lg bg-code-green text-black font-semibold" disabled={loading}>{loading?'Updating...':'Update Password'}</button>
        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </motion.div>
  );
};

export default ChangePassword;
