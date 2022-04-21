/* eslint-disable prettier/prettier */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from './screens/login';
import ForgotPasswordPage from './screens/forgotPassword';
import Home from './screens/home';
import ViewSchedule from './screens/viewSchedule';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPasswordPage"
          component={ForgotPasswordPage}
          
        />
        <Stack.Screen
          name="Home Page"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="View Schedule"
          component={ViewSchedule}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
