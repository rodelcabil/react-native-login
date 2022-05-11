import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';
import {
    LineChart,
    BarChart
} from "react-native-chart-kit";
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph'

const SurgeonsInquiriesTab = ({ data, surgeonData }) => {

    return (
        <View style={{ flex: 1, height: 300, backgroundColor: '#fff', padding: 10 }}>
            
            {/* <BarChart
                style={{ borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3' }}
                data={data}
                width={Dimensions.get("window").width - 44}
                height={450}

                chartConfig={{
                    backgroundColor: "#F6F7F9",
                    backgroundGradientFrom: "#F6F7F9",
                    backgroundGradientTo: "#F6F7F9",
                    color: (opacity = 1) => `gray`,
                    labelColor: (opacity = 1) => `gray`,
                }}

                verticalLabelRotation={30}
            /> */}
            <HorizontalBarGraph
                data={surgeonData}
                labels={data.labels}
                width={Dimensions.get("window").width - 44}
                height={350}
                barRadius={5}
                barColor="#e3e3e3"
                barWidthPercentage={0.5}
                baseConfig={{
                    hasYAxisBackgroundLines: true,
                    hasXAxisBackgroundLines: true,
                    xAxisLabelStyle: {
                        rotation: 0,
                        fontSize: 12,
                        width: 150,
                        yOffset: 0,
                        xOffset: -60,
                        margin: 10
                    },
                    yAxisLabelStyle: {

                        fontSize: 13,

                        position: 'bottom',
                        xOffset: 15,
                        decimals: 2,
                        height: 100
                    }
                }}
            />
        </View>
    )
}



export default SurgeonsInquiriesTab