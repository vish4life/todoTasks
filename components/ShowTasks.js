// importing react and react native libraries
import { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";

// importing database apis from database component
import { getActiveTasks, createTableTodo, getCompletedTasks, deleteTaskUsingId, updateTaskStatusUsingId } from "../database/Database";

// importing image
const optionsImg = '../assets/options3.png';
const closeImg = '../assets/close.png';

// importing expo libraries
import Checkbox from "expo-checkbox";

// importing context
import { TaskAppContext } from "../context/ContextAPI";


const ShowTasks = ({ navigation }) => {

    const [dataList, setDataList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [heading, setHeading] = useState('');
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [showSelection, setShowSelection] = useState(false);
    const [showDeselect, setShowDeselect] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(false);
    const { setUpdating, setUpdatePayload, updatePayload,} = useContext(TaskAppContext);

    // fetching open tasks data while loading
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                await createTableTodo();
                await fetchAllOpenTasks();
            } catch (error) {
                console.log('Error while fetching open tasks during load ', error);
            } finally {
                setLoading(false);
            };
        })();
    }, [updatePayload]);

    // function to add or remove records from selected records array
    const updateCheckedList = (recordId) => {
        setSelectedRecords((records) => {
            if (records.includes(recordId)) {
                return records.filter((id) => id !== recordId);
            } else {
                return [...records, recordId];
            }
        });
    };

    // fetching all the open tasks using function
    const fetchAllOpenTasks = async () => {
        try {
            setHeading('Active Tasks');
            const result = await getActiveTasks();
            console.log('open tasks data is ', result);
            setDataList(result);
            setShowOptions(false);
            setCompletedTasks(false);
            console.log('dataList is: ',result,' and length is: ',result.length);
            if(result && result.length < 1){
                setHeading('No Active Tasks');
            };
        } catch (error) {
            console.log('Error during fetching open task data from database: ', error);
            setDataList([]);
        };
    };

    // fetching all the done tasks using function
    const fetchAllDoneTasks = async () => {
        try {
            setHeading('Completed Tasks');
            const result = await getCompletedTasks();
            console.log('done tasks data is ', result);
            setDataList(result);
            setShowOptions(false);
            setCompletedTasks(true);
            if(result && result.length < 1){
                setHeading('No Completed Tasks');
            };
        } catch (error) {
            console.log('Error during fetching done task data from database: ', error);
            setDataList([]);
        };
    };

    // function to navigate to update screen
    const updateValuesFunc = (inp) => {
        setUpdating(true);
        setUpdatePayload({ title: inp.title, category: inp.category, notes: inp.notes, id: inp.id, status: inp.status });
        navigation.navigate({ name: 'Create' });
    };

    // function to render the flat list
    const renderTaskList = ({ item }) => {
        return (
            <>
                {showSelection ?
                    <View style={styles.activeTasksStyle}>
                        <TouchableOpacity style={styles.activeStyleRecord} onPress={() => updateCheckedList(item.ID)}>
                            <View style={styles.checboxBlock}>
                                <Checkbox style={styles.activeStyleRecord} value={selectedRecords.includes(item.ID)} onValueChange={() => updateCheckedList(item.ID)} />
                                <Text style={styles.checkBoxActiveStyleRecordTxt}>{item.TITLE}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.activeTasksStyle}>
                        <TouchableOpacity style={styles.activeStyleRecord} onPress={() => updateValuesFunc({ id: item.ID, title: item.TITLE, status: item.STATUS, category: item.CATEGORY, endtime: item.ENDTIME, notes: item.NOTES })}>
                            <Text style={styles.activeStyleRecordTxt}>{item.TITLE}</Text>
                            <Text style={styles.activeStyleRecordTxt}>View/Edit</Text>
                        </TouchableOpacity>
                    </View>
                }
            </>
        );
    };
    const selectAllFunction = () => {
        setSelectedRecords([]);
        for (i in dataList) {
            console.log('id is ', dataList[i].ID);
            updateCheckedList(dataList[i].ID);
        };
        setShowDeselect(true);
    };
    const deselectAllFunction = () => {
        setShowDeselect(false);
        setSelectedRecords([]);
    }
    const selectRecordsFunction = () => {
        if(dataList && dataList.length < 1){
            alert('no records to select');
            setShowOptions(false);
            return;
        }
        setShowOptions(false);
        setShowSelection(true);
    };
    const updateSelectedAlert = () => {
        Alert.alert('Mark Selected records as Complete', 'Are you sure?', [
            {
                text: 'Yes',
                onPress: async () => await updateCompleteFunction()
            },
            {
                text: 'No',
                onPress: () => console.log('Cancelled the Updation'),
            }
        ]);
    };
    const deleteSelectedAlert = () => {
        Alert.alert('Delete Selected records', 'Are you sure?', [
            {
                text: 'Yes',
                onPress: async () => await deleteSelectedFunction()
            },
            {
                text: 'No',
                onPress: () => console.log('Cancelled the Deletion'),
            }
        ]);
    };

    const deleteSelectedFunction = async () => {
        try {
            setLoading(true);
            for (i in selectedRecords) {
                const result = await deleteTaskUsingId({ id: selectedRecords[i] });
                if (result === 'ERROR') {
                    alert('Deletion failed, retry');
                    return;
                }
            };
            alert('Deleted successfully');
            setShowSelection(false);
            setUpdatePayload({});
            setSelectedRecords([]);
            setShowDeselect(false);
        } catch (error) {
            console.log('Error while deleting the records: ', error);
        } finally {
            setLoading(false);
        };
    };

    const updateCompleteFunction = async () => {
        try {
            setLoading(true);
            for (i in selectedRecords) {
                const result = await updateTaskStatusUsingId({ id: selectedRecords[i] });
                if (result === 'ERROR') {
                    alert('Updates failed, retry');
                    return;
                }
            };
            alert('Updated successfully');
            setShowSelection(false);
            setUpdatePayload({});
            setSelectedRecords([]);
            setShowDeselect(false);
        } catch (error) {
            console.log('Error while updating the records: ', error);
        } finally {
            setLoading(false);
        };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} color='white' />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <View style={[styles.dataBlock, { flex: showSelection ? 0.7 : 0.9 }]}>
                <TouchableOpacity style={styles.options} onPress={() => setShowOptions(true)}>
                    <TouchableOpacity style={styles.optionsBtn} onPress={() => navigation.navigate({ name: 'Options' })}>
                        <Image source={require(optionsImg)} style={styles.optionsImg} />
                    </TouchableOpacity>
                </TouchableOpacity>
                {showOptions ?
                    <View style={styles.optionsContainer}>
                        <View style={styles.closeContainer}>
                            <TouchableOpacity onPress={() => setShowOptions(false)}>
                                <Image source={require(closeImg)} style={styles.closeImg} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => fetchAllDoneTasks()}>
                                <Text style={styles.buttonTxt}>Completed Tasks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => fetchAllOpenTasks()}>
                                <Text style={styles.buttonTxt}>Active Tasks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Categorized',{dataList})}>
                                <Text style={styles.buttonTxt}>View Categorized Tasks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => selectRecordsFunction()}>
                                <Text style={styles.buttonTxt}>Select Tasks</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null}
                <Text style={styles.taskHeading}>{heading}</Text>
                <FlatList
                    data={dataList}
                    renderItem={renderTaskList}
                    keyExtractor={(item, index) => index.toString()}
                    indicatorStyle="white"
                />
            </View>
            <View style={styles.buttonsBlock}>
                {showSelection ?
                    <>
                        <TouchableOpacity style={styles.button} onPress={() => deleteSelectedAlert()}>
                            <Text style={styles.buttonTxt}>Delete Selected</Text>
                        </TouchableOpacity>
                        {completedTasks ? null
                            :
                            <TouchableOpacity style={styles.button} onPress={() => updateSelectedAlert()}>
                                <Text style={styles.buttonTxt}>Mark Completed</Text>
                            </TouchableOpacity>
                        }
                        {showDeselect ?
                            <TouchableOpacity style={styles.button} onPress={() => deselectAllFunction([])}>
                                <Text style={styles.buttonTxt}>Deselect Tasks</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.button} onPress={() => selectAllFunction()}>
                                <Text style={styles.buttonTxt}>Select All</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.button} onPress={() => setShowSelection(false)}>
                            <Text style={styles.buttonTxt}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Home' })}>
                        <Text style={styles.buttonTxt}>Home</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};
export default ShowTasks;
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    container: {
        alignContent: 'center',
        flex: 1,
    },
    headerBlock: {
        flex: 0.05,
        flexDirection: 'row',
    },
    options: {
        alignItems: 'center',
        // marginRight:'2%',
        marginBottom: '1%',
        borderRadius: '10',
        backgroundColor: '#faf7fa',

    },
    optionsBtn: {
        // marginLeft: '4%',
        backgroundColor: '#faf7fa',
    },
    optionsImg: {
        width: 35,
        height: 35,
        tintColor: '#995c99',
    },
    dataBlock: {
        // flex: showSelection ? 0.5 :0.9,
        // flex:0.9,
        width: '96%',
        borderColor: '#ccaecc',
        borderRadius: 4,
        // borderWidth: 3,
        padding: '2%',
        // backgroundColor: '#ffccff',
        margin: '2%',

    },
    buttonsBlock: {
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
    activeTasksStyle: {
        // backgroundColor: '#ffccff',
    },
    activeStyleRecord: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#e0a3e0',
        margin: '1%',
        padding: '2%',
        borderRadius: 6,
    },
    activeStyleRecordTxt: {
        fontFamily: 'Kohinoor Telugu',
        color: '#660066',
        fontSize: 24,
    },
    checkBoxActiveStyleRecordTxt: {
        fontFamily: 'Kohinoor Telugu',
        color: '#660066',
        fontSize: 24,
        marginLeft: 10,
    },
    filterSection: {
        flexDirection: 'row',
        alignContent: 'flex-end'
    },
    filterBtn: {
        width: 120,
        borderRadius: 4,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ff99ff',
        backgroundColor: '#4c2e4c',
        marginLeft: '4%',
    },
    filterBtnTxt: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    filterBtnActive: {
        backgroundColor: '#ff369c',
        width: 120,
        borderRadius: 4,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    filterBtnTxtActive: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },


    optionsContainer: {
        backgroundColor: '#dbc6db',
        // margin: '10%',
        // marginBottom:'50%',
        borderRadius: '20',
        opacity: '0.7',
    },
    closeContainer: {
        alignItems: 'flex-end',
        padding: '1%',
    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeImg: {
        width: 35,
        height: 35,
        tintColor: '#995c99',
    },
    taskHeading: {
        // marginTop: '2%',
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Marker Felt',
    },
    checboxBlock: {
        flexDirection: 'row',
        backgroundColor: '#e0a3e0',
        // margin: '2%',
        // padding: '2%',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
});