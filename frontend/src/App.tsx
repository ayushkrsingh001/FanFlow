import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAppStore } from './store/useAppStore';

const Landing = lazy(() => import('./pages/Landing'));
const FanApp = lazy(() => import('./pages/FanApp'));
const OpsConsole = lazy(() => import('./pages/OpsConsole'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  const { role } = useAppStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-['Inter',system-ui,sans-serif]">
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]"><div className="w-8 h-8 rounded-full border-2 border-[#16A34A] border-t-transparent animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/fan" element={role === 'fan' ? <FanApp /> : <Navigate to="/" />} />
            <Route path="/ops" element={role === 'volunteer' ? <OpsConsole /> : <Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
