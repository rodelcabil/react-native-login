import React from 'react';
import { StyleSheet, Text, View,TextInput, FlatList, KeyboardAvoidingView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from "react-native";


export default class ChatViewClass extends React.Component {
  constructor(props) {
    super(props);

    this.handleSendMessage = this.onSendMessage.bind(this);
  
  }

  onSendMessage(e) { // (1)
    this.props.onSendMessage(e.nativeEvent.text);
    this.refs.input.clear();
  }

  render() { // (2)
    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
      <View style={styles.container}>
              <View style={{width: "100%", padding: 15, flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5,}}>
                <Icon name="arrow-back" size={20} color="black" style={{display:'flex'}} onPress={()=> navigation.goBack()}/>
                <Text style={{fontSize: 15, marginLeft: 10, color: 'black', fontWeight: 'bold'}}>Group Chat Name</Text>
              </View>
        <FlatList 
                  data={ this.props.messages } 
                  renderItem={ this.renderItem }
                  styles={ styles.messages } />
      </View>
      <TextInput autoFocus
                   keyboardType="default"
                   returnKeyType="done"
                   enablesReturnKeyAutomatically
                   placeholder='Enter Chat'
                   style={ styles.username }
                   blurOnSubmit={ false }
                   onSubmitEditing={ this.handleSendMessage }
                   ref="input"
                   />
      </View>

    );
  }

  renderItem({ item }) { // (3)
    const action = item.action;
    const name = item.name;
    //const nameprops = this.props.name;

    if (action == 'join') {
        return <View style={styles.inOutContainer}><Text style={ styles.joinPart }>{ name } has joined</Text></View>;
    } else if (action == 'part') {
        return <View style={styles.inOutContainer}><Text style={ styles.joinPart }>{ name } has left</Text></View>;
    } else if (action == 'message') {
        return "Jim Trillana" === name ?
            <View style={styles.ownChat}>
              <View style={{flexDirection: 'column'}}>
                <Text style = {styles.bubbleChatOwn}>{ item.message }</Text>
              </View>
            </View>
            :
            <View style={styles.othersChat}>
                <Image
                    style={styles.profileImage}
                    source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/194/194915.png',
                    }}
                />
               <View style={{flexDirection: 'column', marginLeft: 10, marginTop: 5}}>
                <Text>{ name } </Text>
                <Text style = {styles.bubbleChatOthers}>{ item.message }</Text>
              </View>
            </View>;
    }
  }
}

const styles = StyleSheet.create({
  ownChat: {
    alignItems: 'flex-end',
    marginTop: 10,
    width: Dimensions.get('window').width-45,
    marginLeft: 30,
  },
  othersChat:{
    marginTop: 15,
    marginLeft: 10,
    marginRight: 30,
    width: Dimensions.get('window').width-60,
    flexDirection: 'row',
  },
  bubbleChatOwn:{
    backgroundColor: "#d6f5ff",
    padding:10,
    borderRadius: 5,
    marginTop: 5,
    borderRadius: 15,
  },
  bubbleChatOthers:{
    backgroundColor: "#f0f2f0",
    padding:10,
    borderRadius: 5,
    marginTop: 5,
    borderRadius: 15,
  },


  container: {
    flex: 1,
    backgroundColor: '#fff',

    // paddingTop: Constants.statusBarHeight
  },
  username: {
    bottom: 0,
    width: Dimensions.get('window').width-20,
    alignSelf: 'stretch',
    borderWidth: 1.5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#3a87ad',
    borderRadius: 10,
    backgroundColor: 'white'
},
  messages: {
    alignSelf: 'stretch',
    color: 'black',
    flex: 1,
    backgroundColor: 'green'
  },
  input: {
    alignSelf: 'stretch',

  },
  joinPart: {
    fontStyle: 'italic',
  },
  inOutContainer:{
    padding: 5,
    width: Dimensions.get('window').width,
    alignItems: 'center'
  },

  profileImage:{
    width: 40,
    height: 40,
    borderRadius: 40,
},
});