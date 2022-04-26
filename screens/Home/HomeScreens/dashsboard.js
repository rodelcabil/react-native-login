import React from 'react';
import { StyleSheet, View, Text, Button} from 'react-native';
import AppBar from '../../ReusableComponents/AppBar';
import ApiCalendar from 'react-google-calendar-api';
import { gapi } from 'gapi-script'
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import Calendar from 'react-google-calendar-events-list';

const Dashboard = () => {

    /*const handleClick = (name) => {
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

    utcDateToString = (momentInUTC) => {
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

  componentDidMount = () =>{
    let postsUrl = "https://www.googleapis.com/calendar/v3/calendars/camsberts26@gmail.com/events?key=AIzaSyCDHOhDOJglv7VRLP37-yskTXqjNflfej8"
    fetch(postsUrl)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          /*  var standartDataSource=new ListView.DataSource({rowHasChanged: (r1, r2)=>r1!== r2});
            this.setState({
                isLoading:false,
                events:standartDataSource.cloneWithRows(response)
            })*/

        })
} 


    return (
        <View>
            <AppBar title={"Dashboard"} showMenuIcon={false} />
            <Button title="SIGN IN" onPress={componentDidMount}></Button>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075DA7',
    },

});

export default Dashboard;
