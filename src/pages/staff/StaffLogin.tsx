import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ShieldCheckIcon } from 'lucide-react';
export function StaffLogin() {
  const [email, setEmail] = useState('staff@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password, 'staff');
    if (success) {
      navigate('/staff/dashboard');
    } else {
      setError('Invalid staff credentials');
    }
    setLoading(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Staff Portal
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to review and manage documents
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" label="Staff Email" placeholder="staff@example.com" value={email} onChange={e => setEmail(e.target.value)} required />

          <Input type="password" label="Password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Demo credentials:</strong>
              <br />
              Email: staff@example.com
              <br />
              Password: password
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← Client Login
          </Link>
        </div>
      </div>
    </div>;
}