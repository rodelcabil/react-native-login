import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import {
    LineChart,
} from "react-native-chart-kit";


const ConsultsTab = ({ summary, summaryData, monthSelected, loader }) => {
 
    const monthLabel = [];

    if (monthSelected === true) {
        for (var i = 0; i < summary.labels.length; i++) {
            if (i % 3 === 0) {
                monthLabel[i] = summary.labels[i]
            }
            else {
                monthLabel[i] = ""
            }
        }
    }
    console.log('MONTH LABELS: ', monthLabel)

    let arr = [];
    for(var i = 0; i < summaryData.length; i++){
        arr[i] = {data: summaryData[i].data}
    }

    function* yLabel() {
        const min = Math.min(...arr[0].data); // minimum value of data array d
        const max = Math.max(...arr[arr.length - 1].data);  // maximum value of data array d

        yield* [min, '', max]; 
    }

  
   

    const yLabelIterator = yLabel();

    return (
        loader === true ? <View style={{ height: '100%', justifyContent: 'center'}}><LoaderSmall/></View> :
        <View style={{ flex: 1, height: 320, backgroundColor: '#fff', padding: 10 }}>
            <LineChart
                data={{
                    labels: monthSelected === true ? monthLabel : summary.labels,
                    datasets: summaryData
                }}
                width={Dimensions.get("window").width - 44} // from react-native
                height={monthSelected === true ? 350 : 230}
                fromZero={false}
                segments={2}
                verticalLabelRotation={monthSelected === true ? 90 : 0}
                chartConfig={{
                    backgroundColor: "#F6F7F9",
                    backgroundGradientFrom: "#F6F7F9",
                    backgroundGradientTo: "#F6F7F9",
                    decimalPlaces:0, 
                    color: (opacity = 1) => `gray`,
                    labelColor: (opacity = 1) => `gray`,
                    verticalLabelRotation: 60,
                    propsForDots: {
                        r: "7",
                        strokeWidth: "0",
                    },
                    propsForBackgroundLines: {
                        strokeWidth: 1,
                        stroke: '#BABFC4',
                        strokeDasharray: '0',
                    },
                }}
                bezier
                style={{ borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3' }}
                formatYLabel={() => yLabelIterator.next().value}
            />
            <View style={styles.typesContainer}>
                {summaryData.map((item, i) => {
                    return <View style={styles.types} key={i}>
                        <View style={{ marginRight: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: item.backgroundColor }}></View>
                        <Text style={styles.text2}>{item.name}</Text>
                    </View>
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    types: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        marginBottom: 5,
        marginRight: 20
    },
    typesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        display: 'flex',
        marginTop: 20,
        flexWrap: 'wrap'

    },

    typesPie: {
        flexDirection: 'row',
        display: 'flex',
        marginBottom: 5,
    },



    text2: {
        fontSize: 12,
        color: 'black'
    },
    // types: {
    //     flexDirection: 'row',
    //     alignItems: 'flex-start',
    // },
    // typesContainer: {
    //     alignItems: 'flex-start',
    //     justifyContent: 'flex-start',
    //     marginTop: 10
    // },
});

export default ConsultsTab