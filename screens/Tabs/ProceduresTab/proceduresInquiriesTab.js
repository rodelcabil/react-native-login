import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';
import {
    LineChart,
    BarChart
} from "react-native-chart-kit";
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph'
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
const ProceduresInquiriesTab = ({ data, proceduresData, isZero, loader }) => {

    return (
        <View style={{ flex: 1, height: 1000, backgroundColor: '#fff', padding: 10 }}>
            {loader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
                isZero === false ?

                    <HorizontalBarGraph
                        //data={filterDataSOIData}
                        data={proceduresData.reverse()}
                        labels={data.labels.reverse()}
                        width={Dimensions.get("window").width - 44}
                        height={1000}
                        barRadius={5}
                        barColor="#e3e3e3"
                        barWidthPercentage={0.5}
                        baseConfig={{
                            hasYAxisBackgroundLines: true,
                            hasXAxisBackgroundLines: true,
                            xAxisLabelStyle: {
                                rotation: 0,
                                fontSize: 12,
                                width: 200,
                                yOffset: 0,
                                xOffset: -90,
                                margin: 10,
                            },
                            yAxisLabelStyle: {
                                fontSize: 13,
                                position: 'bottom',
                                xOffset: 15,
                                height: 100,
                                decimal: 1
                            }
                        }}

                    />
                    :
                    <HorizontalBarGraph
                        data={[1, 1, 1, 1, 5, 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
                        labels={data.labels}
                        width={Dimensions.get("window").width - 44}
                        height={1000}
                        barRadius={5}
                        barColor="transparent"
                        barWidthPercentage={0.5}
                        baseConfig={{
                            hasYAxisBackgroundLines: true,
                            hasXAxisBackgroundLines: true,
                            xAxisLabelStyle: {
                                rotation: 0,
                                fontSize: 12,
                                width: 200,
                                yOffset: 0,
                                xOffset: -90,
                                margin: 10,

                            },
                            yAxisLabelStyle: {
                                fontSize: 13,
                                position: 'bottom',
                                xOffset: 15,
                                height: 100,
                                decimal: 1,
                                color: 'transparent'
                            }
                        }}
                    />


            }
        </View>
    )
}



export default ProceduresInquiriesTab