import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
    black: '#000000',
    white: '#FFFFFF',
    grey: '#8E8E93',
    yellow: '#FACC15',
};

// Responsive sizing based on screen width
const getResponsiveSizes = (width: number) => {
    // For tablets and larger devices
    if (width >= 768) {
        return {
            pillWidth: Math.min(width * 0.7, 600), // Max width 600 for tablets
            pillHeight: 72,
            iconSize: 24,
            labelSize: 11,
            centerButtonOuter: 65,
            centerButtonInner: 55,
            centerButtonOffset: -48,
            plusIconSize: 28,
            paddingHorizontal: 16,
        };
    }
    // For medium phones (375-768)
    if (width >= 375) {
        return {
            pillWidth: width * 0.92,
            pillHeight: 68,
            iconSize: 22,
            labelSize: 10,
            centerButtonOuter: 60,
            centerButtonInner: 50,
            centerButtonOffset: -45,
            plusIconSize: 26,
            paddingHorizontal: 10,
        };
    }
    // For smaller phones (<375)
    return {
        pillWidth: width * 0.95,
        pillHeight: 60,
        iconSize: 20,
        labelSize: 9,
        centerButtonOuter: 52,
        centerButtonInner: 44,
        centerButtonOffset: -38,
        plusIconSize: 22,
        paddingHorizontal: 8,
    };
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const sizes = getResponsiveSizes(width);

    return (
        <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
            <View style={[
                styles.pill,
                {
                    width: sizes.pillWidth,
                    height: sizes.pillHeight,
                    paddingHorizontal: sizes.paddingHorizontal,
                }
            ]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const label = options.title !== undefined ? options.title : route.name;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Special rendering for the center tab (Post)
                    if (route.name === 'post') {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                activeOpacity={0.8}
                                style={[
                                    styles.centerButtonOuter,
                                    {
                                        width: sizes.centerButtonOuter,
                                        height: sizes.centerButtonOuter,
                                        borderRadius: sizes.centerButtonOuter / 2,
                                        marginTop: sizes.centerButtonOffset,
                                    }
                                ]}
                            >
                                <View style={[
                                    styles.centerButtonInner,
                                    {
                                        width: sizes.centerButtonInner,
                                        height: sizes.centerButtonInner,
                                        borderRadius: sizes.centerButtonInner / 2,
                                    }
                                ]}>
                                    <Feather name="plus" size={sizes.plusIconSize} color={COLORS.yellow} />
                                </View>
                            </TouchableOpacity>
                        );
                    }

                    // Support original Feather icons
                    const getIconName = () => {
                        switch (route.name) {
                            case 'index': return 'home';
                            case 'my-work': return 'briefcase';
                            case 'messages': return 'message-circle';
                            case 'profile': return 'user';
                            default: return 'circle';
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Feather
                                name={getIconName()}
                                size={sizes.iconSize}
                                color={isFocused ? COLORS.black : COLORS.grey}
                            />
                            <Text style={[
                                styles.tabLabel,
                                {
                                    color: isFocused ? COLORS.black : COLORS.grey,
                                    fontSize: sizes.labelSize,
                                }
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 100,
    },
    pill: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 100,
        borderWidth: 2.5,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Neo-brutalism shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    tabLabel: {
        fontWeight: '600',
        marginTop: 2,
    },
    centerButtonOuter: {
        backgroundColor: '#FFF',
        borderWidth: 2.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    centerButtonInner: {
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: COLORS.yellow,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
