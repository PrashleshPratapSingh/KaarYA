import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

interface BrutalistCardProps extends ViewProps {
    backgroundColor?: 'white' | 'yellow' | 'black';
    children: React.ReactNode;
}

export function BrutalistCard({
    backgroundColor = 'white',
    children,
    className,
    ...props
}: BrutalistCardProps) {
    const bgColors = {
        white: 'bg-white',
        yellow: 'bg-karya-yellow',
        black: 'bg-karya-black',
    };

    return (
        <View
            className={cn(
                'border-brutal border-karya-black',
                bgColors[backgroundColor],
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
}
