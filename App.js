// importing react and react native libraries
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import expo libraries
import { LinearGradient } from 'expo-linear-gradient';

// importing context
import ContextAPI from './context/ContextAPI';


// importing components
import Welcome from './components/Welcome';
import ShowTasks from './components/ShowTasks';
import Options from './components/Options';
import CreateTasks from './components/CreateTask';
import UserGuide from './components/common/general/UserGuide';
import CategorizedTasks from './components/CategorizedTasks';
import Footer from './components/Footer';
import NoConnection from './components/common/internet/NoConnection';

// importing community libraries
import NetInfo from '@react-native-community/netinfo';

// importing react and react native libraries
import { useEffect, useState } from 'react';


// declaring stack navigation variable
const Stack = createNativeStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await NetInfo.fetch().then(state => {
          console.log(`checking internet information> |connection type: ${state.type}| connection state: ${state.isConnected}`);
          setIsConnected(state.isConnected);
        });
      } catch (error) {
        console.log('Error while fetching internet status: ', error);
      } finally {
        setLoading(false);
      };

    })();
    console.log('is internet connected ?: ', isConnected);
  }, [isConnected]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color='white' />
      </View>
    );
  };

  if (!isConnected) {
    return <NoConnection />;
  };
  return (
    <NavigationContainer>
      <ContextAPI>
        <LinearGradient colors={['#b285b2', '#995c99', '#4c2e4c']} style={styles.linearGradient}>
          <SafeAreaView style={styles.contentContainer}>
            <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'none' }}>
              {/* <Stack.Screen name="InternetCheck" component={CheckInternet} options={{ title: 'ConnectivityCheck', }} />
              <Stack.Screen name="NoConnection" component={NoConnection} options={{ title: 'NoNet', }} /> */}
              <Stack.Screen name="Home" component={Welcome} options={{ title: 'Home', }} />
              <Stack.Screen name="Guide" component={UserGuide} options={{ title: 'Guid', }} />
              <Stack.Screen name="Tasks" component={ShowTasks} options={{ title: 'Tasks', }} />
              <Stack.Screen name="Options" component={Options} options={{ title: 'Options', }} />
              <Stack.Screen name="Categorized" component={CategorizedTasks} options={{ title: 'Categorized', }} />
              <Stack.Screen name="Create" component={CreateTasks} options={{ title: 'Create', }} />
            </Stack.Navigator>
          </SafeAreaView>
          <View style={styles.footerContainer}>
            <Footer />
          </View>
        </LinearGradient>
      </ContextAPI>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    opacity: 0.95,
  },
  contentContainer: {
    flex: 0.95,
  },
  footerContainer: {
    flex: 0.05,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
