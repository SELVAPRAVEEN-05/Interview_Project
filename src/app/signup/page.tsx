'use client';
import { Link } from '@heroui/react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Signup attempt:', formData);
    // Add sign up logic here
    // router.push('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border p-6">
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg mb-6 text-white">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p>Join us today</p>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Account Type */}
          <div className="flex gap-6 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="user"
                checked={formData.userType === 'user'}
                onChange={handleInputChange}
              />
              User
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="interviewer"
                checked={formData.userType === 'interviewer'}
                onChange={handleInputChange}
              />
              Interviewer
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:scale-[1.02] transition"
          >
            Next
          </button>

          <div className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link href='/' className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
