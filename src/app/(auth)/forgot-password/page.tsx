import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Define the form data interface
interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPassword() {
    const { register, handleSubmit } = useForm<ForgotPasswordFormData>(); // Use the type for form data
    const [isCodeSent, setIsCodeSent] = useState(false);
    const { toast } = useToast();

    // Typed onSubmit function
    const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            setIsCodeSent(true);
            toast({ title: 'Verification code sent to your email' });
        } else {
            toast({ title: 'Error', description: 'Error sending verification code', variant: 'destructive' });
        }
    };

    return (
        <div>
            <h1>Forgot Password</h1>
            {!isCodeSent ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input {...register('email')} placeholder="Enter your email" />
                    <Button type="submit">Send Verification Code</Button>
                </form>
            ) : (
                <p>Check your email for the verification code.</p>
            )}
        </div>
    );
}
