import React from 'react';
import { StyleSheet, Text, View,TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
// import { Constants } from 'expo';
import { Dimensions } from "react-native";
var width = Dimensions.get('window').width - 20;

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
      <View style={styles.container}>
        <FlatList data={ this.props.messages } 
                  renderItem={ this.renderItem }
                  styles={ styles.messages } />
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

  renderItem({item}) { // (3)
    const action = item.action;
    const name = item.name;

    if (action == 'join') {
        return <Text style={ styles.joinPart }>{ name } has joined</Text>;
    } else if (action == 'part') {
        return <Text style={ styles.joinPart }>{ name } has left</Text>;
    } else if (action == 'message') {
        return <Text>{ name }: { item.message }</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingTop: Constants.statusBarHeight
  },
  username: {
    position: 'absolute',
    bottom: 0,
    width: width,
    alignSelf: 'stretch',
    borderWidth: 1.5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#3a87ad',
    borderRadius: 10
},
  messages: {
    alignSelf: 'stretch',
    color: 'black',
    backgroundColor: 'yellow'
  },
  input: {
    alignSelf: 'stretch'
  },
  joinPart: {
    fontStyle: 'italic'
  }
});