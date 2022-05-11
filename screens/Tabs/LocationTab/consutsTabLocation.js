import React, {useEffect, useState } from 'react';
import { StyleSheet, View, Text,  Dimensions, } from 'react-native';
import {
    LineChart,
    PieChart
} from "react-native-chart-kit";

const LocationConsultsTab = ({locationdata}) => {
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
    <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 5, alignItems: 'center' }}>
    <View style={styles.rowContainer}>
        <View style={styles.typesContainer}>
            <PieChart
                data={locationdata}
                width={screenWidth / 1.8}
                height={250}
                chartConfig={chartConfig}
                accessor={"counts"}
                backgroundColor={"transparent"}
                center={[50, 20]}
                hasLegend={false}
            />
        </View>
        <View style={styles.typesContainerPie}>
            {locationdata.map((item, i) => {
                return (
                    <View style={styles.typesPie} key={i}>
                        <View style={{
                            marginRight: 10,
                            height: 20,
                            width: 20,
                            borderRadius: 15,
                            backgroundColor: item.color,
                        }}></View>
                        <Text style={styles.text2}>{item.name}</Text>
                        <View style={{ marginBottom: 30 }} />
                    </View>
                )
            })}
        </View>
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

export default LocationConsultsTab