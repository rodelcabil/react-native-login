import React, {useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, SafeAreaView, TouchableOpacity, Modal, Button, ScrollView, Animated, Flatlist } from 'react-native';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import { Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {
    LineChart,
    PieChart
} from "react-native-chart-kit";

const WeeklyCTab = ({ navigation, loader, weeklyData, empty}) => {
  return (
    loader === true ? <View style={{ height: '100%', justifyContent: 'center'}}><LoaderSmall/></View> :
        <View style={{ height: '100%',}}>
             {empty === true ? 
                                 <View style={styles.itemEmptyContainer}>
                                        <Image
                                            style={styles.logoImg}
                                            source={require('../../../assets/calendar.png')}
                                        />
                                        <Text style={styles.text1}>You have no schedule at the moment for this Week</Text>

                                   </View>:
                          <ScrollView>
                          {weeklyData?.map((item, i) => {
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
                       </ScrollView>}
    </View>

  )
}

const styles = StyleSheet.create({
    columnContainer: {
        flexDirection: 'column',

    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 5,

    },
    text1: {
        marginTop: 15,
        fontSize: 15,
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
    itemEmptyContainer: {
        padding: 20,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
    rowSchedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text2: {
        fontSize: 12,
        color: 'black'
    },
    logoImg: {
        width: 50,
        height: 50,
        opacity: 0.5,
        resizeMode: 'contain',
    },
});

export default WeeklyCTab