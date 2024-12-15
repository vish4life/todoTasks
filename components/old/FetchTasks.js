// importing react and react-native libraries
import { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from "react-native";

// importing context from ContextAPI
import { TaskAppContext } from "../../context/ContextAPI";

// importing functions to perform actions


const FetchTasks = () => {
    // const getCat = fetchAllOpenCategories();
    // console.log('getCat is: ',getCat);
    // getting state variables from context
    const {
        createTask, setCreateTask,
        showTasks, setShowTasks,
        update, setUpdate,
        updatePayload, setUpdatePayload,
        completedTasks, setCompletedTasks,
        showList, setShowList,
        openBtn, setOpenBtn,
        completedBtn, setCompletedBtn,
        displayTitle, setDisplayTitle,
        dataList, setDataList,
        noTasks, setNoTasks,
        loading, setLoading,
        isErrored, setIsErrored,
        errorMsg, setErrorMsg,
        selectTasks, setSelectTasks,
        checkedRecords, setCheckedRecords,
        classification, setClassification,
    } = useContext(TaskAppContext);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} color='white' />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.filterSection}>
                <TouchableOpacity style={openBtn ? styles.filterBtnActive : styles.filterBtn}>
                    <Text style={openBtn ? styles.filterBtnTxtActive : styles.filterBtnTxt}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity style={completedBtn ? styles.filterBtnActive : styles.filterBtn}>
                    <Text style={completedBtn ? styles.filterBtnTxtActive : styles.filterBtnTxt}>Completed</Text>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={true} style={styles.listContainer} indicatorStyle="black" borderWidth={dataList && dataList.length > 0 ? 5 : 0} >
                {dataList && dataList.length > 0 ? <RenderingCustomList /> :
                    noTasks ? <Text style={styles.taskHeading}>{displayTitle}</Text> : null
                }
            </ScrollView>
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
        marginTop: '2%',
        // borderWidth: dataList.length>0 ? 5 : 0,
        borderColor: '#ccaecc',
        borderRadius: 4,

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