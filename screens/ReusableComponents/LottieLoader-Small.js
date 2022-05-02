import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Dimensions } from "react-native";

const LoaderSmall = () =>{
    return(
     <View style={styles.loaderContainer}>
          <LottieView
               source={require('../../assets/lottie.json')}
               autoPlay loop
               resizeMode="cover" 
         />
     </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
})

export default LoaderSmall;