import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

type AppState = 'login' | 'dashboard';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [userPhone, setUserPhone] = useState<string>('');

  const handleLogin = (phoneNumber: string) => {
    setUserPhone(phoneNumber);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setUserPhone('');
    setAppState('login');
  };

  if (appState === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard phoneNumber={userPhone} onLogout={handleLogout} />;
}

export default App;