// importing libraries
import { useContext, useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

// importing community packages
import DateTimePicker from '@react-native-community/datetimepicker';

// importing context from contextAPI
import { TaskAppContext } from "../context/ContextAPI";

// importing database methods from Database component
import { getAllCategories, createTodoTask, deleteTaskUsingId, updateTaskDetailsUsingId, updateTaskStatusUsingId } from "../database/Database";

// importing common function from components
import CurrentDate from "./common/general/CurrentDate";


const CreateTasks = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const { updatePayload, setUpdatePayload, updating, setUpdating, } = useContext(TaskAppContext);
    const [onLoad, setOnLoad] = useState(true);
    const [taskDone, setTaskDone] = useState(false);
    const [endTime, setEndTime] = useState(new Date());
    const [displayCategories, setDisplayCategories] = useState(false);
    const [availableCategories, setAvailableCategories] = useState([]);

    // condition for setting state variables when the update option is selected
    if (updating && onLoad) {
        setTitle(updatePayload.title);
        setNotes(updatePayload.notes);
        setCategory(updatePayload.category);
        setOnLoad(false);
        if (updatePayload.status === 'DONE') {
            setTaskDone(true);
        };
        console.log('updatePayload is: ', updatePayload);
    };

    // function to reset the user inputs
    const resetValues = () => {
        setTitle('');
        setNotes('');
        setUpdating(false);
    };

    //function to validate the inputs
    const validateInputs = () => {
        if (!title.length) {
            alert('Task is required');
            return ('ERROR');
        };
        if (!notes.length) {
            console.log('came into notes null section: ', notes.length);
            setNotes('');
        };
        const endTimeFormat = CurrentDate(endTime);
        const currTimeFormat = CurrentDate(new Date());
        if (endTimeFormat < currTimeFormat) {
            alert("End date should be greater than today's date");
            return ('ERROR');
        }
        return ('SUCCESS');
    };

    // function to create task
    const createTask = async () => {
        console.log('came into create task: title ', title, ' notes ', notes, ' category: ',category,' category.upper: ',category.toUpperCase());
        const result = validateInputs();
        if (result === 'ERROR') { return };
        try {
            const result = await createTodoTask({ title, notes, category });
            if (result === 'SUCCESS') {
                alert(`Task is Created`);
                resetValues();
            };
        } catch (error) {
            console.log('ERROR: while inserting record: ', error);
        };
    };

    // function to mark task as done
    const markTaskAsDone = async () => {
        try {
            await updateTaskStatusUsingId({ id: updatePayload.id });
        } catch (error) {
            console.log('error while updating status to done: ', error);
            alert('task status update failed, retry');
            return;
        } finally {
            console.log(`Task is marked as done`);
            resetValues();
            alert(`Task ${title} is completed`);
            setUpdatePayload({});
            navigation.navigate({ name: 'Tasks' });

        };
    };
    // function to display confirmation alert
    const confirmUpdate = () => {
        Alert.alert('Mark as Done', 'Are you sure?', [
            {
                text: 'Yes',
                onPress: async () => await markTaskAsDone()
            },
            {
                text: 'No',
                onPress: () => console.log('Cancelled the status update'),
            },
        ]);
    };
    // function to update task details
    const updateTaskDetails = async () => {
        const result = validateInputs();
        if (result === 'ERROR') { return };
        try {
            await updateTaskDetailsUsingId({ id: updatePayload.id, title: title, notes: notes });
        } catch (error) {
            console.log('error while updating task details: ', error);
            alert('task details update failed, retry');
            return;
        } finally {
            console.log(`Task details are updated`);
            resetValues();
            alert(`Task ${title} details updated`);
            setUpdatePayload({});
            navigation.navigate({ name: 'Tasks' });
        };
    };

    // function to display confirmation alert
    const confirmDelete = () => {
        Alert.alert('Deletion', 'Are you sure?', [
            {
                text: 'Yes',
                onPress: async () => await deleteTask()
            },
            {
                text: 'No',
                onPress: () => console.log('Cancelled the Deletion'),
            },
        ]);
    };

    // function to delete the task using id
    const deleteTask = async () => {
        try {
            await deleteTaskUsingId({ id: updatePayload.id });
        } catch (error) {
            console.log('error while deleting record: ', error);
            alert('task deletion failed, retry');
            return;
        } finally {
            resetValues();
            alert(`Task ${title} is deleted`);
            setUpdatePayload({});
            navigation.navigate({ name: 'Tasks' });
        };
    };

    // function to cancel the operations
    const cancelOperation = () => {
        resetValues();
        navigation.navigate({ name: 'Tasks' });
    };

    // function for creating buttons during create operation
    const CreateButtons = () => {
        return (
            <View style={styles.bttnSection}>
                <TouchableOpacity style={styles.btn} onPress={() => createTask()}>
                    <Text style={styles.btnTxt}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => resetValues()}>
                    <Text style={styles.btnTxt}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate({ name: 'Tasks' })}>
                    <Text style={styles.btnTxt}>Show Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate({ name: 'Home' })}>
                    <Text style={styles.btnTxt}>Home</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // function for creating buttons during update operation
    const UpdateButtons = () => {
        return (
            <View style={styles.bttnSection}>
                {taskDone ? null :
                    <>
                        <TouchableOpacity style={styles.btn} onPress={() => confirmUpdate()}>
                            <Text style={styles.btnTxt}>Mark Completed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => updateTaskDetails()}>
                            <Text style={styles.btnTxt}>Update</Text>
                        </TouchableOpacity>
                    </>
                }
                <TouchableOpacity style={styles.btn} onPress={() => confirmDelete()}>
                    <Text style={styles.btnTxt}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => cancelOperation()}>
                    <Text style={styles.btnTxt}>Back</Text>
                </TouchableOpacity>
            </View>
        );
    };
    const categoySelectFunction = async (inp) => {
        console.log('came into category find section: ', inp);
        let dbCategories = '';
        try {
            dbCategories = await getAllCategories();
            if (dbCategories && dbCategories.length > 0) {
                console.log('setting available categories in welcome screen: ', dbCategories);
                setAvailableCategories(dbCategories);
            };
        } catch (error) {
            console.log('Error while fetching categories in welcome screen: ', error);
        };
        if (inp === 'DISPLAY') {
            if (dbCategories && dbCategories.length > 0) {
                setDisplayCategories(!displayCategories);
                return;
            } else {
                alert('No Categories Available');
                return;
            };
        };
        setCategory(inp);
        setDisplayCategories(!displayCategories);
        return;
    };
    const renderCategories = ({ item }) => {
        return (
            <View key={item} style={styles.catDispInnerContainer}>
                <TouchableOpacity style={styles.catDispContainerBtn} onPress={() => categoySelectFunction(item.CATEGORY)}>
                    <Text style={styles.catDispContainerTxt}>{item.CATEGORY}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryContainer}>
                    <View style={styles.categoryContainerInput}>
                        <TextInput
                            style={styles.inputTxts}
                            onChangeText={setCategory}
                            value={category}
                            keyboardType="ascii-capable"
                            placeholder="Enter Category"
                        />
                    </View>
                    <View style={styles.categoryContainerInputTxt}>
                        <TouchableOpacity onPress={() => setCategory('')}>
                            <Text style={styles.categoryContainerInputLineTxt}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.availCatContainer}>
                    <TouchableOpacity style={styles.availCatBtn} onPress={() => categoySelectFunction('DISPLAY')}>
                        <Text style={styles.availCatTxt}>Select Available Category</Text>
                    </TouchableOpacity>
                </View>
                <Text>&nbsp;</Text>
                {displayCategories ?
                    <View style={styles.catDispContainer}>
                        <FlatList
                            data={availableCategories}
                            renderItem={renderCategories}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    : null}
                <Text style={styles.inputLabel}>Task *</Text>
                <TextInput
                    style={styles.inputTxt}
                    onChangeText={setTitle}
                    value={title}
                    keyboardType="ascii-capable"
                    placeholder="Enter a Title, example 'Book Hotel'"
                />
                <Text style={styles.inputLabel}>Details</Text>
                <TextInput
                    style={styles.inputTxtNotes}
                    onChangeText={setNotes}
                    value={notes}
                    keyboardType="default"
                    placeholder="Enter a description of the task"
                />
                <View style={styles.dateSection}>
                    <Text style={styles.inputLabel}>Task End Date</Text>
                    <DateTimePicker style={styles.inputDate} value={endTime} is24Hour={true}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                setEndTime(selectedDate);
                            }
                        }}
                        display="default" accentColor="#c29dc2" themeVariant="dark" />
                </View>
            </View>
            {updating ? <UpdateButtons /> : <CreateButtons />}
        </View>
    );
};
export default CreateTasks;

const styles = StyleSheet.create({
    container: {},
    innerContainer: {
        margin: '2%'
    },
    inputLabel: {
        color: 'white',
        fontFamily: 'Kohinoor Telugu',
        fontSize: 30,
        marginTop: '2%'
    },
    inputTxt: {
        borderColor: 'white',
        borderWidth: 1,
        height: 40,
        textAlign: 'center',
        fontSize: 20,
        marginTop: '2%',
        borderRadius: 4,
        backgroundColor: '#ffccff',
        color: '#751a75',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'white',
        borderWidth: 1,
        height: 40,
        textAlign: 'center',
        fontSize: 16,
        marginTop: '2%',
        borderRadius: 4,
        backgroundColor: '#ffccff',
    },
    inputTxts: {
        textAlign: 'center',
        fontSize: 20,
        color: '#751a75',
    },
    categoryContainerInput: {
        flex: 1
    },
    categoryContainerInputLineTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#660066',
        marginRight: 10,
        width: 40,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
    },
    categoryContainerInputTxt: {
        // flex:0.1
    },
    availCatContainer: {
        paddingTop: 5,
    },
    availCatBtn: {},
    availCatTxt: {
        textAlign: 'right',
        color: '#e0cce0',
        textDecorationLine: 'underline',
    },
    catDispContainer: {
        backgroundColor: '#d9bfd9',
        margin: 'auto',
        padding: 10,
        borderRadius: 10,
    },
    catDispInnerContainer: {
        alignItems: 'center',
    },
    catDispContainerBtn: {
        // backgroundColor:'#f0e6f0',
        margin: 10,
    },
    catDispContainerTxt: {
        fontSize: 20,
        color: '#7d267d',
    },
    inputTxtNotes: {
        borderColor: 'white',
        borderWidth: 1,
        height: 150,
        textAlign: 'center',
        fontSize: 20,
        marginTop: '2%',
        borderRadius: 4,
        backgroundColor: '#ffccff',
        color: '#751a75',
    },
    bttnSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    btn: {
        backgroundColor: '#4c2e4c',
        padding: '1%',
        marginBottom: '2%',
        borderRadius: 6,
        width: '75%',
        borderColor: '#ff99ff',
        borderWidth: 1,
    },
    btnTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Kohinoor Telugu',
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputDate: {
        borderColor: '#c29dc2',
    },
});