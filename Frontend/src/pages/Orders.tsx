import React from 'react';

const Orders: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <p className="text-gray-400">You have no orders yet. Once you purchase services, they'll appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
