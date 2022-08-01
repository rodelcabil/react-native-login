import React, { useState, useEffect, memo } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator, TouchableHighlight, Modal, TouchableOpacity, Animated } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Form, FormItem, Label } from 'react-native-form-component';
import axios from "axios";
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent
} from "react-native-popup-dialog";
import { set } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LoaderSmall from './ReusableComponents/LottieLoader-Small';
import moment from 'moment';

var width = Dimensions.get('window').width;

const ViewSchedule = ({ route, navigation }) => {
    const [carouselItem, setCarouselItem] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [consultDetails, setConsulttDetails] = useState([]);
    const [imgLoading, setImgLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [titleGC, setTitleGC] = useState(route.params.item?.title);
    const [desceGC, setDescGC] = useState(route.params.item?.description);
    const [dateEnd, setDateEnd] = useState(route.params.item?.date_to);
    const [dateStart, setDateStart] = useState(route.params.item?.date_from);
    const [timefromGC, setTimeFromGC] = useState(moment(route.params.item?.time_from, ["HH.mm"]).format("hh:mm A"));
    const [timeToGC, setTimeToGC] = useState(moment(route.params.item?.time_to, ["HH.mm"]).format("hh:mm A"));

    useEffect(()=>{
        console.log("ROUTEEE",route.params.item);

        const geConsultFormData = async () => {
            setImgLoading(true);
            const token = await AsyncStorage.getItem('token');
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

    const [dialogBox, setDialogBox] = useState(false);

    const deleteEvent = async () => {
        const resp = await axios.delete(
          `https://www.googleapis.com/calendar/v3/calendars/${route.params.email}/events/${route.params.item?.googleEventId}?access_token=${route.params.accessToken}`
        );
        setDialogBox(false);
        //alert("Deleted Successfully");
        setVisibleDelete(true)
        //navigation.navigate('Calendar');
        setTimeout(() => {navigation.navigate('Calendar');}, 1000)

    }

    const [visibleDelete, setVisibleDelete] = useState(false);

    const ModalPoupDelete = ({visible, children}) => {
        const [showModalAdd, setShowModalAdd] = React.useState(visible);
        const scaleValue = React.useRef(new Animated.Value(0)).current;
        React.useEffect(() => {
          toggleModal();
        }, [visible]);
        const toggleModal = () => {
          if (visible) {
            setShowModalAdd(true);
            Animated.spring(scaleValue, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          } else {
            setTimeout(() => setShowModalAdd(false), 500);
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }
        };
        return (
          <Modal transparent visible={showModalAdd}>
            <View style={styles.modalBackGround}>
              <Animated.View
                style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
                {children}
              </Animated.View>
            </View>
          </Modal>
        );
    };

    const DialogBoxDelete = () =>{
        return(
            <ModalPoupDelete visible={visibleDelete}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/sucess.png')}
                style={{height: 150, width: 150, marginVertical: 10}}
              />
            </View>
    
            <Text style={{marginBottom: 20, fontSize: 20, color: 'black', textAlign: 'center'}}>
               Deleted Successfully
            </Text>
          </ModalPoupDelete>
        );
    }


    return (
        <View style={styles.container}>
            <DialogBoxDelete/>
            <AppBar title={route.params.item?.category === "consults" ||  route.params.item?.category === "procedures" ?  route.params.item?.procedures :  titleGC} showMenuIcon={true} />
            <ScrollView>
                <View style={{ paddingHorizontal: 20, paddingTop: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                { route.params.item?.category !== "consults" ? <></> :
               
                <View style={{ height: 340, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                {imgLoading === true ? <ActivityIndicator size="large" animating={true}/>
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
                </View>
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
                                    <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#3a87ad" />
                                                <Text style={styles.tagStyle}>Date From : {dateStart}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#3a87ad" />
                                                <Text style={styles.tagStyle}>Date To : {dateEnd}</Text>
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
                                            <Text style={styles.titleStyle}>{titleGC}</Text>
                                            <View style={styles.rowContainer}>
                                                <Icon name="information" size={23} color="#81c784" />
                                                <Text style={styles.tagStyle}>{desceGC}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#81c784" />
                                                <Text style={styles.scheduleStyle}>{timefromGC} - {timeToGC}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#81c784" />
                                                <Text style={styles.tagStyle}>Date From : {dateStart}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#81c784" />
                                                <Text style={styles.tagStyle}>Date To : {dateEnd}</Text>
                                            </View>
                                                {route.params.item?.googleCalendar === true ?
                                                    <View>
                                                        <TouchableHighlight 
                                                             onPress={() => // setShowModal(true)
                                                            // setEditOpen(true)
                                                             navigation.navigate('Edit Schedule', {
                                                                 item: route.params.item,
                                                                 accessToken: route.params.accessToken,
                                                                 email: route.params.email,
                                                                })
                                                             }
                                                             >
                                                            <View style={styles.editBtn}>
                                                                <Icon name="calendar-edit" size={20} color="white" style={{ marginRight: 5 }} />
                                                                <Text style={styles.textFunc}>EDIT</Text>
                                                            </View>
                                                        </TouchableHighlight>

                                                        <TouchableHighlight onPress={() => setDialogBox(true)}>
                                                            <View style={styles.delBtn}>
                                                                <Icon name="delete-outline" size={20} color="white" style={{ marginRight: 5 }} />
                                                                <Text style={styles.textFunc}>DELETE</Text>
                                                            </View>
                                                        </TouchableHighlight>

                                                        <Dialog
                                                            visible={dialogBox}
                                                            width={300}
                                                            footer={
                                                            <DialogFooter>
                                                                <DialogButton
                                                                text="CANCEL"
                                                                onPress={() => {
                                                                    setDialogBox(false);
                                                                }}
                                                                />
                                                                <DialogButton text="OK" onPress={deleteEvent} />
                                                            </DialogFooter>
                                                            }
                                                        >
                                                            <DialogContent style={{margin: 10,}}>
                                                            <View style={{alignItems: 'center'}}>
                                                                <Image
                                                                    source={require('../assets/askIcon.png')}
                                                                    style={{height: 120, width: 120, marginVertical: 10, resizeMode: 'contain'}}
                                                                />
                                                                </View>
                                                             <Text style={{textAlign: 'center', fontSize: 15, fontWeight: "bold"}}>Are you sure you want to delete this schedule?</Text>
                                                            </DialogContent>
                                                        </Dialog>


                                                    </View> :
                                                    <></>
                                                }

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
    editBtn: {
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        backgroundColor: "#4482b8",
        padding: 10,
    },
    textFunc:{
        fontSize: 15,
        fontWeight: "bold",
        color: 'white'
    },
    delBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        backgroundColor: "#d4534a",
        padding: 10,
    },

    // Modal Design

     //MODAL DESIGN
     safeAreaViewContainerAdd: {
        padding: 15,
        flex: 1,
        backgroundColor: '#fff'
    },
    dateContainer: {
        flexDirection: 'row',
        height: 80,
        paddingHorizontal: 20,
        alignItems: 'center',
        fontSize: 18,
        backgroundColor: '#3a87ad',
    },
    datetimeCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    textPicker: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold'
    },

    inputContainer: {
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        fontSize: 13,
        backgroundColor: 'white',
    },

    inputContainer2: {
        height: 50,
        marginHorizontal: 3,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        fontSize: 13,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonCont: {
        marginHorizontal: 5,
        marginTop: 10,
        backgroundColor: 'green'
    },
    buttonDate: {
        marginHorizontal: 5,
        marginTop: 10,
    },
    logoImg2: {
        width: 50,
        height: 50,
        marginRight: 10,
        marginLeft: 10,
        resizeMode: 'contain',
    },
    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginHorizontal: 3,
        marginBottom: 10,
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '700',
        padding: 5,
        color: 'white',
    },

    //ALERT
          //DIALOG BOX
          modalBackGround: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          modalContainer: {
            width: '70%',
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 30,
            borderRadius: 20,
            elevation: 20,
          },
          header: {
            width: '100%',
            height: 40,
            justifyContent: 'center',
          },
});

export default memo(ViewSchedule);