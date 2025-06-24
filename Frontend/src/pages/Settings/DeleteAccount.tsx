import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAccount } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

const DeleteAccount: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    if(!password) return setError('Please enter your password to confirm');
    setLoading(true);
    try {
      const { data } = await deleteAccount(password);
      if(data.success){
        setShowModal(false);
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
      <button onClick={()=>setShowModal(true)} disabled={loading} className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
        Delete my account
      </button>

      <ConfirmModal
        isOpen={showModal}
        title="Delete Account"
        message="This action is irreversible. All your data will be permanently removed. Are you sure you want to proceed?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={loading}
        onClose={() => !loading && setShowModal(false)}
        onConfirm={handleDelete}>
        <input
          type="password"
          className="w-full mt-2 px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none"
          placeholder="Enter password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-sm text-gray-400 mt-3">Forgot your password? <Link to="/forgot-password" className="text-code-green underline">Reset it</Link></p>
      </ConfirmModal>
    </motion.div>
  );
};

export default DeleteAccount;
