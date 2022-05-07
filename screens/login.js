import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, KeyboardAvoidingView, ScrollView, ActivityIndicator, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderFullScreen from './ReusableComponents/LottieLoader-FullScreen';
import LoaderSmall from './ReusableComponents/LottieLoader-Small';

//  jayar@centaurmarketing.co H1stmj8e4s62xz6c

const LoginPage = ({ navigation }) => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [gToken, setToken] = useState(null);
  const [loader, setLoader] = useState(true);
  const [loginLoader, setLoginLoader] = useState(false);
  const [userDetails, setUserDetails] = useState(false);

  useEffect(()=>{
    const setBaseURL = async () => {
      await AsyncStorage.setItem('BASE_URL', 'beta.centaurmd.com');
    };
    
    getBaseURL();
    setBaseURL();
    tokenLogin();
  },[])

  const getBaseURL = async () => {
     
    try {
      const data = await AsyncStorage.getItem('BASE_URL');
      if (data !== null) {
        console.log("URL: ", data)
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tokenLogin = async () => {
    const value = await AsyncStorage.getItem('token')
    if (value !== null) {
      navigation.replace('Home Page', {
        token: value,
      });
      console.log("still logged in");
    }
    else {
      setLoader(false);
    }
    setLoader(false);
  }

  loginFunction = async () => {
    setLoginLoader(true);
    const BASE_URL = await AsyncStorage.getItem('BASE_URL');
    console.log("BASE URL: ", BASE_URL)

    await fetch(`https://${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email_address": email, "password": password }),
    }).then(res => res.json())
      .then(resData => {
        // console.log("Token",resData.token);
        console.log("ACCOUNT DETAILS: ", resData)
        if (resData.status === 'success' && (email !== '' || password !== '')) {
          setToken(resData.token);

          const storeToken = async () => {
            await AsyncStorage.setItem('token', resData.token);
          };
          navigation.replace('Home Page', {
            details: resData.user,
            token: resData.token,
          });
          const userDetails = async () => {
            await AsyncStorage.setItem('userDetails', JSON.stringify(resData.user));
          };

          userDetails();
          storeToken();
          setEmail(null);
          setPassword(null);
          setLoginLoader(false);
        }
        else {
          alert(resData.message);
          setLoginLoader(false);
        }

      });
  };

  return (
    loader === true ? <LoaderFullScreen /> :
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={true}
      >
        <ScrollView style={{ backgroundColor: '#fff' }}>
          <View style={styles.blueContainer}>

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
                  LOGIN TO YOUR ACCOUNT
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

              {loginLoader === true ? <View style={{ height: "30%" }}>
                <LoaderSmall />
              </View> :
                <View>
                  <SafeAreaView style={styles.buttonSafeAreaStyle}>
                    <Button
                      style={styles.button}
                      title="SIGN IN"
                      color="#28A745"
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
              }
            </View>



          </View>
        </ScrollView>
      </KeyboardAvoidingView>


  );
};

const styles = StyleSheet.create({
  blueContainer: {
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
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#075DA7',
    borderRadius: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    fontSize: 18,
  },
  logoSafeAreaStyle: {
    height: 300,
    display: 'flex',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBig: {
    marginTop: 10,
    marginBottom: 10,
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
  // inputSafeAreaStyle: {
  //   paddingLeft: 20,
  //   paddingRight: 20,
  // },
  buttonSafeAreaStyle: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  button: {

    borderRadius: 5,
  },
  textSmall: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    color: '#ff2e44',
  },
  textOr: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: 'grey',
    marginVertical: 10
  },
});

export default LoginPage;
