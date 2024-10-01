'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed z-50 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg w-[90vw] max-w-md',
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute top-4 right-4">
                <X className="w-5 h-5" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('mb-4', className)} {...props}>
        {children}
    </div>
);

export const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn('text-lg font-semibold text-gray-800 dark:text-gray-100', className)}
        {...props}
    />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

