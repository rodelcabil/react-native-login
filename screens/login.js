/* eslint-disable prettier/prettier */
import React, {useState,useContext} from 'react';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';


const LoginPage = ({navigation}) => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const {login} = useContext(AuthContext);


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.logoSafeAreaStyle}>
        <Image
          style={styles.logoImg}
          source ={{
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
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          keyboardType="email-address"
          value={email}
          onChangeText={text_email => setEmail(text_email)}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter your Password"
          value={password}
          onChangeText={text_password => setPassword(text_password)}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonSafeAreaStyle}>
        <Button
          style={styles.button}
          title="LOGIN"
          color="#1185AA"
          accessibilityLabel="Learn more about this purple button"
          onPress={()=> {
            login(email, password);
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonSafeAreaStyle}>
        <Text
          onPress={() =>{
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
  logoSafeAreaStyle:{
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
  logoImg:{
    width: 150,
    height: 150,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#1185AA',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  inputSafeAreaStyle:{
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonSafeAreaStyle:{
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  button:{
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
