import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
    deadline: string; // ISO timestamp
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function CircularProgress({
    deadline,
    size = 120,
    strokeWidth = 8,
    className,
}: CircularProgressProps) {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [percentage, setPercentage] = useState(100);
    const [isUrgent, setIsUrgent] = useState(false);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const deadlineTime = new Date(deadline).getTime();
            const difference = deadlineTime - now;

            if (difference <= 0) {
                setTimeRemaining('00:00:00');
                setPercentage(0);
                setIsUrgent(true);
                return;
            }

            // Assuming 48h = 172800000 ms as full duration
            const fullDuration = 48 * 60 * 60 * 1000; // 48 hours
            const elapsed = fullDuration - difference;
            const percent = Math.max(0, Math.min(100, (elapsed / fullDuration) * 100));
            setPercentage(100 - percent); // Invert so it decreases

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setIsUrgent(hours < 6);
            setTimeRemaining(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Color based on percentage
    const getColor = () => {
        if (percentage < 20) return '#EF4444'; // red
        if (percentage < 50) return '#F59E0B'; // orange
        return '#FFDE03'; // yellow
    };

    return (
        <View className={className} style={{ width: size, height: size, position: 'relative' }}>
            <Svg width={size} height={size}>
                {/* Background circle */}
                <Circle
                    stroke="#E5E7EB"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <Circle
                    stroke={getColor()}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>

            {/* Time display in center */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text className="text-xs font-bold text-gray-500">TIME LEFT</Text>
                <Text className={`text-lg font-bold font-mono ${isUrgent ? 'text-red-600' : 'text-karya-black'
                    }`}>
                    {timeRemaining}
                </Text>
                <Text className="text-xs text-gray-500">{Math.round(percentage)}%</Text>
            </View>
        </View>
    );
}
