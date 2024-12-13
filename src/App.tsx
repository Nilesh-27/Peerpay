import React from 'react';
import { AppProvider } from './context/AppContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { useApp } from './context/AppContext';

const AppContent = () => {
  const { state } = useApp();
  
  if (state.currentUser) {
    return <Dashboard />;
  }
  
  return state.isRegistering ? <Register /> : <Login />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;