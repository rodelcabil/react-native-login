import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from "react-native";
import AppBar from '../ReusableComponents/AppBar';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { Searchbar } from 'react-native-paper';



export default class ChatViewClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: '',
      myUuid: uuid.v4(),
      searchQuery: '',
      searchBG: '#fff'
    };
    this.handleSendMessage = this.onSendMessage.bind(this);

  }


  onSendMessage(e) { // (1)
    this.props.onSendMessage(this.state.messages, moment().calendar(), this.state.myUuid);
    this.refs.input.clear();
  }

  render() { // (2)
    const onChangeSearch = query => setSearchQuery(query);
    
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <AppBar title={"Chat"} showMenuIcon={true} />
            <Searchbar
                      style={{width: Dimensions.get('window').width-20, alignSelf: 'center', marginTop: 10, shadowOpacity: 0, elevation: 0, backgroundColor: '#e3e3e3'}}
                      placeholder="Search"
                      onChangeText={onChangeSearch}
                      value={this.props.searchQuery}
                      inputStyle={{fontSize: 15}}
                      // onFocus={()=>{
                      //     this.setState({
                      //       searchBG: '#e3e3e3'
                      //     })
                      // }}
                      // onBlur={()=>{
                      //   this.setState({
                      //       searchBG: '#fff'
                      //     })
                      // }}
              />
            <FlatList
                ref={ref => { this.scrollView = ref }}
                onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
                data={this.props.messages}
                renderItem={this.renderItem}
                style={{ flex: 1, position: 'absolute', bottom: 0, width: Dimensions.get('window').width, zIndex: -100, maxHeight: Dimensions.get('window').height - 150}}
              />
          
        </View>
        <View style={styles.textInputContainer}>
          <TextInput autoFocus
            keyboardType="default"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            placeholder='Type a message'
            style={{
              width: this.state.messages.length === 0 ? Dimensions.get('window').width - 20 : Dimensions.get('window').width - 60,
              alignSelf: 'stretch',
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginLeft: 5,
              marginRight: 5,
              marginVertical: 10,
              fontSize: 14,
              borderRadius: 10,
              backgroundColor: '#e3e3e3',
            }}
            blurOnSubmit={false}
            // onSubmitEditing={this.handleSendMessage}
            value={this.state.messages}
            onChangeText={message => this.setState({ messages: message })}
            ref="input"
            multiline={true}
          />
          <Icon name='send-circle' size={40} color="#3a87ad" onPress={this.handleSendMessage} style={{ display: this.state.messages.length === 0 ? 'none' : 'flex', marginBottom: 12.6}} />
        </View>

      </View >

    );
  }

  renderItem = ({ item }) => {
    const action = item.action;
    const name = item.name;
    const date = item.date;
    const uuid = item.uuid;
   
    if (action == 'join') {
      return <View style={styles.inOutContainer}><Text style={styles.joinPart}>{name} has joined</Text></View>;
    } else if (action == 'part') {
      return <View style={styles.inOutContainer}><Text style={styles.joinPart}>{name} has left</Text></View>;
    } else if (action == 'message') {
      return uuid === this.state.myUuid ?
        <View style={{ flex: 1, padding: 5, flexDirection: 'column', alignItems: 'flex-end', marginBottom: 5, marginRight: 10, }}>
          <Text style={{ textAlign: 'right', maxWidth: 200, fontSize: 12 }}>{date}</Text>
          <Text style={styles.bubbleChatOwn}>{item.message}</Text>

        </View>


        :
        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-start', marginBottom: 5, }}>
          <View style={styles.othersChat}>
            <Avatar.Text size={45} label={item.name[0]} />
            <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-start' }}>

              <Text style={{ maxWidth: 300, textAlign: 'left', fontSize: 12 }}>{name}, {date} </Text>
              <Text style={styles.bubbleChatOthers}>{item.message}</Text>

            </View>
          </View>
        </View>;
    }
  }
}

const styles = StyleSheet.create({
  ownChat: {
    alignItems: 'flex-end',
    marginTop: 10,
    width: Dimensions.get('window').width - 60,
    marginLeft: 30,
  },
  othersChat: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 30,
    width: Dimensions.get('window').width - 60,
    flexDirection: 'row',
  },
  bubbleChatOwn: {
    backgroundColor: "#d6f5ff",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderRadius: 15,
    maxWidth: 300,

  },
  bubbleChatOthers: {
    backgroundColor: "#f0f2f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderRadius: 15,
    textAlign: 'left',
    maxWidth: 300,

  },


  container: {
    flex: 1,
    backgroundColor: '#fff',

    // paddingTop: Constants.statusBarHeight
  },
  username: {

    width: Dimensions.get('window').width - 60,
    alignSelf: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 10,
    fontSize: 14,
    borderRadius: 10,
    backgroundColor: '#e3e3e3',

  },
  messages: {
    flexDirection: 'row',
    color: 'black',
    background: 'orange',
    marginBottom: 60,
    width: Dimensions.get('window').height - 100,

  },
  input: {
    alignSelf: 'stretch',

  },
  joinPart: {
    fontStyle: 'italic',
  },
  inOutContainer: {
    padding: 5,
    width: Dimensions.get('window').width,
    alignItems: 'center'
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopWidth: 0.6,
    borderColor: '#e3e3e3',
    justifyContent: 'space-evenly'
  },
  icon: {
    marginBottom: 12.6
  }
});