import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const handleNextStep = async (data: any) => {
        try {
            if (step === 1) {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/otp/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.email }),
                });
                if (response.status == 200 || response.ok) {
                    setStep(step + 1);
                }
            } else if (step === 2) {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/otp/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.email, otp: data.otp }),
                });
                if (response.ok) {
                    setStep(step + 1);
                }
            } else if (step === 3) {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: data.password }),
                });
                if (response.ok) {
                    // alert('Password set successfully!');
                    navigate('/');
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex w-full mx-auto mt-10">
            <div className='w-1/2'>

            </div>
            <div className='w-1/2'>
                <form onSubmit={handleSubmit(handleNextStep)}>
                    {step === 1 && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="mt-1"
                            />
                            {errors.email && (
                                <p className="text-red-500">
                                    {errors.email.message as string}
                                </p>
                            )}

                            <Button type="submit" className="mt-4">Next</Button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium">
                                OTP
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                {...register('otp', { required: 'OTP is required' })}
                                className="mt-1"
                            />
                            {errors.otp && (
                                <p className="text-red-500">
                                    {errors.otp.message as string}
                                </p>
                            )}

                            <Button type="submit" className="mt-4">Verify OTP</Button>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="mt-1"
                            />
                            {errors.password && (
                                <p className="text-red-500">
                                    {errors.password.message as string}
                                </p>
                            )}

                            <Button type="submit" className="mt-4">Set Password</Button>
                        </div>
                    )}
                </form>
            </div>

        </div>
    );
};

export default MultiStepForm;
