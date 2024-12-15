// importing community libraries
import NetInfo from '@react-native-community/netinfo';

// importing react and react native libraries
import { useEffect, useState } from 'react';

// importing components
import NoConnection from './NoConnection';

const CheckInternet = ({navigation}) => {
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        (async () => {
            await NetInfo.fetch().then(state => {
                console.log(`checking internet information> |connection type: ${state.type}| connection state: ${state.isConnected}`);
                setIsConnected(state.isConnected);
            });
        })();
    }, []);
    if(isConnected){
        navigation.navigate({name:'Home'});
    }else{
        navigation.navigate({name:'NoConnection'});
    }
};
export default CheckInternet;