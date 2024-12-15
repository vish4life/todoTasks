// importing libraries
import * as SQLite from 'expo-sqlite';

// declaring database variable
const db = SQLite.openDatabaseAsync('taskitup');

// function to create table
export const createTableTodo = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await (await db).execAsync(
                `   
                    CREATE TABLE IF NOT EXISTS TODO_TABLE(
                    ID INTEGER PRIMARY KEY NOT NULL,
                    TITLE TEXT,
                    NOTES TEXT,
                    CATEGORY TEXT,
                    STATUS TEXT DEFAULT 'OPEN'
            );
                `
            );
            console.log('Table creation successful');
            resolve('SUCCESS');
        } catch (error) {
            console.log('Error while creating the table: ', error);
            reject('ERROR');
        };
    });
};

// function to create task
export const createTodoTask = (input) => {
    console.log('input values before creating task: ',input);
    return new Promise(async (resolve, reject) => {
        try {
            await (await db).runAsync(
                'INSERT INTO TODO_TABLE (TITLE,NOTES,CATEGORY) VALUES (?,?,?)',
                [input.title, input.notes, input.category]
            );
            resolve('SUCCESS');
        } catch (error) {
            console.log('Error while creating the task: ', error);
            reject('ERROR');
        };
    });
};

// function to fetch all open tasks
export const getActiveTasks = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await (await db).getAllAsync(
                "SELECT * FROM TODO_TABLE WHERE STATUS ='OPEN'"
            );
            // console.log('result from db is: ',result);
            resolve(result);
        } catch (error) {
            console.log('Error while fetching all open tasks: ', error);
            reject('ERROR');
        };
    });
    // try {
    //     const result = await (await db).getAllAsync(
    //         "SELECT * FROM TODO_TABLE WHERE STATUS ='OPEN'"
    //     );
    //     // console.log('result from db is: ',result);
    //     return(result);
    // } catch (error) {
    //     console.log('Error while fetching all open tasks: ', error);
    //     throw('ERROR');
    // }
};

// function to fetch categories for all open tasks
export const getAllCategories = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await (await db).getAllAsync(
                "SELECT DISTINCT CATEGORY FROM TODO_TABLE"
            );
            // console.log('result from db is: ',result);
            resolve(result);
        } catch (error) {
            console.log('Error while fetching distinct categories: ', error);
            reject('ERROR');
        };
    });
    // try {
    //     const result = await (await db).getAllAsync(
    //         "SELECT * FROM TODO_TABLE WHERE STATUS ='OPEN'"
    //     );
    //     // console.log('result from db is: ',result);
    //     return(result);
    // } catch (error) {
    //     console.log('Error while fetching all open tasks: ', error);
    //     throw('ERROR');
    // }
};

// function to fetch completed tasks
export const getCompletedTasks = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await (await db).getAllAsync(
                "SELECT * FROM TODO_TABLE WHERE STATUS ='DONE' ORDER BY CATEGORY"
            );
            resolve(result);
        } catch (error) {
            console.log('Error while fetching all completed tasks: ', error);
            reject('ERROR');
        }
    });
};

// function to delete all tasks under a category
export const deleteAllTasksUnderCategory = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (input === 'OPEN') {
                (await (await db).runAsync(
                    "DELETE FROM TODO_TABLE WHERE STATUS ='OPEN'"
                ));
                resolve('SUCCESS');
            };
            if (input === 'DONE') {
                (await (await db).runAsync(
                    "DELETE FROM TODO_TABLE WHERE STATUS ='DONE'"
                ));
                resolve('SUCCESS');
            };
        } catch (error) {
            console.log('Error while deleting tasks under a category: ', error);
            reject('ERROR');
        };
    });
};

// function to delete task based on id
export const deleteTaskUsingId = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            (await (await db).runAsync(
                "DELETE FROM TODO_TABLE WHERE ID =?",[input.id]
            ));
            resolve('SUCCESS');
        } catch (error) {
            console.log('Error while deleting tasks using Id: ', error);
            reject('ERROR');
        };
    });
};

// function to update task details using id
export const updateTaskDetailsUsingId = (input) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            (await (await db).runAsync(
                "UPDATE TODO_TABLE SET TITLE = ?,NOTES =? WHERE ID =?",
                [input.title,input.notes,input.id]
            ));
            resolve('SUCCESS');
        }catch(error){
            console.log('Error while updating task details using Id: ', error);
            reject('ERROR');
        }
    });
};

// function to update the status of task using id
export const updateTaskStatusUsingId = (input) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log('updating the status using id: ',input);
            await (await db).runAsync(
                "UPDATE TODO_TABLE SET STATUS ='DONE' WHERE ID =?",[input.id]
            );
            resolve('SUCCESS');
        }catch(error){
            console.log('Error while updating task status using Id: ', error);
            reject('ERROR');
        };
    });
};

// function to update all tasks status under a category
export const updateAllTasksStatusUnderCategory = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (input === 'OPEN') {
                (await (await db).runAsync(
                    "UPDATE TODO_TABLE SET STATUS ='DONE' WHERE STATUS ='OPEN'"
                ));
                resolve('SUCCESS');
            };
        } catch (error) {
            console.log('Error while updating tasks status under a category: ', error);
            reject('ERROR');
        };
    });
};

// following functions are not being used
// function to update status of selected records using ids
export const updateSelectedTasksStatusUsingIds = (input) => {
    console.log('input values in update selected from db: ',input);
    return new Promise(async (resolve,reject)=>{
        try{
            for (val in input){
                const update = await updateTaskStatusUsingId(input[val]);
                console.log(update);
                if(update === 'ERROR'){
                    reject('ERROR');
                }
                console.log('came into update in db and values are: ',input[val]);
            }
            resolve('SUCCESS');
        }catch(error){
            console.log('Error while updating selected tasks status using ids: ', error);
            reject('ERROR');
        }
    });
};

// function to delete selected records using ids
export const deleteSelectedTasksUsingIds = (input) => {
    return new Promise(async (resolve,reject)=>{
        try{
            for (val in input){
                const update = await deleteTaskUsingId(val);
                if(update === 'ERROR'){
                    reject('ERROR');
                }
            }
            resolve('SUCCESS');
        }catch(error){
            console.log('Error while deleting selected tasks using ids: ', error);
            reject('ERROR');
        }
    });
};