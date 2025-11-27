import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { FileTextIcon } from 'lucide-react';
export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const success = await register(email, password, name);
    if (success) {
      navigate('/client/dashboard');
    } else {
      setError('Email already registered');
    }
    setLoading(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FileTextIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Get started with document submissions
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" label="Full Name" placeholder="Bruce Wayne" value={name} onChange={e => setName(e.target.value)} required />

          <Input type="email" label="Email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />

          <Input type="password" label="Password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />

          <Input type="password" label="Confirm Password" placeholder="********" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>;
}