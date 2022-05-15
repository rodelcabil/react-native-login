import React, {useEffect, useState } from 'react';
import { StyleSheet, View, Text,  Dimensions, } from 'react-native';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import {
    LineChart,
    PieChart
} from "react-native-chart-kit";


const WeeklyCTab = ({locationdata, loader}) => {
    const screenWidth = Dimensions.get("window").width;
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgb(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };


  return (
    loader === true ? <View style={{ height: '100%', justifyContent: 'center'}}><LoaderSmall/></View> :
    <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 5, alignItems: 'center' }}>
    <View style={styles.rowContainer}>

    </View>
</View>
  )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between'

    },
    typesPie: {
        flexDirection: 'row',
        display: 'flex',
        marginBottom: 5,
    },
    typesContainerPie: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        display: 'flex',
        marginTop: 20,
    },


    text2: {
        fontSize: 12,
        color: 'black'
    },
}); 

export default WeeklyCTab