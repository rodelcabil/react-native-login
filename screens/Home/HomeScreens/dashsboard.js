import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button } from 'react-native';
import AppBar from '../../ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Avatar, } from 'react-native-paper';
import StatisticsComponent from '../../ReusableComponents/statisticsCoponent';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};







const Dashboard = ({ navigation, route }) => {

    const [schedule, setSchedule] = useState([]);
    const [hasSched, setHasSched] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
    const [index, setIndex] = useState(0);
    const [indexL, setIndexL] = useState(0);
    const layout = useWindowDimensions();
    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const [summary, setSummary] = useState([]);
    const [summaryData, setSummaryData] = useState();
    const [summaryDetails, setSummaryDetails] = useState();

    const initialLayout = { width: Dimensions.get('window').width };

    const [filterData, setFilterData] = useState([]);

    const filters = ['Procedures','Surgeons','Location','Source of Inquiry','Leads Funnel'];


    useEffect(() => {
        const getMySchedule = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/schedules`,
                {
                    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
                }).then(response => {

                    const filteredSchedule = response.data.filter(item => moment(item.date_from).format("YYYY-MM-DD") === moment(new Date(Date.now())).format("YYYY-MM-DD"));
                    console.log("DASHBOARD - SCHEDULES: ", filteredSchedule)
                    if (filteredSchedule.length !== 0) {
                        setHasSched(true)
                        setSchedule(filteredSchedule);
                    }
                    else {
                        setHasSched(false)
                    }
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
            console.log("HAS SCHED?: ", hasSched)
        }
        const getDashboardData = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/main-info`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    setDashboardData(response.data)


                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
            console.log("DASHBOARD DATA: ", dashboardData.data)
        }
        const getReportSumamryData = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/reports-summary`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                   
                    setSummary(response.data)


                    let data= [];  
                    for(var i = 0; i < response.data.datasets.length; i++){
                        data[i] =  response.data.datasets[i].data;
                            
                    }

                   
                    

                    
                    let data2 = [];  
                    for(var i = 0; i < response.data.datasets.length; i++){
                       data2.push({
                            data: response.data.datasets[i].data, 
                            name: response.data.datasets[i].label, 
                            color: response.data.datasets[i].backgroundColor
                        });
                    }
                    

                    const mappedData = data2.map((data) => {
                        const color = data.color;
                        return {
                            ...data,
                            color:() => data.name === 'Dr. Patrick Hsu (0)' ? "#03a9f3" : data.name === 'Dr. Kendall Roehl (0)' ? "#ed7d31" :  data.name === 'Dr. Vasileios Vasilakis (0)' ? "#ffc000" :  data.name === 'MedSpa Provider (0)' ? "#00c292" : '#000000',  
                            backgroundColor: color
                        };
                    });
    
                 

                    console.log("SUMMARY DATA: ", mappedData)
                    setSummaryData(mappedData)
                    // setSummaryDetails(mappedData)
                   

                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
            // console.log("DASHBOARD DATA: ", dashboardData.data)
       
        }
        const getFilteredQuery = async (filter) => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/charts?filter=${filter}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

        
                    console.log("LOCATION DATA: ", response.data)
                    const temoArr = [];
                    temoArr.push(
                        {
                            name: response.data.labels[0],
                            counts: response.data.datasets[0].data[0],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[0],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: response.data.labels[1],
                            counts: response.data.datasets[0].data[1],
                            //counts: 2,
                            color: response.data.datasets[0].backgroundColor[1],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15,
                        }
                    )
                    setFilterData(temoArr)
                    console.log(filterData);
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        }
        getFilteredQuery(filters[2]);
        getMySchedule();
        getDashboardData();
        getReportSumamryData();
    }, [])



    const ConsultFormRoute = () => (
        <View style={{ flex: 1, height: 300, backgroundColor: '#fff', padding: 10 }}>
            <LineChart
                data={{
                    labels: summary.labels,
                    datasets: summaryData
                }}
                width={Dimensions.get("window").width - 44} // from react-native
                height={230}
                yAxisInterval={1}
                
                chartConfig={{
                    backgroundColor: "#F6F7F9",
                    backgroundGradientFrom: "#F6F7F9",
                    backgroundGradientTo: "#F6F7F9",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `gray`,
                    labelColor: (opacity = 1) => `gray`,
                   
                    propsForDots: {
                        r: "7",
                        strokeWidth: "0",
                    }
                }}
                bezier
                style={{borderRadius: 10, borderWidth:1, borderColor: '#e3e3e3'}}
            />
            <View style={styles.typesContainer}>
                {summaryData.map((item, i) =>{
                    return <View style={styles.types} key={i}>
                        <View style={{marginRight: 10, height: 15, width: 15,borderRadius: 15, backgroundColor: item.backgroundColor}}></View>
                        <Text style={styles.text2}>{item.name}</Text>
                    </View>
                })}
            </View>
        </View>
    );
    const ConsultsRoute = () => (
        <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 10 }}>
            <LineChart
                data={{
                    labels: summary.labels,
                    datasets: summaryData
                }}
                width={Dimensions.get("window").width - 44} // from react-native
                height={230}
                yAxisInterval={1}
                
                chartConfig={{
                    backgroundColor: "#F6F7F9",
                    backgroundGradientFrom: "#F6F7F9",
                    backgroundGradientTo: "#F6F7F9",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `gray`,
                    labelColor: (opacity = 1) => `gray`,
                   
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        // stroke: "#ffa726"
                    }
                }}
                bezier
                style={{borderRadius: 10, borderWidth:1, borderColor: '#e3e3e3'}}
            />
             <View style={styles.typesContainer}>
                {summaryData.map((item, i) =>{
                    return <View style={styles.types} key={i}>
                        <View style={{marginRight: 10, height: 15, width: 15,borderRadius: 15, backgroundColor: item.backgroundColor}}></View>
                        <Text style={styles.text2}>{item.name}</Text>
                    </View>
                })}
            </View>
        </View>
    );
    const ProceduresRoute = () => (
        <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 10 }}>
            <LineChart
                data={{
                    labels: summary.labels,
                    datasets: summaryData
                }}
                width={Dimensions.get("window").width - 44} // from react-native
                height={230}
                yAxisInterval={1}
                
                chartConfig={{
                    backgroundColor: "#F6F7F9",
                    backgroundGradientFrom: "#F6F7F9",
                    backgroundGradientTo: "#F6F7F9",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `gray`,
                    labelColor: (opacity = 1) => `gray`,
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        // stroke: "#ffa726"
                    }
                }}
                bezier
                style={{borderRadius: 10, borderWidth:1, borderColor: '#e3e3e3'}}
            />
             <View style={styles.typesContainer}>
                {summaryData.map((item, i) =>{
                    return <View style={styles.types} key={i}>
                        <View style={{marginRight: 10, height: 15, width: 15,borderRadius: 15, backgroundColor: item.backgroundColor}}></View>
                        <Text style={styles.text2}>{item.name}</Text>
                    </View>
                })}
            </View>
        </View>
    );

    const renderScene = SceneMap({
        first: ConsultFormRoute,
        second: ConsultsRoute,
        third: ProceduresRoute
    });


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3a87ad' }}
            style={{ backgroundColor: '#fff', }}
            renderLabel={({ route }) => (
                <Text style={{ color: 'black', margin: 8, textTransform: 'uppercase', fontSize: 12 }}>
                    {route.title}
                </Text>
            )}
        />
    );

    const renderTabBarLocation = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#da7331' }}
            style={{ backgroundColor: '#fff', }}
            renderLabel={({ route }) => (
                <Text style={{ color: 'black', margin: 8, textTransform: 'uppercase', fontSize: 12 }}>
                    {route.title}
                </Text>
            )}
        />
    );


    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };

    const screenWidth = Dimensions.get("window").width;

    const ConsultFormRouteLocation = () => (
        <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 5, alignItems: 'center' }}>
            <View style={styles.rowContainer}>
                    <View style={styles.typesContainer}>
                        <PieChart
                            data={filterData}
                            width={screenWidth/1.8}
                            height={250}
                            chartConfig={chartConfig}
                            accessor={"counts"}
                            backgroundColor={"transparent"}
                            center={[50, 20]}
                            hasLegend={false}
                        />
                    </View>
                    <View style={styles.typesContainerPie}>
                        {filterData.map((item, i) =>{
                                    return(
                                        <View style={styles.typesPie} key={i}>
                                    <View style={{
                                                marginRight: 10,
                                                height: 20,
                                                width: 20,
                                                borderRadius: 15,
                                                backgroundColor: item.color,
                                    }}></View>
                                    <Text style={styles.text2}>{item.name}</Text>
                                    <View style={{marginBottom: 30}}/>
                                </View>
                            )
                        })}
                </View>
            </View>
        </View>
    );
    
    const ConsultsRouteLocation = () => (
        <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 5, alignItems: 'center' }}>
            <View style={styles.rowContainer}>
                    <View style={styles.typesContainer}>
                        <PieChart
                            data={filterData}
                            width={screenWidth/1.8}
                            height={250}
                            chartConfig={chartConfig}
                            accessor={"counts"}
                            backgroundColor={"transparent"}
                            center={[50, 20]}
                            hasLegend={false}
                        />
                    </View>
                    <View style={styles.typesContainerPie}>
                        {filterData.map((item, i) =>{
                                    return(
                                        <View style={styles.typesPie} key={i}>
                                    <View style={{
                                                marginRight: 10,
                                                height: 20,
                                                width: 20,
                                                borderRadius: 15,
                                                backgroundColor: item.color,
                                    }}></View>
                                    <Text style={styles.text2}>{item.name}</Text>
                                    <View style={{marginBottom: 30}}/>
                                </View>
                            )
                        })}
                </View>
            </View>
        </View>
    );
    const ProceduresRouteLocation = () => (
        <View style={{ flex: 1, height: 200, backgroundColor: '#fff', padding: 5, alignItems: 'center' }}>
            <View style={styles.rowContainer}>
                    <View style={styles.typesContainer}>
                        <PieChart
                            data={filterData}
                            width={screenWidth/1.8}
                            height={250}
                            chartConfig={chartConfig}
                            accessor={"counts"}
                            backgroundColor={"transparent"}
                            center={[50, 20]}
                            hasLegend={false}
                        />
                    </View>
                    <View style={styles.typesContainerPie}>
                        {filterData.map((item, i) =>{
                                    return(
                                        <View style={styles.typesPie} key={i}>
                                    <View style={{
                                                marginRight: 10,
                                                height: 20,
                                                width: 20,
                                                borderRadius: 15,
                                                backgroundColor: item.color,
                                    }}></View>
                                    <Text style={styles.text2}>{item.name}</Text>
                                    <View style={{marginBottom: 30}}/>
                                </View>
                            )
                        })}
                </View>
            </View>
        </View>
    );
    
    const renderSceneLocation = SceneMap({
        first: ConsultFormRouteLocation,
        second: ConsultsRouteLocation,
        third: ProceduresRouteLocation
    });

   
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
                                        return <TouchableHighlight
                                            key={i}
                                            style={{ marginBottom: 10, }}
                                            activeOpacity={0.6}
                                            underlayColor="#DDDDDD"
                                            onPress={() => navigation.navigate('View Schedule', {
                                                item: item,
                                            })

                                            }
                                        >

                                            <Card style={{ borderLeftWidth: 5, borderColor: item.category === 'consults' ? '#da7331' : item.category === 'procedures' ? '#ffc000' : item.category === 'reminder' ? '#3a87ad' : '#81c784' }}>

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
                                        </TouchableHighlight>
                                    }
                                    )}
                                </>
                            }
                        </View>
                        <View>
                            <StatisticsComponent bgColor="#03A9F3" title="CONSULT FORM" count={dashboardData?.total_inquiries} iconName="email-newsletter" iconFolder="Icon" popOverContent={'Overall consult from submitted'} />
                            <StatisticsComponent bgColor="#ED7D31" title="BOOK CONSULTS" count={dashboardData?.total_booked_consults} iconName="book-online" iconFolder="MaterialIcon" popOverContent={'Overall booked consults'} />
                            <StatisticsComponent bgColor="#FFC000" title="BOOK PROCEDURES" count={dashboardData?.total_booked_procedures} iconName="procedures" iconFolder="FAIcon5" popOverContent={'Overall booked procedures'} />
                            <StatisticsComponent bgColor="#00C292" title="COMPLETED PROCEDURES" count={dashboardData?.total_completed_procedures} iconName="check-circle" iconFolder="FeatherIcon" popOverContent={'Overall completed procedures'} />
                        </View>
                        <List.Accordion
                            title="Report Summary"
                            titleStyle={{ color: '#fff', fontWeight: 'bold' }}
                            style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', backgroundColor: '#2A2B2F', }}>
                            <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 430, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                    <AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} />
                                    <AntdIcon name="filter" size={25} color="#7e7e7e" />
                                </View>
                                <TabView
                                    navigationState={{ index, routes }}
                                    renderScene={renderScene}
                                    onIndexChange={setIndex}
                                    initialLayout={{ initialLayout }}
                                    renderTabBar={renderTabBar}
                                />


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
                            <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 400, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                  <View style={{paddingHorizontal: 20, paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                    <AntdIcon name="calendar" size={25} color="#7e7e7e" style={{marginRight: 10}}/>
                                    <AntdIcon name="filter" size={25} color="#7e7e7e"/>
                                </View>
                                <TabView
                                    navigationState={{ index, routes }}
                                    renderScene={renderSceneLocation}
                                    onIndexChange={setIndexL}
                                    initialLayout={{initialLayout}}
                                    renderTabBar={renderTabBarLocation}
                                />
                              
                               
                            </View>
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
                            expanded="true"
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
    typesContainerPie: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        display: 'flex',
        marginTop: 20,
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

export default Dashboard;
