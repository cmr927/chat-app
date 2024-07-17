//imports
import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';
import { Audio } from "expo-av";
import CustomActions from './CustomActions';

const Chat = ({ db, route, navigation, isConnected, storage }) => {
    const [messages, setMessages] = useState([]);
    const { userID, name, background } = route.params;
    let soundObject = null;

    useEffect(() => {
        let unsubMessages;
        if (isConnected) {
            navigation.setOptions({ title: name });
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = documentsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        _id: doc.id,
                        ...data,
                        createdAt: data.createdAt.toDate(),

                    };
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else {
            loadCachedMessages();
        }
        //Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
            if (soundObject) soundObject.unloadAsync();
        };
    }, [isConnected]);

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || '[]';
        setMessages(JSON.parse(cachedMessages));
    };

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    const onSend = (newMessages) => {
        try {
            addDoc(collection(db, "messages"), newMessages[0]);
        } catch (error) {
            console.log(error.message);
        }
    };

    const renderInputToolbar = (props) => {
        if (isConnected === true) return <InputToolbar {...props} />;
        else return null;
    };

    const renderBubble = (props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    );

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    };

    const renderAudioBubble = (props) => {
        return <View {...props}>
            <TouchableOpacity
                accessible={true}
                accessibilityLabel="Play Sound"
                accessibilityHint="Play Sound"
                accessibilityRole="button"
                style={{
                    backgroundColor: "#FF0", borderRadius: 10, margin: 5
                }}
                onPress={async () => {
                    if (soundObject) soundObject.unloadAsync();
                    const { sound } = await Audio.Sound.createAsync({
                        uri:
                            props.currentMessage.audio
                    });
                    soundObject = sound;
                    await sound.playAsync();
                }}>
                <Text style={{
                    textAlign: "center", color: 'black', padding: 5
                }}>Play Sound</Text>
            </TouchableOpacity>
        </View>
    };

    return (
        <View style={{ ...styles.container, backgroundColor: background }}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                renderMessageAudio={renderAudioBubble}
                user={{
                    _id: userID,
                    name
                }}
            />
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
            {Platform.OS === 'ios' && <KeyboardAvoidingView behavior="padding" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    systemMessageText: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10
    },

    logoutButton: {
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: "#C00",
        padding: 10,
        zIndex: 1
    },
    logoutButtonText: {
        color: "#FFF",
        fontSize: 10
    }
});

export default Chat;
