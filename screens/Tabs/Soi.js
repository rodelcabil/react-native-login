import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';
import {
    LineChart,
    BarChart
} from "react-native-chart-kit";
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph'
import LoaderSmall from '../ReusableComponents/LottieLoader-Small';

const SOITab = ({ filterDataSOIData, filterDataSOI, ifZeroDataSOI, sourceofinquiryLoader  }) => {
    useEffect(() => {
        console.log('SURGEON CONSULTS TAB: ', ifZeroDataSOI)
    }, [])
    return (
        <View style={{ height: 350,  backgroundColor: '#fff', padding: 10 }}>
               { sourceofinquiryLoader === true ? <View style={{ height: '100%', justifyContent: 'center'}}><LoaderSmall/></View> :
                ifZeroDataSOI === false ?

                <HorizontalBarGraph
                    //data={filterDataSOIData}
                    data={filterDataSOIData.reverse()}
                    labels={filterDataSOI.labels.reverse()}
                    width={Dimensions.get("window").width - 44}
                    height={400}
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
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>No Data</Text>
                </View>
                

              


            }
        </View>
    )
}



export default SOITab