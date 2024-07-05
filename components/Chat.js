import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const { userID, name, background, fontColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages);
        });

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);

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

    return (
        <View style={{ ...styles.container, backgroundColor: background }}>
            <GiftedChat
                messages={messages}
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