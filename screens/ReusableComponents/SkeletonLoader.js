import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const SkeletonLoaderCard = () => {
    return(
        <SkeletonPlaceholder >
        <SkeletonPlaceholder
            speed={1500}
            backgroundColor={"#dddddd"}
            highlightColor={"#e7e7e7"}>
            <View
            style={styles.skeltonMainView}
            />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder
            speed={1500}
            backgroundColor={"#dddddd"}
            highlightColor={"#e7e7e7"}>
            <View
            style={styles.skeltonMainView}
            />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder
            speed={1500}
            backgroundColor={"#dddddd"}
            highlightColor={"#e7e7e7"}>
            <View
            style={styles.skeltonMainView}
            />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder
            speed={1500}
            backgroundColor={"#dddddd"}
            highlightColor={"#e7e7e7"}>
            <View
            style={styles.skeltonMainView}
            />
        </SkeletonPlaceholder>
        <View></View>
    </SkeletonPlaceholder>
    )
}

const styles = StyleSheet.create({
    skeltonMainView: {
        margin: 10,
        borderWidth: 0,
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderRadius: 5,
        alignSelf: "center",
        width: Dimensions.get('window').width-20,
        height: Dimensions.get('window').height / 6,
        borderRadius: 20,
        // height: globals.screenHeight * 0.24,
      },


})

export default SkeletonLoaderCard;