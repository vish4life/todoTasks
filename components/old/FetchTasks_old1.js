// importing react and react-native libraries
import { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";

// importing expo libraries
import Checkbox from "expo-checkbox";

// importing database functions
import { getActiveTasks, getCompletedTasks, createTableTodo, updateTaskStatusUsingId, deleteTaskUsingId, updateAllTasksStatusUnderCategory, deleteAllTasksUnderCategory } from "../../database/Database";

// importing context from ContextAPI
import { TaskAppContext } from "../../context/ContextAPI";

// importing components
import EmptyLines from "../common/general/EmptyLines";

const FetchTasks = () => {
    const [openBtn, setOpenBtn] = useState(true);
    const [completedBtn, setCompletedBtn] = useState(false);
    const [dataList, setDataList] = useState(null);
    const [noTasks, setNoTasks] = useState(false);
    const [heading, setHeading] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectTasks, setSelectTasks] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(true);
    const [checkedRecords, setCheckedRecords] = useState([]);
    const [classification, setClassification] = useState('');

    // getting state variables from context
    const { setUpdatePayload, setUpdate, setCreateTask } = useContext(TaskAppContext);

    // fetching the open tasks details on load
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                await createTableTodo();
                await fetchAllOpenTasks();
            } catch (error) {
                console.log('Error while fetching the data for open tasks: ', error);
            } finally {
                setLoading(false);
            };
        })();
    }, []);

    // function to fetch all the open tasks
    const fetchAllOpenTasks = async () => {
        try {
            setHeading('Open');
            const result = await getActiveTasks();
            console.log('active tasks: ', result);
            if (result.length === 0) {
                console.log('came into no open task results: ', result)
                setDataList([]);
                setNoTasks(true);
                setOpenBtn(true);
                setCompletedBtn(false);
            } else {
                setDataList(result);
                setOpenBtn(true);
                setCompletedBtn(false);
                setCompletedTasks(false);
                setClassification('OPEN');
            }
        } catch (error) {
            console.log('Error in fetchAllOpenTasks: ', error);
        }
    };

    // function to fetch all done tasks
    const fetchAllDoneTasks = async () => {
        try {
            setHeading('Completed');
            const result = await getCompletedTasks();
            console.log('active tasks: ', result);
            if (result.length === 0) {
                setDataList([]);
                setNoTasks(true);
                setOpenBtn(false);
                setCompletedBtn(true);
            } else {
                setDataList(result);
                setOpenBtn(false);
                setCompletedBtn(true);
                setCompletedTasks(true);
                setClassification('DONE');
            }
        } catch (error) {
            console.log('Error in fetchAllDoneTasks: ', error);
        }
    };

    // function to view or edit task
    const viewTaskDetails = async (input) => {
        console.log('came into view task details');
        console.log('input payload: ', input);
        setUpdatePayload(input);
        setUpdate(true);
        setCreateTask(true);
    }

    // function to add or remove records from selected records array
    const updateCheckedList = (recordId) => {
        setCheckedRecords((records) => {
            if (records.includes(recordId)) {
                return records.filter((id) => id !== recordId);
            } else {
                return [...records, recordId];
            }
        });
    };
    // function to call the delete based on confirmation
    const callUpdateFunctions = (input) => {
        if (input === 'SELECTED') {
            if (!checkedRecords.length) {
                alert('please select atleast one record');
                return;
            };
            Alert.alert('Mark selected as Done', 'Are you sure?', [
                {
                    text: 'Yes',
                    onPress: async () => await updateSelectedRecords()
                },
                {
                    text: 'No',
                    onPress: () => console.log('Cancelled the updating selected records'),
                },
            ]);
        };
        if (input === 'ALL') {
            Alert.alert('Mark all tasks Completed', 'Are you sure?', [
                {
                    text: 'Yes',
                    onPress: async () => await updateAllRecordsForCategory()
                },
                {
                    text: 'No',
                    onPress: () => console.log('Cancelled the Update all'),
                },
            ]);
        }
    };
    // function to update selected records
    const updateSelectedRecords = async () => {
        try {
            if (!checkedRecords.length) {
                alert('please select atleast one record');
                return;
            };
            console.log('selected records: ', checkedRecords);
            for (i in checkedRecords) {
                console.log('checked records are: ', checkedRecords[i]);
                const update = await updateTaskStatusUsingId({ id: checkedRecords[i] });
                if (update === 'ERROR') {
                    console.log('Error while updating the selected records, please retry');
                    alert('updates failed,retry');
                    return;
                }
            };
            // fetching the open and deleted records
            if (classification === 'OPEN') {
                await fetchAllOpenTasks();
            };
            if (classification === 'DONE') {
                await fetchAllDoneTasks();
            };
            setCheckedRecords([]);
            setSelectTasks(false);
        } catch (error) {
            console.log('Error while updating the selected records: ', error);
        };
    };

    // function to update all records under a category
    const updateAllRecordsForCategory = async () => {
        try {
            const update = await updateAllTasksStatusUnderCategory(classification);
            if (update === 'ERROR') {
                console.log('Error while updating the selected records, please retry');
                alert('updates failed,retry');
                return;
            };
            // fetching the open and deleted records
            if (classification === 'OPEN') {
                await fetchAllOpenTasks();
            };
            if (classification === 'DONE') {
                await fetchAllDoneTasks();
            };
        } catch (error) {
            console.log(`Updating records under ${inpCategory} failed: `, error);
        };
    };

    // function to call the delete based on confirmation
    const callDeleteFunctions = (input) => {
        if (input === 'SELECTED') {
            if (!checkedRecords.length) {
                alert('please select atleast one record');
                return;
            };
            Alert.alert('Deletion', 'Are you sure?', [
                {
                    text: 'Yes',
                    onPress: async () => await deleteSelectedRecords()
                },
                {
                    text: 'No',
                    onPress: () => console.log('Cancelled the Deletion'),
                },
            ]);
        };
        if (input === 'ALL') {
            Alert.alert('Deletion', 'Are you sure?', [
                {
                    text: 'Yes',
                    onPress: async () => await deleteAllRecordsForCategory()
                },
                {
                    text: 'No',
                    onPress: () => console.log('Cancelled the Deletion'),
                },
            ]);
        }
    };

    // function to delete selected records
    const deleteSelectedRecords = async () => {
        try {
            console.log('selected records: ', checkedRecords);
            for (i in checkedRecords) {
                console.log('checked records are: ', checkedRecords[i]);
                const update = await deleteTaskUsingId({ id: checkedRecords[i] });
                if (update === 'ERROR') {
                    console.log('Error while updating the selected records, please retry');
                    alert('updates failed,retry');
                    return;
                };
            };
            // fetching the open and deleted records
            if (classification === 'OPEN') {
                await fetchAllOpenTasks();
            };
            if (classification === 'DONE') {
                await fetchAllDoneTasks();
            };
            setCheckedRecords([]);
            setSelectTasks(false);
        } catch (error) {
            console.log('Error while updating the selected records: ', error);
        };
    };

    // function to delete all records under a category
    const deleteAllRecordsForCategory = async () => {
        try {
            const update = await deleteAllTasksUnderCategory(classification);
            if (update === 'ERROR') {
                console.log('Error while deleting the selected records, please retry');
                alert('deletes failed,retry');
                return;
            };
            // fetching the open and deleted records
            if (classification === 'OPEN') {
                await fetchAllOpenTasks();
            };
            if (classification === 'DONE') {
                await fetchAllDoneTasks();
            };
        } catch (error) {
            console.log(`deleting records under ${inpCategory} failed: `, error);
        };
    };

    // function to cancel select operation
    const cancelSelectOperation = () => {
        setCheckedRecords([]);
        setSelectTasks(false);
    };

    // function to render the retrieved list
    const RenderingCustomList = () => {
        return (
            <View style={styles.containedList}>
                {selectTasks ?
                    <View>
                        {/* this section gets displayed when select button is clicked */}
                        {dataList.map((dataValue, index) => (
                            <TouchableOpacity key={dataValue.ID} onPress={() => updateCheckedList(dataValue.ID)}>
                            <View style={styles.activeTasksStyle} key={dataValue.ID}>
                                <View style={styles.checboxBlock}>
                                    <Checkbox style={styles.activeStyleRecord} value={checkedRecords.includes(dataValue.ID)} onValueChange={() => updateCheckedList(dataValue.ID)} />
                                    <Text style={styles.activeStyleRecordTxt}>{dataValue.TITLE}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    :
                    <View>
                        {/* this section gets displayed when select button is not clicked */}
                        {dataList.map((dataValue, index) => (
                            <View style={styles.activeTasksStyle} key={dataValue.ID}>
                                <TouchableOpacity style={styles.activeStyleRecord} onPress={() => viewTaskDetails({ title: dataValue.TITLE, notes: dataValue.NOTES, id: dataValue.ID, status: dataValue.STATUS,category:dataValue.CATEGORY })}>
                                    <Text style={styles.activeStyleRecordTxt}>{dataValue.TITLE}</Text>
                                    <Text style={styles.activeStyleRecordTxt}>View/Edit</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                    </View>
                }
                {/* <EmptyLines /> */}
            </View>
        );
    };

    // condition to display spinner during fetch
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} color='white' />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.filterSection}>
                <TouchableOpacity style={openBtn ? styles.filterBtnActive : styles.filterBtn} onPress={() => fetchAllOpenTasks()}>
                    <Text style={openBtn ? styles.filterBtnTxtActive : styles.filterBtnTxt}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity style={completedBtn ? styles.filterBtnActive : styles.filterBtn} onPress={() => fetchAllDoneTasks()}>
                    <Text style={completedBtn ? styles.filterBtnTxtActive : styles.filterBtnTxt}>Completed</Text>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={true} style={styles.listContainer} indicatorStyle="black">
                {dataList && dataList.length > 0 ? <RenderingCustomList /> :
                    noTasks ? <Text style={styles.taskHeading}>No {heading} Tasks</Text> : null
                }
            </ScrollView>
            {selectTasks ?
                <View style={styles.operationsBlock}>
                    {completedTasks ? null :
                        <TouchableOpacity style={styles.operationsBtn} onPress={() => callUpdateFunctions('SELECTED')}>
                            <Text style={styles.operationsBtnTxt}>Complete Selected</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.operationsBtn} onPress={() => callDeleteFunctions('SELECTED')}>
                        <Text style={styles.operationsBtnTxt}>Delete Selected</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.operationsBtn} onPress={() => cancelSelectOperation()}>
                        <Text style={styles.operationsBtnTxt}>Back</Text>
                    </TouchableOpacity>
                </View>
                :
                <View style={styles.operationsBlock}>
                    {dataList && dataList.length > 0 ?
                        <>
                            <TouchableOpacity style={styles.operationsBtn} onPress={() => setSelectTasks(true)}>
                                <Text style={styles.operationsBtnTxt}>Select</Text>
                            </TouchableOpacity>
                            {completedTasks ? null :
                                <TouchableOpacity style={styles.operationsBtn} onPress={() => callUpdateFunctions('ALL')}>
                                    <Text style={styles.operationsBtnTxt}>Mark All Completed</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.operationsBtn} onPress={() => callDeleteFunctions('ALL')}>
                                <Text style={styles.operationsBtnTxt}>Delete All</Text>
                            </TouchableOpacity>
                        </>
                        : null}

                </View>
            }
        </View>
    );
};
export default FetchTasks;
const styles = StyleSheet.create({
    container: {},
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 50,
    },
    filterSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#4c2e4c',
        height: 40,
        alignItems: 'center',
    },
    filterBtn: {
        // backgroundColor: '#4c2e4c',
        width: 120,
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ff99ff',
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
        height: 40,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    filterBtnTxtActive: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    selectSection: {
        alignItems: 'flex-end',
    },
    selectBtn: {
        justifyContent: 'center',
        marginTop: '5%',
        marginBottom: '5%',
    },
    selectBtnTxt: {
        fontSize: 16,
        color: '#fff2f7',
        textAlign: 'center',
    },
    taskHeading: {
        marginTop: '2%',
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Marker Felt',
    },
    listContainer: {
        flexGrow: 0,
        height: 365,
        marginTop:'2%',
        // borderWidth:1,
        // borderColor:'white',
    },
    activeTasksStyle: {
        backgroundColor: '#ffccff',
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
    operationsBlock: {
        alignItems: 'center',
        marginTop: 40,
    },
    operationsBtn: {
        backgroundColor: '#4c2e4c',
        padding: '1%',
        margin: 6,
        borderRadius: 6,
        width: '75%',
        borderColor: '#ff99ff',
        borderWidth: 1,
    },
    operationsBtnTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'Kohinoor Telugu',
    },
    checboxBlock: {
        flexDirection: 'row',
        backgroundColor: '#e0a3e0',
        margin: '1%',
        padding: '2%',
        borderRadius: 6,
    },
    containedList: {
        // margin: 10,
        // padding:4,
    }
});