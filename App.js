/* eslint-disable prettier/prettier */
import * as React from 'react';
import { LogBox } from 'react-native';

import { NavigationContainer, useRoute } from '@react-navigation/native';
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
import ChatClientClass from './screens/Messaging/ChatClientClass';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatClient from './screens/chatClient';
import ChatList from './screens/Messaging/ChatList';

import AddGroup from './screens/Messaging/MessageTabs/addGroup';
import ChatView from './screens/chatView';
import MessageWrapper from './screens/Messaging/MessageTabs/MessageWrapper';
import ChatSetting from './screens/Messaging/MessageTabs/chatSetting';
import AddMembers from './screens/Messaging/MessageTabs/addMember';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  LogBox.ignoreLogs([
    "ViewPropTypes will be removed",
    "ColorPropType will be removed",
  ])

  // const route = useRoute();

  const [userDetails, setUserDetails] = React.useState([])
  const [token, setToken] = React.useState()

  React.useEffect(() => {
    const getUserDetails = async () => {
      const value = await AsyncStorage.getItem('userDetails')
      if (value !== null) {
        setUserDetails(JSON.parse(value))
        console.log("HOME - USER DETAILS: ", value)
      }
    }
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        setToken(token)
      }
    }


    getUserDetails();
    getToken();
    SplashScreen.hide();

  }, [])




  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPasswordPage"
            component={ForgotPasswordPage}

          />
          <Stack.Screen
            name="Home Page"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="View Schedule"
            component={ViewSchedule}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add Schedule"
            component={AddSchedule}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="View Patient Details"
            component={ViewPatientDetails}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Account"
            component={Account}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="API"
            component={APICalls}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Edit Schedule"
            component={EditSchedule}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Add Group"
            component={AddGroup}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Chat Setting"
            component={ChatSetting}
            options={{ headerShown: false }}
          />

          
          <Stack.Screen
            name="Add Members"
            component={AddMembers}
            options={{ headerShown: false }}
          />


          <Stack.Screen
            name="Chat Client"
            // component={ChatClientClass}
            options={{ headerShown: false }}
          >
            {props => <MessageWrapper name={userDetails.first_name + " " + userDetails.last_name} myID={userDetails.id}/>}
          </Stack.Screen>
{/* 
          <Stack.Screen
            name="Chat View"
            component={ChatView}
            options={{ headerShown: false }}

          /> */}




        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
