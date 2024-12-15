// importing libraries
import { StyleSheet, View, Text } from 'react-native';
import { useContext } from 'react';

// importing components
import Launch from './Launch';
import ShowTasks from './ShowTasks';
import CreateTasks from './CreateTasks';

// importing context
import { TaskAppContext } from '../../context/ContextAPI';


const Welcome = () => {
    const { createTask, showList } = useContext(TaskAppContext);
    return (
        <View style={styles.createView}>
            {showList ? <ShowTasks />
                :
                <View>
                    {createTask ? <CreateTasks /> : <Launch />}
                </View>
            }
        </View>
    );
};
export default Welcome;

const styles = StyleSheet.create({

    createView: {
        margin: '3%',
    },
});
