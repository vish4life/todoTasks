import { View, TouchableOpacity, Text, StyleSheet } from "react-native";


const CategorizedTasks = ({ route,navigation }) => {
    const {dataList} = route.params;
    console.log('data list in categorized tasks js is: ',dataList);
    return (
        <View style={styles.container}>
            <View style={styles.dataBlock}>
                <Text>Hi from Categorized Tasks</Text>
            </View>
        <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Tasks' })}>
                <Text style={styles.buttonTxt}>Back</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};
export default CategorizedTasks;
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    dataBlock:{
        flex:0.9
    },
    btnContainer: {
        flex: 0.1,
        alignItems: 'center',
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
});