import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const UserGuide = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.about}>
                <Text style={styles.heading}>&#9472;&#9472;&#9472;&#9472;&#9472; About App &#9472;&#9472;&#9472;&#9472;&#9472;</Text>
                <View style={styles.text}>
                    <Text style={styles.inlineText}>Apptasktic allows the users to create todo tasks and set a target end date for completing the task. Users can create a 'Category' and add tasks under it. The defautl Category is 'GENERAL'. Users can view the categorized tasks under 'options' available in the 'Showtasks' screen. Following are some key features that are currently available in the app.</Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Create Task </Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;View Task </Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Update Task </Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Delete Task </Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;View Task History </Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;View Categorized Tasks </Text>
                    </View>
                </View>
                <Text style={styles.heading}>&#9472;&#9472;&#9472; How to Create a Task &#9472;&#9472;&#9472;</Text>
                <View style={styles.text}>
                    <Text style={styles.inlineText}>Users can navigate to create task section from Home screen using 'Create Task' button. Once user is on the create task screen, it shows the following fields</Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Category</Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Task *</Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Details </Text>
                        <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;&nbsp;Task End Date </Text>
                    </View>
                    <Text style={styles.bulletPointsTxt}>Note: * fields are mandatory, here it is Task. </Text>
                    <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;If the Category field is not entered then 'GENERAL' will be assigned to the task</Text>
                    <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;Users can select the categories from already created using 'Select Available Category' button which is just below the Category box </Text>
                    <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp;Details can be filled if required to provide more information about the task</Text>
                    <Text style={styles.bulletPointsTxt}>{`\u2022`}&nbsp; Error will get displayed if 'Task End Date' is prior to Current Date</Text>
                </View>
            </ScrollView>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Home' })}>
                    <Text style={styles.buttonTxt}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default UserGuide;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 20,
        marginRight:20,
        marginTop:10,
        marginBottom:20,
    },
    heading: {
        color: '#995c99',
        fontSize: 24,
        fontFamily: 'Marker Felt',
        backgroundColor: '#dbc6db',
        padding: 10,
        marginTop: 10,
    },
    about: {
        flex: 0.9,
    },
    text: {
        marginTop: 10,
        backgroundColor: '#d1b6d1',
        borderRadius: 6,
        padding: 10,
    },
    inlineText: {
        color:'#6e0d6e',
        fontSize:18,
        fontFamily:'Damascus',
        letterSpacing:1,
    },
    bulletPoints: {
        padding: 20,
        fontSize:18,
    },
    bulletPointsTxt:{
        color:'#6e0d6e',
        fontSize:14,
        fontFamily:'Damascus',
        letterSpacing:1,
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