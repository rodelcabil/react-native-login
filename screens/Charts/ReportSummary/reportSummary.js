import React, { ReactNode, useEffect, useState } from 'react';

import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button, Modal, Animated, TouchableOpacity } from 'react-native';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import moment from 'moment';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

import InquiriesTab from '../../Tabs/ReportsSummaryTab/InquiriesTab';
import ConsultsTab from '../../Tabs/ReportsSummaryTab/consutsTab';
import ProceduresTab from '../../Tabs/ReportsSummaryTab/proceduresTab';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const ReportSummary = ({route}) => {

    const today = moment(new Date(Date.now()));
  

    const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
    const endOfYear = today.endOf('year').format("YYYY-MM-DD");

    const [dateFrom, setDateFrom] = useState(begginingOfYear);
    const [dateTo, setDateTo] = useState(endOfYear);
    const [reportSummaryLoader, setReportSummaryLoader] = useState(true);
    const [filterTextRS, setFilterTextRS] = useState(null);

    const [summaryDataNames, setSummaryDatanames] = useState([]);
    const [toggleCheckBox1, setToggleCheckBox1] = useState(false)
    const [toggleCheckBox2, setToggleCheckBox2] = useState(false)
    const [toggleCheckBox3, setToggleCheckBox3] = useState(false)
    const [toggleCheckBox4, setToggleCheckBox4] = useState(false)
    const [toggleCheckBox5, setToggleCheckBox5] = useState(false)

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const [summaryInquiries, setSummaryInquiries] = useState([]);
    const [summaryDataInquiries, setSummaryDataInquiries] = useState();
    const [summaryConsults, setSummaryConsults] = useState([]);

    const [summaryDataConsults, setSummaryDataConsults] = useState();
    const [summaryProcedures, setSummaryProcedures] = useState([]);
    const [summaryDataProcedures, setSummaryDataProcedures] = useState();

    const [monthSelected, setmonthSelected] = useState(false);

    const initialLayout = { width: Dimensions.get('window').width };

    useEffect(() => {
        getReportSummaryData();
    }, []);


    const mappedNames = summaryDataNames.map((item, i, name) => {
        if (i + 1 === name.length) {
            return `data%5B%5D=${item}`
        } else {
            return `data%5B%5D=${item}&`
        }
    })


    let removeComma;


    const getSummaryFilterData = async () => {
        
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${dateFrom}&dateto=${dateTo}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("FILTER REPORT SUMMARY INQUIRIES: ", mappedData)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${dateFrom}&dateto=${dateTo}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("FILTER REPORT SUMMARY CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${dateFrom}&dateto=${dateTo}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                // console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);
                console.log("FILTER REPORT SUMMARY PROCEDURES: ", mappedData)

            })
    }

    const renderScene = SceneMap({
        first: () => <InquiriesTab summary={summaryInquiries} summaryData={summaryDataInquiries} monthSelected={monthSelected} loader={reportSummaryLoader}/>,
        second: () => <ConsultsTab summary={summaryConsults} summaryData={summaryDataConsults} monthSelected={monthSelected} loader={reportSummaryLoader}/>,
        third: () => <ProceduresTab summary={summaryProcedures} summaryData={summaryDataProcedures} monthSelected={monthSelected} loader={reportSummaryLoader}/>
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

    const clearFilter = () => {
        getReportSummaryData();
        setToggleCheckBox1(false);
        setToggleCheckBox2(false);
        setToggleCheckBox3(false);
        setToggleCheckBox4(false);
        setToggleCheckBox5(false);
        setSummaryDatanames([])

    }

    const getReportSummaryData = async () => {

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfCurrentWeek);
        setDateTo(endOfWeek)

        setmonthSelected(false)

        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;



        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Inquiries&`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);


            })

    }

    const getReportSummaryDataThisWeek = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('week').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('week').format("YYYY-MM-DD");

        setDateFrom(begginingOfCurrentWeek);
        setDateTo(endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextRS(setText);
        

        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);


            })

    }

    const getReportSummaryDataThisMonth = async () => {
        setmonthSelected(true)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfMonth = today.startOf('month').format("YYYY-MM-DD");
        const endOfMonth = today.endOf('month').format("YYYY-MM-DD");

        removeComma = mappedNames.toString().replace(/,/g, '')

        setDateFrom(begginingOfMonth);
        setDateTo(endOfMonth);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("SUMMARY DATA INQUIRIES: ", response.data.labels)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);


            })

    }
    const getReportSummaryDataLastMonth = async () => {
        setmonthSelected(true)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'month');
        const begginingOfLastMonth = today.startOf('month').format("YYYY-MM-DD");
        const endOfLastMonth = today.endOf('month').format("YYYY-MM-DD");

        removeComma = mappedNames.toString().replace(/,/g, '')

        setDateFrom(begginingOfLastMonth);
        setDateTo(endOfLastMonth);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);


            })

    }

    const getReportSummaryDataThisYear = async () => {
        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfYear = today.endOf('year').format("YYYY-MM-DD");

        removeComma = mappedNames.toString().replace(/,/g, '')

        setDateFrom(begginingOfYear);
        setDateTo(endOfYear);


        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfYear}&dateto=${endOfYear}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfYear}&dateto=${endOfYear}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfYear}&dateto=${endOfYear}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);


            })

    }

    const getReportSummaryDataLastYear = async () => {
        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'year');
        const begginingOfLastYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfLastYear = today.endOf('year').format("YYYY-MM-DD");

        removeComma = mappedNames.toString().replace(/,/g, '')

        setDateFrom(begginingOfLastYear);
        setDateTo(endOfLastYear);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                setReportSummaryLoader(false);


            })

    }

    const getReportSummaryDataLastTwoYears = async () => {
        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(2, 'year');
        const begginingOfLastTwoYears = today.startOf('year').format("YYYY-MM-DD");
        const endOfLastTwoYears = today.endOf('year').format("YYYY-MM-DD");

        removeComma = mappedNames.toString().replace(/,/g, '')

        setDateFrom(begginingOfLastTwoYears);
        setDateTo(endOfLastTwoYears);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData);
                setReportSummaryLoader(false);
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)



            })

    }


    const getReportSummaryDataRangeDate = async (startDate, endDate) => {
        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        removeComma = mappedNames.toString().replace(/,/g, '')

        setDateFrom(startDate);
        setDateTo(endDate);


        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${startDate}&dateto=${endDate}&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });
                setSummaryDataInquiries(mappedData)
                console.log("SUMMARY DATA INQUIRIES: ", mappedData)


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${startDate}&dateto=${endDate}&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/reports-summary?datefrom=${startDate}&dateto=${endDate}&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSummaryProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSummaryDataProcedures(mappedData)
                


            })
            setReportSummaryLoader(false);

    }


    return (
        <PaperProvider theme={black_theme}>
            <List.Accordion
                title="Report Summary"
                titleStyle={{ color: '#fff', fontWeight: 'bold' }}
                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', backgroundColor: '#2A2B2F', }}>
                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: monthSelected === true ? 550 : 430, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', }}>
                        <Menu>
                            <MenuTrigger><AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} /></MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => {getReportSummaryData(), setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>All</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {getReportSummaryDataThisWeek(),  setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>This Week</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {getReportSummaryDataThisMonth(),  setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>This Month</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {getReportSummaryDataLastMonth(),  setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Month</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {getReportSummaryDataThisYear(),  setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>This Year</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {getReportSummaryDataLastYear(),  setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Year</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {getReportSummaryDataLastTwoYears(),  setReportSummaryLoader(true)}} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>Last 2 Years</Text></View>
                                </MenuOption>
                                <MenuOption onSelect={() => {
                                    setSelectedCategory('location'); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                    setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setDateFrom(null);
                                    setDateTo(null); console.log(selectedCategory);
                                }} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>Custom Range</Text></View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                        <Menu>
                            <MenuTrigger><AntdIcon name="filter" size={25} color="#7e7e7e" /></MenuTrigger>
                            <MenuOptions>

                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox1}
                                        onValueChange={(newValue) => {
                                            setToggleCheckBox1(newValue)
                                            if (newValue === true) {
                                                summaryDataNames.push("Dr. Patrick Hsu");


                                            }
                                            else {
                                                summaryDataNames.pop();
                                                setToggleCheckBox1(false)
                                            }


                                        }}
                                    />

                                    <Text style={{ marginLeft: 5 }}>Dr. Patrick Hsu</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox2}
                                        onValueChange={(newValue) => {
                                            setToggleCheckBox2(newValue)
                                            if (newValue === true) {
                                                summaryDataNames.push("Dr. Kendall Roehl")

                                            }
                                            else {
                                                summaryDataNames.pop();
                                                setToggleCheckBox2(false)
                                            }

                                        }}
                                    />

                                    <Text style={{ marginLeft: 5 }}>Dr. Kendall Roehl</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox3}
                                        onValueChange={(newValue) => {
                                            setToggleCheckBox3(newValue)
                                            if (newValue === true) {
                                                summaryDataNames.push("Dr. Vasileios Vasilakis")

                                            }
                                            else {
                                                summaryDataNames.pop();
                                                setToggleCheckBox3(false)
                                            }


                                        }}
                                    />

                                    <Text style={{ marginLeft: 5 }}>Dr. Vasileios Vasilakis</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox4}
                                        onValueChange={(newValue) => {
                                            setToggleCheckBox4(newValue)
                                            if (newValue === true) {
                                                summaryDataNames.push("MedSpa Provider")

                                            }
                                            else {
                                                summaryDataNames.pop();
                                                setToggleCheckBox4(false)
                                            }


                                        }}
                                    />

                                    <Text style={{ marginLeft: 5 }}>MedSpa Provider</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox5}
                                        onValueChange={(newValue) => {
                                            setToggleCheckBox5(newValue)
                                            if (newValue === true) {
                                                summaryDataNames.push("No preference")

                                            }
                                            else {
                                                summaryDataNames.pop();
                                                setToggleCheckBox5(false)
                                            }



                                        }}
                                    />

                                    <Text style={{ marginLeft: 5 }}>No preference</Text>
                                </View>

                                <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, justifyContent: 'space-between' }}>
                                    <TouchableHighlight onPress={() => { clearFilter(); setReportSummaryLoader(true) }} style={{ bodrderRadius: 5 }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, borderRadius: 5, backgroundColor: '#FFC000', justifyContent: 'space-evenly' }}>
                                            <AntdIcon name='close' size={15} style={{ marginRight: 3 }} />
                                            <Text style={{ fontWeight: 'bold' }}>CLEAR</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => {getSummaryFilterData(); setReportSummaryLoader(true) }} style={{ bodrderRadius: 5 }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, borderRadius: 5, color: '#fff', backgroundColor: '#00C292', justifyContent: 'space-evenly' }}>
                                            <FeatherIcon name='send' size={15} style={{ marginRight: 3 }} color="#fff" />
                                            <Text style={{ fontWeight: 'bold', color: '#fff' }}>SUBMIT</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </MenuOptions>
                        </Menu>

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
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    popupItem: {
        backgroundColor: '#edeef0',
        width: '100%',
        borderRadius: 5,
        padding: 10
    },
    popupItemText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#316fd4'
    },
});
export default ReportSummary