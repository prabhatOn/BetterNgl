"use client";
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Define the form data interface
interface ResetPasswordFormData {
    email: string;
    verifyCode: string;
    newPassword: string;
}

export default function ResetPassword() {
    const { register, handleSubmit } = useForm<ResetPasswordFormData>();
    const { toast } = useToast();

    // Use SubmitHandler for type-safe submission
    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            toast({ title: 'Password reset successful' });
        } else {
            const errorData = await response.json();
            toast({ title: 'Error', description: errorData.message || 'Error resetting password', variant: 'destructive' });
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input {...register('email', { required: true })} placeholder="Enter your email" />
                <Input {...register('verifyCode', { required: true })} placeholder="Enter verification code" />
                <Input {...register('newPassword', { required: true })} type="password" placeholder="Enter new password" />
                <Button type="submit">Reset Password</Button>
            </form>
        </div>
    );
}
