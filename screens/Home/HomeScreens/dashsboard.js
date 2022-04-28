import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { StyleSheet, View, Text, Button, Image} from 'react-native';
import AppBar from '../../ReusableComponents/AppBar';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import {GoogleSignin, GoogleSigninButton} from '@react-native-community/google-signin'

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: '909386486823-jd4it3bachacc8fbmp8dfo5clnd4hmru.apps.googleusercontent.com',
  offlineAccess: true
})

class Dashboard extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userGoogleInfo : {},
      loaded: false
    }
  }

  signIn = async() =>{
    try{
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        userGoogleInfo: userInfo,
        loaded: true,
      })
    }
    catch(error){
        console.log(error.message, "error");
    }
  }

  
     handleClick = (name) => {
      if (name === 'sign-in') {
        ApiCalendar.handleAuthClick()
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

    /*utcDateToString = (momentInUTC) => {
      let s = moment.utc(momentInUTC).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      return s;
    };
    
    onClickAddtoCalendar = () => {
      const eventConfig = {
        title: "Title",
        startDate: moment
          .utc("2022-04-20 06:30:00.00")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        endDate: moment
          .utc("2022-04-20 06:30:00.00")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      };
      AddCalendarEvent.presentEventCreatingDialog(eventConfig)
        .then(({ calendarItemIdentifier, eventIdentifier }) => {
          if (calendarItemIdentifier != undefined && eventIdentifier != undefined) {
            console.log("success");
          }
        })
        .catch((error) => {
          // handle error such as when user rejected permissions
          console.warn(error);
        });
    };

    const showCalendarEventWithId = (eventId) => {
      if (!eventId) {
        alert('Please Insert Event Id');
        return;
      }
      const eventConfig = {
        eventId,
        allowsEditing: true,
        allowsCalendarPreview: true,
        navigationBarIOS: {
          tintColor: 'orange',
          backgroundColor: 'green',
        },
      };
    
      AddCalendarEvent.presentEventViewingDialog(eventConfig)
        .then((eventInfo) => {
          alert('eventInfo -> ' + JSON.stringify(eventInfo));
        })
        .catch((error) => {
          alert('Error -> ' + error);
        });
    };*/

    /*const getEvents = () => {
      const CALENDAR_ID = 'camsberts26@gmail.com';
      const API_KEY = 'AIzaSyCDHOhDOJglv7VRLP37-yskTXqjNflfej8';
      const beginDate = moment();
      let url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${beginDate.toISOString()}&maxResults=50&singleEvents=true&orderBy=startTime&pageToken=${pageToken}`;

      fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
              this.setState({
                  pageToken: responseJson.nextPageToken,
                  dataSource: [...dataSource, ...responseJson.items],
                  error: responseJson.error || null,
              });
              console.log(responseJson)
          })
          .then(() => {
              this.getDates()
          }) 
          .catch(error => {
             console.log(error);
          });
  };*/


//var CLIENT_ID = "909386486823-i5gupld1p74t674v4oq0bhj727ban0k7.apps.googleusercontent.com"
//var API_KEY = "AIzaSyCDHOhDOJglv7VRLP37-yskTXqjNflfej8"
//var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
//var SCOPES = "https://www.googleapis.com/auth/calendar.events"

    render() {
      return (
        <View>
            <AppBar title={"Dashboard"} showMenuIcon={false} />
            <Button title="SIGN IN" onPress={this.handleClick('sign-in')}></Button>

            <GoogleSigninButton
                style={{width: 222, height: 40}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this.signIn}
            />
            {this.state.loaded?
              <View>
                <Text>{this.state.userGoogleInfo.user.name}</Text>
                <Text>{this.state.userGoogleInfo.user.email}</Text>
                <Image
                    style={{width: 100, height: 100}}
                    source={{uri: this.state.userGoogleInfo.user.photo}}
                />
                
              </View>

              : <Text>NO</Text>
            }

        </View>
    );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075DA7',
    },

});

export default Dashboard;
