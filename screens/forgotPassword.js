/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState(null);


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

            <SafeAreaView style={styles.inputSafeAreaStyle}>
              <View style={styles.inputContainer}>
                <Icon name="email-outline" size={20} color="gray" style={{marginRight: 5}}  />
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
                    color="#1185AA"
                    accessibilityLabel="Learn more about this purple button"
                    onPress={loginFunction}
                />
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
    containerPadding: {
        paddingTop: 20,
        paddingHorizontal: 28,
        paddingBottom: 15,
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
      width: 200,
      height: 200,
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
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '500',
      color: 'black',
    },
  
  });

export default ForgotPasswordPage;
