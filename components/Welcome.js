// importing react and react native libraries
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Welcome = ({navigation}) => {
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({name:'Create'})}>
                <Text style={styles.buttonTxt}>Create Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({name:'Tasks'})}>
                <Text style={styles.buttonTxt}>Show Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({name:'Guide'})}>
                <Text style={styles.buttonTxt}>User Guide</Text>
            </TouchableOpacity>
        </View>
    );
};
export default Welcome;
const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
    },
    button:{
        backgroundColor: '#4c2e4c',
        padding: '1%',
        margin: '2%',
        borderRadius: 6,
        width: '75%',
        borderColor: '#ff99ff',
        borderWidth: 1,
    },
    buttonTxt:{
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Kohinoor Telugu',
    },
});