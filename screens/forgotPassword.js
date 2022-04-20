/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, ToastAndroid, KeyboardAvoidingView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState(null);

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "A wild toast appeared!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };


  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      enabled={true}
    >
      <ScrollView  style={{backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <SafeAreaView style={styles.logoSafeAreaStyle}>
            <Image
              style={styles.logoImg}
              source={{
                uri: 'https://beta.centaurmd.com/public/images/centaur_marketing_logo.png',
              }}
            />
          </SafeAreaView>
          <View style={styles.whiteContainer}>
            <SafeAreaView >
              <Text style={styles.textBig}>
                Forget Password?
              </Text>
            </SafeAreaView>
            <SafeAreaView >
              <View style={styles.containerPadding}>
                <Text style={styles.textSmall}>
                  Please enter the email address you register your account with. We will send you the reset password confirmation
                </Text>
              </View>
            </SafeAreaView>

            <SafeAreaView>
              <View style={styles.inputContainer}>
                <Icon name="email-outline" size={20} color="gray" style={{ marginRight: 5 }} />
                <TextInput
                  placeholder="Enter your Email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={text_email => setEmail(text_email)}
                />
              </View>
            </SafeAreaView>

            <SafeAreaView style={styles.buttonSafeAreaStyle}>
              <Button
                style={styles.button}
                title="SUBMIT"
                color="#28A745"
                accessibilityLabel="Learn more about this purple button"
                onPress={() => showToastWithGravityAndOffset()}
              />
            </SafeAreaView>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075DA7',
  },
  whiteContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: '#075DA7',
    borderRadius: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    fontSize: 18,
  },
  containerPadding: {
    paddingTop: 20,
    paddingHorizontal: 28,
    paddingBottom: 15,
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
    color: '#075DA7',
  },
  logoImg: {
    width: 250,
    height: 400,
    resizeMode: 'contain'
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: '#075DA7',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  
  buttonSafeAreaStyle: {
    paddingTop: 10,
    
  },
  button: {
    borderRadius: 5,
  },
  textSmall: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    color: 'black',
  },

});

export default ForgotPasswordPage;
