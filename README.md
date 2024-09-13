# Chat App

## Description
Chat App is a native chat app, built with React Native, Expo, and Google Firestore Database. It is optimized for both Android and iOS devices.

## Features
- A page where users can enter their name and choose a background color for the chat screen
before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat provides users with two additional communication features: sending images
and location data.
- Data gets stored online and offline.

## Technologies Used
- React Native
- Expo
- Expo ImagePicker
- Expo Location
- Google Firestore/Firebase
- Gifted Chat Library
- Android Studio
 
## Dependencies
- React
- Expo
- Firebase
    
## Prerequisites
- Node.js

## Installation
1. Clone the repository: git clone https://github.com/cmr927/chat-app
2. Install required dependencies using ```npm install```
3. Google Firestore/Firebase
   - Create an account
   - Start a new project
   - Set up database under build --> Firestore Database
   - Activate storage
   - Change rules from ```'allow read, write: if false;'``` to ```'allow read, write: if true;'```
   - Update your firebaseConfig in your App.js file
   - Start the Expo development server: ```npx expo start```
## Usage
1. Running on an Emulator:
   - Ensure you have an Android or iOS emulator running
   - Press a (for Android) or i (for iOS) in the Expo CLI to start the app on the emulator
2. Running on a Physical Device:
   - Install the Expo Go app from the App Store or Google Play
   - Scan the QR code generated by ```npx expo start``` to run the app on your device

## License
This project is licensed under the terms of the [ISC License](https://opensource.org/licenses/ISC).
