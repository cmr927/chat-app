import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

const Chat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const { userID, name, background, fontColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name })
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: "You've entered the chat room",
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
                    _id: 1,
                    name
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