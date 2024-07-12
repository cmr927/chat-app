//imports
import CustomActions from './CustomActions';
import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar, renderActions } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {
    const [messages, setMessages] = useState([]);
    const { userID, name, background } = route.params;

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
                        text: data.text,
                        createdAt: data.createdAt.toDate(),
                        user: {
                            _id: data.user._id,
                            name: data.user.name
                        }
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

    const onSend = async (newMessages) => {
        try {
            await addDoc(collection(db, "messages"), newMessages[0]);
        } catch (error) {
            console.log(error.message);
        }
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

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        return null;
    };

    return (
        <View style={{ ...styles.container, backgroundColor: background }}>
            <GiftedChat
                renderActions={renderCustomActions}
                messages={messages}
                renderInputToolbar={renderInputToolbar}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
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

    dateText: {
        fontSize: 14,
        textAlign: 'center',
    },

});


export default Chat;
