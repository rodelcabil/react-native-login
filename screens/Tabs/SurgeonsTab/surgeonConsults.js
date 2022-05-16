import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';
import {
    LineChart,
    BarChart
} from "react-native-chart-kit";
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph'
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';

const SurgeonsConsultsTab = ({ data, surgeonData, isZero, loader }) => {
    useEffect(() => {
        console.log('SURGEON CONSULTS TAB: ', isZero)
    }, [])
    return (
        <View style={{ flex: 1, height: 300, backgroundColor: '#fff', padding: 10 }}>
               { loader === true ? <View style={{ height: '100%', justifyContent: 'center'}}><LoaderSmall/></View> :
                isZero === false ?

                
                <HorizontalBarGraph
                    data={[1, 1, 1, 1, 5, 2, 3, 3, 3, 10]}
                    labels={data.labels}
                    width={Dimensions.get("window").width - 44}
                    height={400}
                    barRadius={5}
                    barColor="transparent"
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
                    //data={filterDataSOIData}
                    data={surgeonData.reverse()}
                    labels={data.labels.reverse()}
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
                            width: 150,
                            yOffset: 0,
                            xOffset: -60,
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
                

            }
        </View>
    )
}



export default SurgeonsConsultsTab