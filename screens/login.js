/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginPage = ({ navigation }) => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  loginFunction = async () => {
    await fetch('https://beta.centaurmd.com/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email_address": email, "password": password }),
    }).then(res => res.json())
      .then(resData => {
        console.log("my data",resData);
        // navigation.navigate('HomePage');
      }).catch(e => {
        // ToastAndroid.show("Invalid Login Credentials !", ToastAndroid.SHORT);
      });
  };

  //  jayar@centaurmarketing.co H1stmj8e4s62xz6c

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.logoSafeAreaStyle}>
        <Image
          style={styles.logoImg}
          source={{
            uri: 'https://media.discordapp.net/attachments/965809658054971413/965812475406725151/unknown.png',
          }}
        />
      </SafeAreaView>
      <SafeAreaView >
        <Text style={styles.textBig}>
          SIGN IN
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.inputSafeAreaStyle}>

        <View style={styles.inputContainer}>
          <Icon name="email-outline" size={20} color="gray" style={{ marginRight: 5 }} />
          <TextInput
            placeholder="Enter your Email"
            keyboardType="email-address"
            value={email}
            onChangeText={text_email => setEmail(text_email)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={20} color="gray" style={{ marginRight: 5 }} />
          <TextInput
            secureTextEntry
            placeholder="Enter your Password"
            value={password}
            onChangeText={text_password => setPassword(text_password)}
          />
        </View>

      </SafeAreaView>
      <SafeAreaView style={styles.buttonSafeAreaStyle}>
        <Button
          style={styles.button}
          title="LOGIN"
          color="#1185AA"
          accessibilityLabel="Learn more about this purple button"
          onPress={loginFunction}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonSafeAreaStyle}>
        <Text
          onPress={() => {
            navigation.navigate('ForgotPasswordPage');
          }}
          style={styles.textSmall}>
          Forgot Password?
        </Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    height: 50,
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1185AA',
    borderRadius: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  logoSafeAreaStyle: {
    height: 300,
    display: 'flex',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBig: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '500',
    color: '#1185AA',
  },
  logoImg: {
    width: 150,
    height: 150,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: '#1185AA',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  inputSafeAreaStyle: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonSafeAreaStyle: {
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  button: {
    borderRadius: 5,
  },
  textSmall: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    color: '#1185AA',
  },

});

export default LoginPage;
