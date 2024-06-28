import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name, background } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    return (
        <View style={{ ...styles.container, backgroundColor: background }}>
            <Text style={styles.text}>Welcome, {name}! Chat coming soon!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text:
    {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083"
    }
});

export default Chat;