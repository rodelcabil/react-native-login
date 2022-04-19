/* eslint-disable prettier/prettier */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from './screens/login';
import ForgotPasswordPage from './screens/forgotPassword';
import Home from './screens/home';

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
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="HomePage"
          component={Home}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
