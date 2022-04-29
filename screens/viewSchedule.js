import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

var width = Dimensions.get('window').width;
const ViewSchedule = ({ route, navigation }) => {


    const [carouselItem, setCarouselItem] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [consultDetails, setConsulttDetails] = useState([]);
    const [imgLoading, setImgLoading] = useState(true);

    

    useEffect(()=>{
        const geConsultFormData = async () => {
            setImgLoading(true);
            const token = await AsyncStorage.getItem('token');
            console.log(token, "token");
            await fetch('https://beta.centaurmd.com/api/consult-info/'+ route.params.item?.id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(res => res.json())
                .then(resData => {
                    let arrayImages = [];

                    console.log("CONSULT FORM DETAILS", resData);
                    arrayImages.push(resData.front_photo);
                    arrayImages.push(resData.right_side_photo);
                    arrayImages.push(resData.left_side_photo);


                    setCarouselItem(arrayImages);
                    setImgLoading(false)
                    
                });
        }

        geConsultFormData();
    }, []);

    const Loader = () =>{
        return(
            <View style={styles.loaderContainer}>
                <LottieView
                    source={require('../assets/lottie.json')}
                    autoPlay loop
                />
    
            </View>
        )
      }

    const renderItem = ({ item, index }) => {
        return (
            <Image
                key={index}
                style={styles.carouselImg}
                source={{
                    uri: item,
                }}
            />
        )
    }

    

    return (
        <View style={styles.container}>
            <AppBar title={route.params.item?.category === "consults" ||  route.params.item?.category === "procedures" ?  route.params.item?.procedures :  route.params.item?.title} showMenuIcon={true} />
            <ScrollView>
                { route.params.item?.category !== "consults" ? <></> :
                <View style={{ paddingHorizontal: 20, paddingTop: 20, alignItems: 'center', justifyContent: 'center', height: 360, flexDirection: 'column'}}>


                {imgLoading === true ? <Loader />
                :
                <>
                    <Carousel
                        layout={"default"}
                        //   ref={ref => carousel = ref}
                        data={carouselItem}
                        sliderWidth={380}
                        itemWidth={380}
                        renderItem={renderItem}
                        onSnapToItem={index => setActiveIndex(index)} />

                    <Pagination
                        dotsLength={carouselItem.length}
                        activeDotIndex={activeIndex}
                        containerStyle={{ backgroundColor: 'transparent', marginTop: -15 }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,

                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                        }}
                        inactiveDotStyle={{
                            // Define styles for inactive dots here
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        />
                    </>
                            }
                </View>
                }
                {/* <SafeAreaView style={{ paddingHorizontal: 20, paddingTop: 20, color: '# 0E2138' }}>
                    <Text style={styles.textDetailsHeader}>Details</Text>
                </SafeAreaView> */}
                <SafeAreaView style={styles.safeAreaViewContainer}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            marginTop: -30
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
                                       
                                        <View style={styles.rowContainer}>
                                            <Icon name="calendar" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                        </View>
                                        
                                        <View style={styles.rowContainer}>
                                            <EntypoIcon name="location-pin" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.location}</Text>
                                        </View>
                                       
                                        <View style={styles.rowContainer}>
                                            <FontistoIcon name="doctor" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.surgeon}</Text>
                                        </View>
                                        <View style={{marginTop: 10}}>
                                            <Button
                                                style={styles.button}
                                                title="VIEW PATIENT DETAILS"
                                                color="#da7331"
                                                accessibilityLabel="Learn more about this purple button"
                                                onPress={()=>{
                                                    navigation.navigate('View Patient Details', {
                                                        data: route.params.item,
                                                    });
                                                }}
                                            />
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
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <EntypoIcon name="location-pin" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.location}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <FontistoIcon name="doctor" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.surgeon}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="account-group" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.ethnicity}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                {route.params.item?.gender === "male" ? <Icon name="gender-male" size={25} color="#ffc000" /> : <Icon name="gender-female" size={25} color="#ffc000" />}
                                                <Text style={styles.scheduleStyle}>{route.params.item?.gender}</Text>
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
        paddingVertical: 8,


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
        fontSize: 20,
        marginBottom: 10
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
        height: 280,
        borderRadius: 10,
      
    },
    button: {
        borderRadius: 5,
        
      },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});

export default ViewSchedule;