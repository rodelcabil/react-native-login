import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Dimensions } from "react-native";

const LoaderFullScreen = () =>{
    return(
     <View style={styles.loaderContainer}>
          <LottieView
               source={require('../../assets/lottie.json')}
               autoPlay loop
         />
     </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#fff'
    },
})

export default LoaderFullScreen;