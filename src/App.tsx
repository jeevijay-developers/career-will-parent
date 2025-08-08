import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { isLoggedIn, getPhoneNumber } from './util/user';

type AppState = 'login' | 'dashboard' | 'loading';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userPhone, setUserPhone] = useState<string>('');

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      if (isLoggedIn()) {
        const phoneNumber = getPhoneNumber();
        if (phoneNumber) {
          setUserPhone(phoneNumber);
          setAppState('dashboard');
        } else {
          setAppState('login');
        }
      } else {
        setAppState('login');
      }
    };

    checkExistingSession();
  }, []);

  const handleLogin = (phoneNumber: string) => {
    setUserPhone(phoneNumber);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setUserPhone('');
    setAppState('login');
  };

  // Show loading screen while checking session
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking your session</p>
        </div>
      </div>
    );
  }

  if (appState === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard phoneNumber={userPhone} onLogout={handleLogout} />;
}

export default App;