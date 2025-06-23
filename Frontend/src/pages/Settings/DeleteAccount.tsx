import React, { useState } from 'react';
import { deleteAccount } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const DeleteAccount: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    if(!window.confirm('This will permanently delete your account. Continue?')) return;
    setLoading(true);
    try {
      const { data } = await deleteAccount();
      if(data.success){
        alert('Account deleted');
        logout();
        navigate('/');
      } else {
        setError(data.message||'Failed');
      }
    } catch(err:any){
      setError(err.response?.data?.message||'Failed');
    } finally { setLoading(false);}  
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-lg mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Delete Account</h1>
      <p className="text-gray-400 mb-6">This action cannot be undone. All your data will be removed.</p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button onClick={handleDelete} disabled={loading} className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
        {loading?'Deleting...':'Delete my account'}
      </button>
    </motion.div>
  );
};

export default DeleteAccount;
