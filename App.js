import { Alert, LogBox } from "react-native";

LogBox.ignoreLogs(["@firebase/auth: Auth (10.12.3)"]);
LogBox.ignoreLogs(["Support for defaultProps will be removed from function components"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
LogBox.ignoreLogs(["You are initializing Firebase Auth for React Native without providing AsyncStorage"])

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import functions for initializing firebase
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';

// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// Create the navigator
const Stack = createNativeStackNavigator();



const App = () => {
  const connectionStatus = useNetInfo();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAvbxQpdMPzee2Inc9W3ACw5a3-wC6oswU",
    authDomain: "chat-app-d7d2c.firebaseapp.com",
    projectId: "chat-app-d7d2c",
    storageBucket: "chat-app-d7d2c.appspot.com",
    messagingSenderId: "616665589071",
    appId: "1:616665589071:web:57eb1f9bf8df2eabf7d13a"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Initialize Firebase Storage handler
  const storage = getStorage(app);

  //Disables Firestore when there’s no connection and enables it otherwise
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props =>
            <Chat isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;