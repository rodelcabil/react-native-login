import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width;
const ViewSchedule = ({ route }) => {

    const [carouselItem, setCarouselItem] = useState([
        { src: 'https://images.unsplash.com/photo-1612277795259-607df5c06e6d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGF0aWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60' },
        { src: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHBhdGllbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60' },
        { src: 'https://media.istockphoto.com/photos/happy-young-indian-doctor-discussing-treatment-with-african-patient-picture-id1337312743?b=1&k=20&m=1337312743&s=170667a&w=0&h=OOkHSgQkR8yyLEW_maRVoxD7aMyRVRzt22Ln0ZSPT14=' },
        { src: 'https://images.unsplash.com/photo-1576091358783-a212ec293ff3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y29uc3VsdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60' },
        { src: 'https://images.unsplash.com/photo-1631217872822-1c2546d6b864?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGNvbnN1bHR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60' },

    ]);
    const [activeIndex, setActiveIndex] = useState(0);

    const renderItem = ({ item, index }) => {
        return (
            <Image
                key={index}
                style={styles.carouselImg}
                source={{
                    uri: item.src,
                }}
            />
        )
    }

    return (
        <View style={styles.container}>
            <AppBar title={route.params.item?.title} showMenuIcon={true} />
            <ScrollView>
                <View style={{ paddingHorizontal: 20, paddingTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <Carousel
                        layout={"default"}
                        //   ref={ref => carousel = ref}
                        data={carouselItem}
                        sliderWidth={380}
                        itemWidth={380}
                        renderItem={renderItem}
                        onSnapToItem={index => setActiveIndex(index)} />
                </View>

                <SafeAreaView style={{ paddingHorizontal: 20, paddingTop: 20, color: '# 0E2138' }}>
                    <Text style={styles.textDetailsHeader}>Details</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.safeAreaViewContainer}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 10,

                        }}>
                        {route.params.item?.category === "reminder" ?
                            <>
                                <View style={styles.columnContainer}>
                                    <Text style={styles.titleStyle}>{route.params.item?.title}</Text>
                                    <View style={styles.rowContainer}>
                                        <Icon name="information" size={23} color="#3a87ad" />
                                        <Text style={styles.tagStyle}>{route.params.item?.description}</Text>
                                    </View>
                                        <View style={styles.border} />
                                    <View style={styles.rowContainer}>
                                        <Icon name="calendar" size={23} color="#3a87ad" />
                                        <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                    </View>
                                    
                                </View>
                            </>
                            :
                            route.params.item?.category === "consults" ?
                                <>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.titleStyle}>{route.params.item?.procedures}</Text>
                                        <View style={styles.rowContainer}>
                                            <Icon name="information" size={23} color="#da7331" />
                                            <Text style={styles.tagStyle}>{route.params.item?.notes}</Text>
                                        </View>
                                        <View style={styles.border} />
                                        <View style={styles.rowContainer}>
                                            <Icon name="calendar" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                        </View>
                                    </View>
                                </>
                                :

                                route.params.item?.category === "procedures" ?
                                    <>
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.titleStyle}>{route.params.item?.procedures}</Text>
                                            <View style={styles.rowContainer}>
                                                <Icon name="information" size={23} color="#ffc000" />
                                                <Text style={styles.tagStyle}>{route.params.item?.procedure_description}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                            </View>
                                        </View>
                                    </>
                                    :

                                    <>
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.titleStyle}>{route.params.item?.title}</Text>
                                            <View style={styles.rowContainer}>
                                                <Icon name="information" size={23} color="#81c784" />
                                                <Text style={styles.tagStyle}>{route.params.item?.description}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#81c784" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                            </View>
                                        </View>
                                    </>
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Roboto",

    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderLeftColor: 'green',
        borderLeftWidth: 5,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    safeAreaViewContainer: {
        padding: 20,
        flex: 1,

    },
    columnContainer: {
        flexDirection: 'column',

    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 5,
        padding: 15,


    },
    border: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#EFF3F6',
        marginLeft: 55,
        marginRight: 20
    },
    titleStyle: {
        letterSpacing: 0.2,
        fontWeight: '800',
        color: '#0E2138',
        fontSize: 18,
    },
    tagStyle: {

        fontSize: 16,
        color: '#737A87',
        paddingHorizontal: 20
    },
    scheduleStyle: {

        fontSize: 16,
        color: '#737A87',
        paddingHorizontal: 20
    },
    textDetailsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    carouselImg: {
        width: 380,
        height: 200,
        borderRadius: 10
    },

});

export default ViewSchedule;