import React, {ReactNode, useEffect} from 'react';
import ApiCalendar from 'react-google-calendar-api/src/ApiCalendar';
import { StyleSheet, View, Text, Button, Image} from 'react-native';
import AppBar from '../../ReusableComponents/AppBar';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import {GoogleSignin, GoogleSigninButton} from '@react-native-community/google-signin'
const Config = require('../../../apiGoogleconfig.json');

const Dashboard = () => {
  
  const sign = false;
  const gapi = null;
  const onLoadCallback = null;
  const calendar = 'primary';

  useEffect(()=>{
    handleClientLoad();
    initClient();
  },[]);

  const initClient = () => {
    gapi = window['gapi'];
    gapi.client
        .init(Config)
        .then(() => {
        // Listen for sign-in state changes.
        gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        if (onLoadCallback) {
            onLoadCallback();
        }
    })
        .catch((e) => {
        console.log(e);
    });
  }

  const handleAuthClick = () => {
    if (gapi) {
        return gapi.auth2.getAuthInstance().signIn();
    }
    else {
        console.log('Error: this.gapi not loaded');
        return Promise.reject(new Error('Error: this.gapi not loaded'));
    }
  }
  
  const handleClientLoad = () => {
    gapi = window['gapi'];
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    script.onload = () => {
        window['gapi'].load('client:auth2', initClient);
    };
}
const updateSigninStatus = (isSignedIn) => {
  sign = isSignedIn;
}

const listenSign = (callback) => {
  if (this.gapi) {
      this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
  }
  else {
      console.log('Error: this.gapi not loaded');
  }
}

     handleClick = (name) => {
      if (name === 'sign-in') {
         handleAuthClick()
        .then(() => {
          console.log('sign in succesful!'); 
        })
        .catch((e) => {
          console.error(`sign in failed ${e}`);
        })
      } else if (name === 'sign-out') {
        ApiCalendar.handleSignoutClick();
      }
    }
  

    return (
        <View>
            <AppBar title={"Dashboard"} showMenuIcon={false} />
            <Button title="SIGN IN" onPress={handleClick('sign-in')}></Button>

        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075DA7',
    },

});

export default Dashboard;
