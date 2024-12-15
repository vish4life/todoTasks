// importing react and react-native libraries
import { useState, useEffect, useContext } from "react";

// importing database functions
import { getActiveTasks, getCompletedTasks, createTableTodo, getOpenCategories, updateTaskStatusUsingId, deleteTaskUsingId, updateAllTasksStatusUnderCategory, deleteAllTasksUnderCategory } from "../../database/Database";

// importing context from ContextAPI
import { TaskAppContext } from "../../context/ContextAPI";

// declaring variable to fetch the details from context
let contextData = {};


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

// function to fetch categories for all the open tasks
export const fetchAllOpenCategories = async () => {
    try {
        const result = await getOpenCategories();
        console.log('active tasks: ', result);
        if (result.length === 0) {
            console.log('came into no open categories results: ', result);
            setIsErrored(false);
            setErrorMsg('');
            setDataList([]);
            setNoTasks(true);
            setOpenBtn(true);
            setCompletedBtn(false);
            setShowList(false);
            setDisplayTitle('No Open Tasks');
        } else {
            setIsErrored(false);
            setErrorMsg('');
            setDataList(result);
            setOpenBtn(true);
            setCompletedBtn(false);
            setCompletedTasks(false);
            setClassification('OPEN');
        }
    } catch (error) {
        console.log('Error in fetchAllOpenCategories: ', error);
        setIsErrored(true);
        setErrorMsg('Error in fetchAllOpenCategories');
    };
};

