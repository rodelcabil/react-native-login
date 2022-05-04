import { es } from 'date-fns/locale';
import React from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native'
import AppBar from './ReusableComponents/AppBar';
import { List, DefaultTheme, Provider as PaperProvider, S } from 'react-native-paper';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const APICalls = () => {
    return (
        <PaperProvider theme={black_theme}>
            <View style={styles.container}>
                <AppBar title="API Calls" showMenuIcon={true} />
                <View style={styles.wrapper}>

                    <List.Accordion
                        title="Google Calendar"
                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', }}>
                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                            <View style={{  backgroundColor: '#fff',  borderRadius: 6, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputTitle}>Email</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter your Email"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        // value={email}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputTitle}>App Password</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter your App Password"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        // value={email}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputTitle}>Token</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter your Token"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        // value={email}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </List.Accordion>
                    <View style={{ marginBottom: 5 }} />

                </View>
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    wrapper: {
        padding: 10
    },
    inputContainer: {
        flexDirection: 'column',
        height: 50,
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 18,

    },
    inputTitle: {
        marginBottom: 5
    },
    inputWrapper: {
        padding: 10
    },
    input: {
        fontSize: 16
    }
})

export default APICalls