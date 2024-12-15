// importing libraries
import { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

// importing community packages
import DateTimePicker from '@react-native-community/datetimepicker';

// importing context from contextAPI
import { TaskAppContext } from "../../context/ContextAPI";

// importing database methods from Database component
import { createTodoTask, deleteTaskUsingId, updateTaskDetailsUsingId, updateTaskStatusUsingId } from "../../database/Database";

// importing common function from components
import CurrentDate from "../common/general/CurrentDate";


const CreateTasks = () => {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const { update, updatePayload, setCreateTask, setUpdatePayload, setUpdate, setCompletedTasks } = useContext(TaskAppContext);
    const [onLoad, setOnLoad] = useState(true);
    const [taskDone, setTaskDone] = useState(false);
    const [endTime, setEndTime] = useState(new Date());

    // condition for setting state variables when the update option is selected
    if (update && onLoad) {
        setTitle(updatePayload.title);
        setNotes(updatePayload.notes);
        setCategory(updatePayload.category);
        setOnLoad(false);
        if (updatePayload.status === 'DONE') {
            setTaskDone(true);
        };
    };

    // function to reset the user inputs
    const resetValues = () => {
        setTitle('');
        setNotes('');
        setUpdate(false);
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
        console.log('came into create task: title ', title, ' notes ', notes);
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
            setCreateTask(false);
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
            setCreateTask(false);
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
            setCreateTask(false);
        };
    };

    // function to cancel the operations
    const cancelOperation = () => {
        resetValues();
        setCreateTask(false);
        setCompletedTasks(false);
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
                <TouchableOpacity style={styles.btn} onPress={() => cancelOperation()}>
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
                    <Text style={styles.btnTxt}>Home</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
            <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                    style={styles.inputTxt}
                    onChangeText={setCategory}
                    value={category}
                    keyboardType="ascii-capable"
                    placeholder="Enter Category"
                />
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
                        display="default" accentColor="#852985" themeVariant="dark" />
                </View>
            </View>
            {update ? <UpdateButtons /> : <CreateButtons />}
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
        fontSize: 16,
        marginTop: '2%',
        borderRadius: 4,
        backgroundColor: '#ffccff',
    },
    inputTxtNotes: {
        borderColor: 'white',
        borderWidth: 1,
        height: 150,
        textAlign: 'center',
        fontSize: 16,
        marginTop: '2%',
        borderRadius: 4,
        backgroundColor: '#ffccff',
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

});