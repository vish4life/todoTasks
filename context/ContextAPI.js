// importing libraries
import { createContext, useState } from "react";

// exporting context
export const TaskAppContext = createContext();

const ContextAPI = ({ children }) => {
    const[displayWelcome,setDisplayWelcome] = useState(false);
    const [updatePayload,setUpdatePayload] = useState({});
    const [updating,setUpdating] = useState(false);
    const [isConnected, setIsConnected] = useState(false);    
    const valueDict = {
        displayWelcome,setDisplayWelcome,
        updatePayload,setUpdatePayload,
        updating,setUpdating,
        isConnected, setIsConnected,
    };
    return (
        <TaskAppContext.Provider value={valueDict}>
            {children}
        </TaskAppContext.Provider>
    );
};
export default ContextAPI;