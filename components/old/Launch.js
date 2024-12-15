// importing libraries
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useContext } from 'react';

// importing context
import { TaskAppContext } from "../../context/ContextAPI";

// importig components
import FetchTasks from "./FetchTasks";


const Launch = () => {
    const {showTasks,setShowTasks,setCreateTask} = useContext(TaskAppContext);
    console.log('came into Launch: ',showTasks);
    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.createBtn} onPress={() => setCreateTask(true)}>
                    <Text style={styles.createBtnTxt}>Create Task</Text>
                </TouchableOpacity>
                {showTasks ?
                    <TouchableOpacity style={styles.createBtn} onPress={() => setShowTasks(!showTasks)}>
                        <Text style={styles.createBtnTxt}>Hide Tasks</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.createBtn} onPress={() => setShowTasks(!showTasks)}>
                        <Text style={styles.createBtnTxt}>Show Tasks</Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.fetchTasks}>
                {showTasks ? <FetchTasks /> : null}
            </View>
        </View>
    );
};
export default Launch;
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    createBtn: {
        backgroundColor: '#4c2e4c',
        padding: '1%',
        margin: '2%',
        borderRadius: 6,
        width: '75%',
        borderColor: '#ff99ff',
        borderWidth: 1,
    },
    createBtnTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Kohinoor Telugu',
    },
    fetchTasks:{
        margin:'4%',
    },
});
