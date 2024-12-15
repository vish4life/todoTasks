// importing libraries
import { createContext, useState } from "react";

// exporting context
export const TaskAppContext = createContext();


const ContextAPI = ({children}) => {
    const [createTask,setCreateTask] = useState(false);
    const [showTasks,setShowTasks] = useState(false);
    const [update,setUpdate] = useState(false);
    const [updatePayload,setUpdatePayload] = useState({});
    const [completedTasks, setCompletedTasks] = useState(true);
    const [groupDataList, setGroupDataList] = useState(null);
    const [showList,setShowList] = useState(false);

    const [openBtn, setOpenBtn] = useState(true);
    const [completedBtn, setCompletedBtn] = useState(false);
    const [displayTitle, setDisplayTitle] = useState('');
    const [dataList, setDataList] = useState(null);
    const [noTasks, setNoTasks] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectTasks, setSelectTasks] = useState(false);
    const [checkedRecords, setCheckedRecords] = useState([]);
    const [classification, setClassification] = useState('');


    const [isErrored,setIsErrored] = useState(false);
    const [errorMsg,setErrorMsg] = useState('');

    const valueDict = {
        createTask,setCreateTask,
        showTasks,setShowTasks,
        update,setUpdate,
        updatePayload,setUpdatePayload,
        completedTasks, setCompletedTasks,
        showList,setShowList,
        openBtn, setOpenBtn,
        completedBtn, setCompletedBtn,
        displayTitle, setDisplayTitle,
        dataList, setDataList,
        noTasks, setNoTasks,
        loading, setLoading,
        isErrored,setIsErrored,
        errorMsg,setErrorMsg,
        selectTasks, setSelectTasks,
        checkedRecords, setCheckedRecords,
        classification, setClassification,
    }
    return(
        <TaskAppContext.Provider value = {valueDict}>
            {children}
        </TaskAppContext.Provider>
    );
};
export default ContextAPI;