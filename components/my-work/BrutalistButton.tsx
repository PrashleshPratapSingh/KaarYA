import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import { cn } from '../../lib/utils';

interface BrutalistButtonProps extends Omit<PressableProps, 'children'> {
    title: string;
    variant?: 'primary' | 'secondary';
}

export function BrutalistButton({
    title,
    variant = 'primary',
    className,
    ...props
}: BrutalistButtonProps) {
    const variants = {
        primary: {
            container: 'bg-karya-yellow',
            text: 'text-karya-black',
        },
        secondary: {
            container: 'bg-karya-black',
            text: 'text-white',
        },
    };

    const style = variants[variant];

    return (
        <Pressable
            className={cn(
                'border-brutal border-karya-black py-4 px-6',
                style.container,
                className
            )}
            {...props}
        >
            <Text className={cn('text-center font-bold text-base tracking-tight', style.text)}>
                {title}
            </Text>
        </Pressable>
    );
}
