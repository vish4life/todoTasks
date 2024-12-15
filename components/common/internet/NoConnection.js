// importing react and react natvie libraries
import { Text, TouchableOpacity, StyleSheet, DevSettings, Image } from "react-native";

// importing expo libraries
import { LinearGradient } from 'expo-linear-gradient';

// importing images
const noConn = '../../../assets/noInternet.png';

const NoConnection = () => {
    const restartFunction = () => {
        DevSettings.reload();
    };
    return(
        <LinearGradient colors={['#995c99', '#4c2e4c']}style={styles.container}>
            <Image source={require(noConn)} style={styles.img} />
            <Text style={styles.textHeader}>Whoops..!!</Text>
            <Text style={styles.textLine}>Internet not connected</Text>
            <Text style={styles.textLine2}>please check the connection</Text>
            <Text style={styles.textLine2}>and click on the Refresh button</Text>
            <TouchableOpacity style={styles.btn} onPress={()=>restartFunction()}>
                <Text style={styles.btnTxt}>Refresh</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};
export default NoConnection;
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    img:{
        width:200,
        height:158,
        tintColor:'white '
    },
    textHeader:{
        color:'white',
        fontFamily:'Kohinoor Telugu',
        fontSize:40,
    },
    textLine:{
        color:'#a8a8a8',
        fontFamily:'Kohinoor Telugu',
        fontSize:20,
        marginTop:'1%',
    },
    textLine2:{
        color:'#a8a8a8',
        fontFamily:'Kohinoor Telugu',
        fontSize:20,
        // marginTop:'1%',
    },
    btn:{
        backgroundColor:'#4c2e4c',
        borderWidth:1,
        borderColor:'#a3a3a3',
        width:100,
        height:40,
        marginTop:'8%',
        justifyContent:'center',
        borderRadius:5,
    },
    btnTxt:{
        color:'white',
        fontFamily:'Kohinoor Telugu',
        fontSize:22,
        textAlign:'center',
    },
});