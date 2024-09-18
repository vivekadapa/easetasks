import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';
// import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { TbProgress } from "react-icons/tb";
import { Bell, Grip, Users } from 'lucide-react';
// import { once } from 'events';

type props = {
  isLogin: boolean
}

const featureCards = [
  { title: "Collaborate with Teams", description: "Invite team members and work together seamlessly on projects.", icon: <Users className='w-32 h-32 mx-auto' /> },
  { title: "Track Task Progress", description: "Monitor tasks and subtasks with ease using the Kanban interface.", icon: <TbProgress className='w-32 h-32 mx-auto' /> },
  { title: "Drag-and-Drop Interface", description: "Easily manage tasks and columns with intuitive drag-and-drop.", icon: <Grip className='w-32 h-32 mx-auto' /> },
  { title: "Real-Time Notifications", description: "Stay updated with real-time task and project notifications.", icon: <Bell className='w-32 h-32 mx-auto' /> }
];



const AuthComponent = ({ isLogin }: props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // const endpoint = isLogin ? 'login' : 'register';

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
          await response.json();
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
  };

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (

    <div className='min-h-screen flex justify-center items-center'>
      <div className="max-[735px]:hidden w-1/2 overflow-y-auto min-h-full flex border-r-[1px] border-slate-500 flex-col items-center justify-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="flex items-center gap-4 text-4xl font-bold mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 2, repeat: 0 }}
            >
              <img src="./logo.svg" alt="Task management illustration" className="shadow-lg w-8 h-8" />
            </motion.div>
            Ease Tasks
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-xl text-center"
        >
          Simplify your workflow with our intuitive Kanban boards
        </motion.p>

        {/* Animated Feature Cards */}
        <div className="mt-8 text-center grid grid-cols-2 max-[1100px]:grid-cols-1 px-4 gap-4 w-full">
          {featureCards.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-neutral-900/80 p-4 rounded-lg shadow-lg"
            >

              {feature.icon}
              {/* <img src={`./${feature.icon}`} alt={feature.title} className="w-12 h-12 mb-3" /> */}
              <CardTitle className="text-lg ">{feature.title}</CardTitle>
              <p className="text-sm text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className='h-screen px-[0.05px] bg-slate-500'>

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