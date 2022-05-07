import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import AppBar from '../../ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Avatar } from 'react-native-paper';
import StatisticsComponent from '../../ReusableComponents/statisticsCoponent';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';


const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};
const Dashboard = () => {

    const [schedule, setSchedule] = useState([]);

    const [hasSched, setHasSched] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/schedules`,
                {
                    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
                }).then(response => {

                const filteredSchedule = response.data.filter(item => moment(item.date_from).format("YYYY-MM-DD") ===  moment(new Date(Date.now())).format("YYYY-MM-DD"));
                console.log("DASHBOARD - SCHEDULES: ", filteredSchedule)
                if(filteredSchedule.length !== 0) {
                    setHasSched(true)
                    setSchedule(filteredSchedule);
                }
                else{
                    setHasSched(false)
                }
               


                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
            console.log("HAS SCHED?: ", hasSched)
        }
        getData()
    }, [])
    return (
        <PaperProvider theme={black_theme}>
            <View style={styles.container}>
                <AppBar title={"Dashboard"} showMenuIcon={false} />
                <ScrollView >
                    <View style={styles.wrapper} >
                        <View>
                            <Text style={styles.text}>Today's schedule</Text>

                            {hasSched === false ?
                                <View style={styles.itemEmptyContainer}>
                                    <Image
                                        style={styles.logoImg}
                                        source={require('../../../assets/calendar.png')}
                                    />
                                    <Text style={styles.text1}>You have no schedule at the moment for this day</Text>
                                </View>
                                :
                                <>
                                    {schedule?.map((item, i) => {

                                        return <Card style={{ borderLeftWidth: 5, marginBottom: 10, borderColor: item.category === 'consults' ? '#da7331' : item.category === 'procedures' ? '#ffc000' : item.category === 'reminder' ? '#3a87ad' : '#81c784' }}>

                                            {item.category === 'reminder' ?
                                                <Card.Content key={i}>
                                                    <View style={styles.columnContainer}>
                                                        <Text style={styles.titleStyle}>{item.title}</Text>
                                                        <View style={styles.rowSchedContainer}>
                                                            <Icon name="information" size={20} color="#3a87ad" style={{ marginRight: 5 }} />
                                                            <Text style={styles.tagStyle}>{item.description}&nbsp;</Text>

                                                        </View>

                                                        <View style={styles.rowSchedContainer}>
                                                            <Icon name="calendar" size={20} color="#3a87ad" style={{ marginRight: 5 }} />
                                                            <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                        </View>
                                                    </View>
                                                </Card.Content>

                                                :

                                                item.category === 'procedures' ?
                                                    <Card.Content key={i}>
                                                        <View style={styles.columnContainer}>
                                                            <Text style={styles.titleStyle}>{item.procedures}</Text>
                                                            <View style={styles.rowSchedContainer}>
                                                                <Icon name="information" size={20} color="#ffc000" style={{ marginRight: 5 }} />
                                                                <Text style={styles.tagStyle}>{item.procedure_description}&nbsp;</Text>

                                                            </View>

                                                            <View style={styles.rowSchedContainer}>
                                                                <Icon name="calendar" size={20} color="#ffc000" style={{ marginRight: 5 }} />
                                                                <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                            </View>
                                                        </View>
                                                    </Card.Content>

                                                    :

                                                    item.category === 'consults' ?
                                                        <Card.Content key={i}>
                                                            <View style={styles.columnContainer}>
                                                                <Text style={styles.titleStyle}>{item.procedures}</Text>
                                                                <View style={styles.rowSchedContainer}>
                                                                    <Icon name="information" size={20} color="#da7331" style={{ marginRight: 5 }} />
                                                                    <Text style={styles.tagStyle}>{item.notes}&nbsp;</Text>

                                                                </View>

                                                                <View style={styles.rowSchedContainer}>
                                                                    <Icon name="calendar" size={20} color="#da7331" style={{ marginRight: 5 }} />
                                                                    <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                </View>
                                                            </View>
                                                        </Card.Content>

                                                        :

                                                        <Card.Content key={i}>
                                                            <View style={styles.columnContainer}>
                                                                <Text style={styles.titleStyle}>{item.title}</Text>
                                                                <View style={styles.rowSchedContainer}>
                                                                    <Icon name="information" size={20} color="#81c784" style={{ marginRight: 5 }} />
                                                                    <Text style={styles.tagStyle}>{item.description}&nbsp;</Text>

                                                                </View>

                                                                <View style={styles.rowSchedContainer}>
                                                                    <Icon name="calendar" size={20} color="#81c784" style={{ marginRight: 5 }} />
                                                                    <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                </View>
                                                            </View>
                                                        </Card.Content>
                                            }

                                        </Card>
                                    }
                                    )}
                                </>
                            }
                        </View>
                        <View>
                            <StatisticsComponent bgColor="#03A9F3" title="CONSULT FORM" count={0} iconName="email-newsletter" iconFolder="Icon" popOverContent={'Overall consult from submitted'} />
                            <StatisticsComponent bgColor="#ED7D31" title="BOOK CONSULTS" count={0} iconName="book-online" iconFolder="MaterialIcon" popOverContent={'Overall booked consults'} />
                            <StatisticsComponent bgColor="#FFC000" title="BOOK PROCEDURES" count={0} iconName="procedures" iconFolder="FAIcon5" popOverContent={'Overall booked procedures'} />
                            <StatisticsComponent bgColor="#00C292" title="COMPLETED PROCEDURES" count={0} iconName="check-circle" iconFolder="FeatherIcon" popOverContent={'Overall completed procedures'} />
                        </View>
                        <List.Accordion
                            title="Report Summary"
                            titleStyle={{ color: '#fff', fontWeight: 'bold' }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                        <List.Accordion
                            title="Monthly Calendar"
                            titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                        <List.Accordion
                            title="Procedures"
                            titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                        <List.Accordion
                            title="Surgeons"
                            titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                        <List.Accordion
                            title="Location"
                            titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                        <List.Accordion
                            title="Source of Inquiry"
                            titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                        <List.Accordion
                            title="Leads Funnel"
                            titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                            <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                            </View>
                        </List.Accordion>
                        <View style={{ marginBottom: 5 }} />
                    </View>
                </ScrollView>
            </View>
        </PaperProvider>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    wrapper: {
        padding: 10,
        flex: 1,
    },
    text: {
        marginBottom: 5,
        fontSize: 16,
        color: '#0E2138',
    },
    columnContainer: {
        flexDirection: 'column',

    },
    rowSchedContainer: {
        flexDirection: 'row',

        alignItems: 'center',

    },
    rowContainer: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between'

    },
    titleStyle: {
        letterSpacing: 0.2,
        fontWeight: '800',
        color: '#0E2138',
        fontSize: 18,
        marginBottom: 10

    },
    tagStyle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#737A87',
        paddingLeft: 10


    },
    scheduleStyle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#737A87',
        paddingLeft: 10

    },
    iconBg: {
        backgroundColor: '#fff',
        borderRadius: 500,
        display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        padding: 10,
        marginRight: 10,
        paddingRight: 5
    },
    itemEmptyContainer: {
        padding: 20,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    text1: {
        marginTop: 15,
        fontSize: 15,
    },
    logoImg: {
        width: 50,
        height: 50,
        opacity: 0.5,
        resizeMode: 'contain',
    },
});

export default Dashboard;
