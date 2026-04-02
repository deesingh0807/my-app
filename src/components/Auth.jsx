import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat, ShoppingBag } from 'lucide-react';

function Auth() {
  const { login } = useAuth();

  return (
    <div className="auth-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="top-bar-title" style={{ fontSize: '2.5rem' }}>Planeat</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Eat smart. Save food.</p>
      </div>
      
      <div className="w-full">
        <button 
          className="btn-primary" 
          onClick={() => login('customer')}
        >
          <ShoppingBag size={20} />
          Continue as Customer
        </button>
        
        <button 
          className="btn-secondary" 
          onClick={() => login('owner')}
        >
          <ChefHat size={20} />
          Continue as Business Owner
        </button>
      </div>
    </div>
  );
}

export default Auth;
