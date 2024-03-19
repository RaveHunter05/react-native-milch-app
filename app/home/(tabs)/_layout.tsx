import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#FDBA74' }}>
            <Tabs.Screen
                name="Registros"
                options={{
                    title: 'Registros',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6
                            name="cash-register"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Reportes"
                options={{
                    title: 'Reportes',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6
                            size={28}
                            name="file-text"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
