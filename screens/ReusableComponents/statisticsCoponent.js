import React from 'react'
import { View,StyleSheet, Text } from 'react-native'
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Popable } from 'react-native-popable';

const StatisticsComponent = ({bgColor, title, count,  iconName, iconFolder, popOverContent}) => {

    const ItemLogo =({iconFolder,name, color})=>{
        return <Text style={{marginLeft: 0}}> {
                        iconFolder === "FAIcon" ? <FAIcon name={name} color={color} size={30}/> 
                        :
                        iconFolder === "Icon" ? <Icon name={name} color={color} size={30}/> 
                        :
                        iconFolder === "FeatherIcon" ? <FeatherIcon name={name} color={color} size={30}/> 
                        :
                        iconFolder === "FAIcon5" ? <FAIcon5 name={name} color={color} size={25}/> 
                        :
                        iconFolder === "MaterialIcon" ? <MaterialIcon name={name} color={color} size={30}/> 
                        :
                        <FAIcon name={name} color={color} size={30}/>
                    }
                    
              </Text>
    }

    return (
        <View>
            <Card style={{ backgroundColor: bgColor, marginBottom: 10 }}>
                <Card.Content>
                    <View style={styles.rowContainer}>
                        <View style={styles.rowContainer}>
                            <View style={styles.iconBg}>
                                <ItemLogo iconFolder={iconFolder} name={iconName} color={bgColor}/>
                            </View>
                            <View style={styles.columnContainer}>
                                <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>{count}</Text>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{title}</Text>
                            </View>
                        </View>
                        <View>
                            <Popable content={popOverContent} strictPosition={true} position="left"  animationType="spring" style={{width: 200}}>
                                <Icon name="information-outline" size={20} color="#fff" />
                            </Popable>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075DA7',
    },
    wrapper: {
        padding: 10,
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
        borderRadius: 200, 
        marginRight: 10, 
        height: 50, 
        width: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingRight: 3
    }
});

export default StatisticsComponent