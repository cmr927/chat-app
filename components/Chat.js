import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {
    const [messages, setMessages] = useState([]);
    const { userID, name, background, fontColor } = route.params;

    let unsubMessages;

    useEffect(() => {
        if (isConnected === true) {
            navigation.setOptions({ title: name });
            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), where("uid", "==", userID));
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    });
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else loadCachedMessages();

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    const renderBubble = (props) => {
        return <Bubble
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
    }

    const renderSystemMessage = (props) => {
        return (
            <View style={styles.systemMessageContainer}>
                <Text style={{ ...styles.systemMessageText, color: fontColor }}>{props.currentMessage.text}</Text>
            </View>
        );
    };

    const renderDay = (props) => {
        // Only render the date for the first message
        if (props.currentMessage._id === messages[messages.length - 1]._id) {
            return (
                <View>
                    <Text style={{ ...styles.dateText, color: fontColor }}>{props.currentMessage.createdAt.toDateString()}</Text>
                </View>
            );
        }
        return null;
    };

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    return (
        <View style={{ ...styles.container, backgroundColor: background }}>
            <GiftedChat
                messages={messages}
                renderInputToolbar={renderInputToolbar}
                renderBubble={renderBubble}
                renderSystemMessage={renderSystemMessage}
                renderDay={renderDay}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    )
}

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