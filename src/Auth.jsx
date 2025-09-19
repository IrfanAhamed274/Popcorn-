// src/Auth.jsx
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase';
import AuthContext from './AuthContext'; // <-- Import the context

// NOTE: useAuth is no longer defined here

// The AuthModal component can stay here as it is not exported
function AuthModal({ show, handleClose }) {
  // ... (The code for the modal is unchanged)
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const authFunction = isLoginView ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
    try {
      await authFunction(auth, email, password);
      handleClose();
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    setEmail('');
    setPassword('');
  }, [isLoginView, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm relative">
        <button onClick={handleClose} className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
        <h2 className="text-2xl font-bold text-center mb-6">{isLoginView ? 'Sign In' : 'Create an Account'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500" />
          <input type="password" placeholder="Password (6+ characters)" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500" />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
            {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLoginView(!isLoginView)} className="ml-1 font-semibold text-indigo-600 hover:underline">
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const openLoginModal = () => setShowAuthModal(true);
  const closeLoginModal = () => setShowAuthModal(false);
  
  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
        return signOut(auth);
    }
  };

  const value = {
    currentUser,
    loading,
    openLoginModal,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <AuthModal show={showAuthModal} handleClose={closeLoginModal} />
    </AuthContext.Provider>
  );
}