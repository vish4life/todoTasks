import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

// importing image
const closeImg = '../assets/close.png';

const Options = ({ navigation }) => {
    return (
        <View style={styles.optionsContainer}>
            <View style={styles.closeContainer}>
                <TouchableOpacity onPress={() => navigation.navigate({ name: 'Tasks' })}>
                    <Image source={require(closeImg)} style={styles.closeImg} />
                </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Tasks' })}>
                    <Text style={styles.buttonTxt}>Tasks History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Tasks' })}>
                    <Text style={styles.buttonTxt}>Select Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Home' })}>
                    <Text style={styles.buttonTxt}>Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default Options;
const styles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        backgroundColor: '#dbc6db',
        margin: '10%',
        marginBottom:'50%',
        borderRadius: '20',
        opacity:'0.7',
    },
    closeContainer: {
        alignItems: 'flex-end',
        padding:'1%',
        flex:0.1
    },
    btnContainer: {
        flex:0.7,
        justifyContent:'center',
        alignItems:'center',
    },
    button: {
        backgroundColor: '#4c2e4c',
        padding: '1%',
        margin: '2%',
        borderRadius: 6,
        width: '75%',
        borderColor: '#ff99ff',
        borderWidth: 1,
    },
    buttonTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Kohinoor Telugu',
    },
    closeImg: {
        width: 35,
        height: 35,
        tintColor: '#995c99',
    },
});