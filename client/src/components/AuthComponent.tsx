import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';

type props = {
  isLogin: boolean
}


const AuthComponent = ({ isLogin }: props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? 'login' : 'register';

    try {
      if (isLogin) {
        await login(email, password)
      }
      else {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          await login(email, password); // Use the login function after successful registration
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'An error occurred');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication');
    }
    // const response = await value.login(email, password)
    // try {

    // } catch (err) {
    //   console.log(err)
    //   setError('Network error');
    // }
  };

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (

    <div className='min-h-screen flex justify-center items-center'>
      <div className="w-1/2 h-full flex border-r-[1px] flex-col items-center justify-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="flex items-center gap-4 text-4xl font-bold mb-4">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <img src="./logo.svg" alt="Task management illustration" className="shadow-lg" />
            </motion.div>
            Ease Tasks</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-xl"
        >
          Simplify your workflow with our intuitive Kanban boards
        </motion.p>
      </div>
      <div className='h-screen p-[0.05px] bg-slate-500'>

      </div>
      <Card className="h-full w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
          <Button
            variant="link"
            onClick={() => isLogin ? navigate('/register') : navigate('/login')}
            className="mt-4 w-full"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>

  );
};

export default AuthComponent;