import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    progress: number; // 0 to 100
    color?: string;
    label?: string;
    subLabel?: string;
}

export function CircularProgress({
    size = 120,
    strokeWidth = 10,
    progress,
    color = '#FFE500',
    label,
    subLabel
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View className="items-center justify-center" style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    stroke="#E5E7EB"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                {/* Progress Circle */}
                <Circle
                    stroke={color}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            {/* Center Label */}
            <View className="absolute items-center justify-center">
                {label && (
                    <Text className="text-2xl font-extrabold text-karya-black leading-tight">
                        {label}
                    </Text>
                )}
                {subLabel && (
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {subLabel}
                    </Text>
                )}
            </View>
        </View>
    );
}
