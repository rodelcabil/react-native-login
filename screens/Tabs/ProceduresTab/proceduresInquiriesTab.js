import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';
import {
    LineChart,
    BarChart
} from "react-native-chart-kit";
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph'

const ProceduresInquiriesTab = ({ data, proceduresData }) => {

    return (
        <View style={{ flex: 1, height: 1000, backgroundColor: '#fff', padding: 10 }}>
                
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
                    data={proceduresData}
                    labels={data.labels.reverse()}
                    width={Dimensions.get("window").width - 44}
                    height={1000}
                    barColor="#e3e3e3"
                    barWidthPercentage={0.6}
                    baseConfig={{
                        hasYAxisBackgroundLines: true,
                        hasXAxisBackgroundLines: true,
                        xAxisLabelStyle: {
                            rotation: 0,
                            fontSize: 10,
                            width: 200,
                            yOffset: 0,
                            xOffset: -90,
                            margin: 10
                        },
                        yAxisLabelStyle: {

                            fontSize: 13,

                            position: 'bottom',
                            xOffset: 15,
                            decimals: 0,
                            height: 100
                        }
                    }}
                />
            </View>
    )
}



export default ProceduresInquiriesTab