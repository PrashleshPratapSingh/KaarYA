import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface CountdownTimerProps {
    deadline: string; // ISO timestamp
    className?: string;
}

export function CountdownTimer({ deadline, className }: CountdownTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const deadlineTime = new Date(deadline).getTime();
            const difference = deadlineTime - now;

            if (difference <= 0) {
                setTimeRemaining('EXPIRED');
                setIsUrgent(true);
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Mark as urgent if less than 6 hours
            setIsUrgent(hours < 6);

            // Format as HH:MM:SS
            const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeRemaining(formatted);
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    return (
        <View className={cn('flex-row items-center gap-2', className)}>
            <View className={cn(
                'border-brutal px-3 py-2',
                isUrgent ? 'bg-red-500 border-red-700' : 'bg-white border-karya-black'
            )}>
                <Text className={cn(
                    'font-mono text-sm font-bold',
                    isUrgent ? 'text-white' : 'text-karya-black'
                )}>
                    ⏱️ {timeRemaining}
                </Text>
            </View>
            {isUrgent && timeRemaining !== 'EXPIRED' && (
                <Text className="text-xs font-bold text-red-600">URGENT!</Text>
            )}
        </View>
    );
}
