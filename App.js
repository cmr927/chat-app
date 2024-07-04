// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import from react
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import from firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

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

const App = () => {
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
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;