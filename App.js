/* eslint-disable prettier/prettier */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen'


import LoginPage from './screens/login';
import ForgotPasswordPage from './screens/forgotPassword';
import Home from './screens/Home/home';
import ViewSchedule from './screens/viewSchedule';
import AddSchedule from './screens/addSchedule';
import ViewPatientDetails from './screens/viewPatientDetails';
import Account from './screens/account';
import APICalls from './screens/apiPage';
import Settings from './screens/Home/HomeScreens/settings';
import EditSchedule from './screens/editCalendar';

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();

const App = () => {

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
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
        <Stack.Screen
          name="Add Schedule"
          component={AddSchedule}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="View Patient Details"
          component={ViewPatientDetails}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Account"
          component={Account}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="API"
          component={APICalls}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Edit Schedule"
          component={EditSchedule}
          options={{headerShown: false}}
        />

      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};

export default App;
