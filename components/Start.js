import { useState } from "react";
import {
    StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView
} from "react-native";

// Define the Start component
const Start = ({ navigation }) => {
    // State to hold the name input value
    const [name, setName] = useState("");
    // State to hold the chosen background color
    const [background, setBackground] = useState("");

    return (
        <ImageBackground
            source={require("../assets/background-image.png")}
            style={styles.imageBackground}
            resizeMode="cover"
        >
            <Text style={styles.appTitle}>Chat App</Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your Name"
                />

                <View style={styles.chooseColorBox}>
                    <Text style={styles.chooseColorText}>Choose Background Color:</Text>
                    <View style={styles.colorButtonsContainer}>
                        {/* Render a TouchableOpacity for each color option */}
                        <TouchableOpacity
                            style={[
                                styles.chooseColor,
                                { backgroundColor: "#090C08" },
                                background === "#090C08" && styles.selectedColor,
                            ]}
                            // Set the function to handle button press
                            onPress={() => setBackground("#090C08")}
                        ></TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.chooseColor,
                                { backgroundColor: "#474056" },
                                background === "#474056" && styles.selectedColor,
                            ]}
                            onPress={() => setBackground("#474056")}
                        ></TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.chooseColor,
                                { backgroundColor: "#8A95A5" },
                                background === "#8A95A5" && styles.selectedColor,
                            ]}
                            onPress={() => setBackground("#8A95A5")}
                        ></TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.chooseColor,
                                { backgroundColor: "#B9C6AE" },
                                background === "#B9C6AE" && styles.selectedColor,
                            ]}
                            onPress={() => setBackground("#B9C6AE")}
                        ></TouchableOpacity>
                    </View>
                </View>

                {/* Render a TouchableOpacity for starting the chat */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { name: name, background: background })}>
                    <Text style={styles.textButton}>Start Chatting

                    </Text>

                </TouchableOpacity>
                {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    appTitle: {
        flex: 1,
        fontSize: 45,
        fontWeight: "600",
        color: "#ffffff",
        justifyContent: "center",
        marginTop: 80,
    },
    container: {
        width: "88%",
        height: "44%",
        backgroundColor: "white",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "space-evenly",
        borderRadius: 4,
    },

    textInput: {
        width: "84%",
        padding: 10,
        borderWidth: 1,
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.7,
        borderColor: "#757083",
        borderRadius: 4,
    },
    button: {
        width: "84%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#757083",
        padding: 10,
        marginTop: 5,
    },
    textButton: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
    chooseColorBox: {
        width: "84%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    colorButtonsContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
    },
    chooseColor: {
        width: 30,
        height: 30,
        borderRadius: 15,
        border: 3,
        marginRight: 15,
        borderColor: "white",
    },
    selectedColor: {
        borderColor: "#757083",
        borderWidth: 3,
    },

    chooseColorText: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        textAlign: "left",
        alignSelf: "flex-start",
        marginBottom: 10,
    },
});

export default Start;