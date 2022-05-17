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

import ProceduresInquiriesTab from '../../Tabs/ProceduresTab/proceduresInquiriesTab';
import ProceduresConsultsTab from '../../Tabs/ProceduresTab/proceduresConsultTab';
import ProceduresProceduresTab from '../../Tabs/ProceduresTab/proceduresProceduresTab';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const ProceduresChart = ({ route }) => {

    const today = moment(new Date(Date.now()));
    const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
    const endOfYear = today.endOf('year').format("YYYY-MM-DD");

    const [dateFrom, setDateFrom] = useState(begginingOfYear);
    const [dateTo, setDateTo] = useState(endOfYear);

    const [summaryDataNames, setSummaryDatanames] = useState([]);
    const [toggleCheckBox1, setToggleCheckBox1] = useState(false)
    const [toggleCheckBox2, setToggleCheckBox2] = useState(false)
    const [toggleCheckBox3, setToggleCheckBox3] = useState(false)
    const [toggleCheckBox4, setToggleCheckBox4] = useState(false)
    const [toggleCheckBox5, setToggleCheckBox5] = useState(false)
    const [toggleCheckBox6, setToggleCheckBox6] = useState(false)
    const [toggleCheckBox7, setToggleCheckBox7] = useState(false)
    const [toggleCheckBox8, setToggleCheckBox8] = useState(false)
    const [toggleCheckBox9, setToggleCheckBox9] = useState(false)
    const [toggleCheckBox10, setToggleCheckBox10] = useState(false)
    const [toggleCheckBox11, setToggleCheckBox11] = useState(false)
    const [toggleCheckBox12, setToggleCheckBox12] = useState(false)
    const [toggleCheckBox13, setToggleCheckBox13] = useState(false)
    const [toggleCheckBox14, setToggleCheckBox14] = useState(false)
    const [toggleCheckBox15, setToggleCheckBox15] = useState(false)
    const [toggleCheckBox16, setToggleCheckBox16] = useState(false)
    const [toggleCheckBox17, setToggleCheckBox17] = useState(false)
    const [toggleCheckBox18, setToggleCheckBox18] = useState(false)
    const [toggleCheckBox19, setToggleCheckBox19] = useState(false)
    const [toggleCheckBox20, setToggleCheckBox20] = useState(false)
    const [toggleCheckBox21, setToggleCheckBox21] = useState(false)
    const [toggleCheckBox22, setToggleCheckBox22] = useState(false)
    const [toggleCheckBox23, setToggleCheckBox23] = useState(false)
    const [toggleCheckBox24, setToggleCheckBox24] = useState(false)
    const [toggleCheckBox25, setToggleCheckBox25] = useState(false)
    const [toggleCheckBox26, setToggleCheckBox26] = useState(false)
    const [toggleCheckBox27, setToggleCheckBox27] = useState(false)
    const [toggleCheckBox28, setToggleCheckBox28] = useState(false)
    const [toggleCheckBox29, setToggleCheckBox29] = useState(false)
    const [toggleCheckBox30, setToggleCheckBox30] = useState(false)



    const [isInquiriesZero, setInquiriesZero] = useState(false);
    const [isConsultsZero, setConsultsZero] = useState(false);
    const [isProceduresZero, setProceduresZero] = useState(false);

    const [names, setNames] = useState([]);



    const [index, setIndex] = useState(0);


    const [proceduresInquiries, setProceduresInquiries] = useState([]);
    const [procedureDataInquiries, setProceduresDataInquiries] = useState();

    const [proceduresConsults, setProceduresConsults] = useState([]);
    const [procedureDataConsults, setProceduresDataConsults] = useState();

    const [monthSelected, setmonthSelected] = useState(false);

    const [proceduresProcedures, setProceduresProcedures] = useState([]);
    const [procedureDataProcedures, setProceduresDataProcedures] = useState();
    const [filterText, setFilterText] = useState(null);
    const [loader, setLoader] = useState(true);
    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const initialLayout = { width: Dimensions.get('window').width };


    useEffect(() => {
        getProceduresData();
    }, []);


    const mappedNames = summaryDataNames.map((item, i, name) => {
        if (i + 1 === name.length) {
            return `data%5B%5D=${item}`
        } else {
            return `data%5B%5D=${item}&`
        }
    })


    let removeComma;

    const getProceduresData = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Inquiries`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                let names = []
                for (let i = 0; i < response.data.labels.length; i++) {
                    names[i] = response.data.labels[i].slice(0, -3)
                }
                console.log("NAMES: ", names)

                setNames(names);


                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setProceduresDataInquiries(data[0].data);
                console.log("PROCEDURES CONSULTS: ", response.data)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }
            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Procedures`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setProceduresDataProcedures(data[0].data);
                console.log("PROCEDURES CONSULTS: ", response.data)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }
            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Consults`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setProceduresDataConsults(data[0].data);
                console.log("PROCEDURES CONSULTS: ", response.data)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })
        console.log("ALL PROCEDURES: ", names)
    }


    const getProceduresFilterData = async () => {

        removeComma = mappedNames.toString().replace(/,/g, '')
        console.log("REMOVE COMMA:", removeComma)
        console.log("URL:" + `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Consults&${removeComma}`)

        setmonthSelected(false)

        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setProceduresDataConsults(data[0].data);
                console.log("SURGEON CONSULTS: ", data[0].data)

                // const isAllZero = data[0].data.every(item => item === 0);
                // console.log("IS CONSULTS ALL ZERO? ",isAllZero)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

                /*  if (isAllZero ===  true) {
                      setConsultsZero(true);
                  }
                  else {
                      setConsultsZero(false);
                  }*/

            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /* if (isAllZero ===  false) {
                     setProceduresZero(false);
                 }
                 else {
                     setProceduresZero(true);
                 }*/

            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setProceduresDataInquiries(data[0].data);
                console.log("SURGEON INQUIRIES: ", response.data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS INQUIRIES ALL ZERO? ",isAllZero)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }

                /*if (isAllZero ===  false) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }*/
                setLoader(false)
            });


    }

    const clearFilter = () => {
        getProceduresData();
        setToggleCheckBox1(false);
        setToggleCheckBox2(false);
        setToggleCheckBox3(false);
        setToggleCheckBox4(false);
        setToggleCheckBox5(false);
        setToggleCheckBox6(false);
        setToggleCheckBox7(false);
        setToggleCheckBox8(false);
        setToggleCheckBox9(false);
        setToggleCheckBox10(false);
        setToggleCheckBox11(false);
        setToggleCheckBox12(false);
        setToggleCheckBox13(false);
        setToggleCheckBox14(false);
        setToggleCheckBox15(false);
        setToggleCheckBox16(false);
        setToggleCheckBox17(false);
        setToggleCheckBox18(false);
        setToggleCheckBox19(false);
        setToggleCheckBox20(false);
        setToggleCheckBox21(false);
        setToggleCheckBox22(false);
        setToggleCheckBox23(false);
        setToggleCheckBox24(false);
        setToggleCheckBox25(false);
        setToggleCheckBox26(false);
        setToggleCheckBox27(false);
        setToggleCheckBox28(false);
        setToggleCheckBox29(false);
        setToggleCheckBox30(false);

        
        setSummaryDatanames([]);


    }


    const getProceduresDataThisWeek = async () => {

        // setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('week').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('week').format("YYYY-MM-DD");

        setDateFrom(begginingOfCurrentWeek);
        setDateTo(endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '');

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresProcedures(response.data)
                console.log("SURGEON PRCEDURES THIS WEEK: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /* if (isAllZero ===  true) {
                     setProceduresZero(true);
                 }
                 else {
                     setProceduresZero(false);
                 }*/

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                console.log('Procedures Count', count);
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }



            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresInquiries(response.data)
                console.log("SURGEON INQUIRIES THIS WEEK: ", response.data)

                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataInquiries(data[0].data)


                //  const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /*  if (isAllZero ===  true) {
                      setProceduresZero(true);
                  }
                  else {
                      setProceduresZero(false);
                  }*/

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                console.log('Inquiries Count', count);
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log("SURGEON CONSULTS THIS WEEK: ", response.data)
                setProceduresConsults(response.data)
                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2[i] = { data: response.data.datasets[i].data };
                }
                setProceduresDataConsults(data2[0].data);
                console.log("SURGEON CONSULTS: ", data2[0].data)

                // const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /* if (isAllZero ===  true) {
                     setProceduresZero(true);
                 }
                 else {
                     setProceduresZero(false);
                 }*/
                let count = 0;
                for (let x = 0; x < data2[0].data.length; x++) {
                    count = count + data2[0].data[x];
                }
                console.log('Consults Count', count);
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }
                setLoader(false)
            });

    }

    const getProceduresDataThisMonth = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfMonth = today.startOf('month').format("YYYY-MM-DD");
        const endOfMonth = today.endOf('month').format("YYYY-MM-DD");


        setDateFrom(begginingOfMonth);
        setDateTo(endOfMonth);

        const setText = " DATE (" + begginingOfMonth + " - " + endOfMonth + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresInquiries(response.data)


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

                setProceduresDataInquiries(mappedData)

                console.log("SUMMARY DATA INQUIRIES: ", mappedData)

                let count = 0;
                for (let x = 0; x < mappedData[0].data.length; x++) {
                    count = count + mappedData[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresConsults(response.data)


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
                setProceduresDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)

                let count = 0;
                for (let x = 0; x < mappedData[0].data.length; x++) {
                    count = count + mappedData[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }



            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresProcedures(response.data)
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
                setProceduresDataProcedures(mappedData)


                let count = 0;
                for (let x = 0; x < mappedData[0].data.length; x++) {
                    count = count + mappedData[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }
                setLoader(false)

            })

    }
    const getProceduresDataLastMonth = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'month');
        const begginingOfLastMonth = today.startOf('month').format("YYYY-MM-DD");
        const endOfLastMonth = today.endOf('month').format("YYYY-MM-DD");

        setDateFrom(begginingOfLastMonth);
        setDateTo(endOfLastMonth);

        const setText = " DATE (" + begginingOfLastMonth + " - " + endOfLastMonth + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataInquiries(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }




            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }
    const getProceduresDataThisYear = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfYear = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfYear);
        setDateTo(endOfYear);

        const setText = " DATE (" + begginingOfYear + " - " + endOfYear + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataInquiries(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }




            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }
    const getProceduresDataLastYear = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'year');
        const begginingOfLastYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfLastYear = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfLastYear);
        setDateTo(endOfLastYear);

        const setText = " DATE (" + begginingOfLastYear + " - " + endOfLastYear + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataInquiries(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }


                setLoader(false)
            })

    }
    const getProceduresDataLastTwoYear = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(2, 'year');
        const begginingOfLastTwoYears = today.startOf('year').format("YYYY-MM-DD");
        const endOfLastTwoYears = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfLastTwoYears);
        setDateTo(endOfLastTwoYears);

        const setText = " DATE (" + begginingOfLastTwoYears + " - " + endOfLastTwoYears + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataInquiries(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }

    const getProceduresDataRangeDate = async (startDate, endDate) => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;



        setDateFrom(startDate);
        setDateTo(endDate);

        const setText = " DATE (" + startDate + " - " + endDate + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=procedures&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataInquiries(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }

            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=procedures&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setProceduresConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=procedures&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setProceduresProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setProceduresDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }

    const renderSceneProcedures = SceneMap({
        first: () => <ProceduresInquiriesTab data={proceduresInquiries} proceduresData={procedureDataInquiries} isZero={isInquiriesZero} loader={loader} />,
        second: () => <ProceduresConsultsTab data={proceduresConsults} proceduresData={procedureDataConsults} isZero={isConsultsZero} loader={loader} />,
        third: () => <ProceduresProceduresTab data={proceduresProcedures} proceduresData={procedureDataProcedures} isZero={isProceduresZero} loader={loader} />,
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


    return (
        <PaperProvider theme={black_theme}>
            <List.Accordion
                title="Procedures"
                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: loader === true ? 300 : 1040, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}> {filterText} </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Menu>
                                <MenuTrigger><AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} /></MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => { getProceduresData(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>All</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getProceduresDataThisWeek(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Week</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getProceduresDataThisMonth(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Month</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getProceduresDataLastMonth(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Month</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getProceduresDataThisYear(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Year</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getProceduresDataLastYear(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Year</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getProceduresDataLastTwoYear(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last 2 Years</Text></View>
                                    </MenuOption>
                                    {/* <MenuOption onSelect={() => {
                                    setSelectedCategory('location'); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                    setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setDateFrom(null);
                                    setDateTo(null); console.log(selectedCategory);
                                }} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>Custom Range</Text></View>
                                </MenuOption> */}
                                </MenuOptions>
                            </Menu>
                            <Menu>
                                <MenuTrigger><AntdIcon name="filter" size={25} color="#7e7e7e" /></MenuTrigger>
                                <MenuOptions>
                                    <ScrollView style={{ maxHeight: 500, }}>
                                        <View style={{ flex: 1, flexDirection: 'column', height: '100%'}}>

                                            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox1}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox1(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Abdominal Etching");


                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox1(false)
                                                        }


                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Abdominal Etching</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox2}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox2(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Arm Lift (Brachioplasty)")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox2(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Arm Lift (Brachioplasty)</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox3}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox3(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Blepharoplasty (Eyelid Surgery)")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox3(false)
                                                        }


                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Blepharoplasty (Eyelid Surgery)</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox4}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox4(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Body Lift")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox4(false)
                                                        }


                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Body Lift</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox5}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox5(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Brazilian Butt Lift")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox5(false)
                                                        }



                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Brazilian Butt Lift</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox6}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox6(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Breast Augmentation")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox6(false)
                                                        }



                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Breast Augmentation</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox7}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox7(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Breast Lift (Mastopexy")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox7(false)
                                                        }



                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Breast Lift (Mastopexy</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox8}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox8(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Breast Reduction")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox8(false)
                                                        }



                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Breast Reduction</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox9}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox9(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Breast Surgery Revision")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox9(false)
                                                        }



                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Breast Surgery Revision</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox10}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox10(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Buccal Fat Removal")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox10(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Buccal Fat Removal</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox11}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox11(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("DIEP Flap Surgery")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox11(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>DIEP Flap Surgery</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox12}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox12(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Facelift")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox12(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Facelift</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox13}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox13(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Facial Liposuction")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox13(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Facial Liposuction</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox14}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox14(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Gynecomastia Surgery")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox14(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Gynecomastia Surgery</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox15}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox15(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Hair Transplant")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox15(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Hair Transplant</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox16}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox16(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Labiaplasty")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox16(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Labiaplasty</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox17}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox17(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Latissimus Muscle")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox17(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Latissimus Muscle</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox18}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox18(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Lip Augmentation")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox18(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Lip Augmentation</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox19}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox19(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Liposuction")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox19(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Liposuction</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox20}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox20(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Lumpectomy")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox20(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Lumpectomy</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox21}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox21(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Mommy Makeover")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox21(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Mommy Makeover</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox22}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox22(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Nipple Sparing Mastectomy")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox22(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Nipple Sparing Mastectomy</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox23}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox23(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Otoplasty (Ear Surgery)")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox23(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Otoplasty (Ear Surgery)</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox24}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox24(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Revision")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox24(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Revision</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox25}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox25(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Rhinoplasty")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox25(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Rhinoplasty</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox26}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox26(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Skin Tightening")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox26(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Skin Tightening</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox27}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox27(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Thigh Lift")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox27(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Thigh Lift</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox28}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox28(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Tissue Expander Implant")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox28(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Tissue Expander Implant</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox29}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox29(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Tummy Tuck")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox29(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Tummy Tuck</Text>
                                            </View>

                                            <View style={{ alignItems: 'center', flexDirection: 'row' , flex: 1}}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={toggleCheckBox30}
                                                    onValueChange={(newValue) => {
                                                        setToggleCheckBox30(newValue)
                                                        if (newValue === true) {
                                                            summaryDataNames.push("Others")

                                                        }
                                                        else {
                                                            summaryDataNames.pop();
                                                            setToggleCheckBox30(false)
                                                        }

                                                    }}
                                                />

                                                <Text style={{ marginLeft: 5 }}>Others</Text>
                                            </View>






                                            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, justifyContent: 'space-between' }}>
                                                <TouchableHighlight onPress={() => { clearFilter(); setLoader(true) }} style={{ bodrderRadius: 5 }}>
                                                    <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, borderRadius: 5, backgroundColor: '#FFC000', justifyContent: 'space-evenly' }}>
                                                        <AntdIcon name='close' size={15} style={{ marginRight: 3 }} />
                                                        <Text style={{ fontWeight: 'bold' }}>CLEAR</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight onPress={() => { getProceduresFilterData(); setLoader(true) }} style={{ bodrderRadius: 5 }}>
                                                    <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, borderRadius: 5, color: '#fff', backgroundColor: '#00C292', justifyContent: 'space-evenly' }}>
                                                        <FeatherIcon name='send' size={15} style={{ marginRight: 3 }} color="#fff" />
                                                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>SUBMIT</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderSceneProcedures}
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


export default ProceduresChart