import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COLORS = {
    black: '#000000',
    white: '#FFFFFF',
    grey: '#8E8E93',
    yellow: '#FACC15',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
            <View style={styles.pill}>
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
                                style={styles.centerButtonOuter}
                            >
                                <View style={styles.centerButtonInner}>
                                    <Feather name="plus" size={26} color={COLORS.yellow} />
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
                                size={22}
                                color={isFocused ? COLORS.black : COLORS.grey}
                            />
                            <Text style={[
                                styles.tabLabel,
                                { color: isFocused ? COLORS.black : COLORS.grey }
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
        width: width * 0.92,
        height: 68,
        backgroundColor: '#FFF',
        borderRadius: 100,
        borderWidth: 2.5,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    centerButtonOuter: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        borderWidth: 2.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -45, // Floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    centerButtonInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: COLORS.yellow,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
