import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Calendar from './HomeScreens/calendar';
import Dashboard from './HomeScreens/dashsboard';
import Group from './HomeScreens/group';


const Tab = createBottomTabNavigator();

const Home = () => {
    return (
     
        <Tab.Navigator  initialRouteName="Calendar">
            <Tab.Screen name="Dashboard" component={Dashboard} 
                 options={{
                    headerShown:false,
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="view-dashboard" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Calendar" 
                component={Calendar} 
                options={{
                    headerShown:false,
                    tabBarLabel: 'My Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="calendar" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Group" 
                component={Group} 
                options={{
                    headerShown:false,
                    tabBarLabel: 'Group',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-group" color={color} size={size} />
                    ),
                }}/>
        </Tab.Navigator>
       
    );
};  

export default Home;