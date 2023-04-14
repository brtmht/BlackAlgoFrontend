/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
// Import the functions you need from the SDKs you need
const initializeApp = require('firebase/app');
const { getAnalytics } = require('firebase/analytics');
const { getMessaging, getToken } = require('firebase/messaging');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCLDDUSU6pE90jkzVVpa4lL3P9O3X5BSM4',
  authDomain: 'test-project-algo.firebaseapp.com',
  projectId: 'test-project-algo',
  storageBucket: 'test-project-algo.appspot.com',
  messagingSenderId: '943710591273',
  appId: '1:943710591273:web:bae82c564bf594e7f7ff38',
  measurementId: 'G-W0HMTV2W8H',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Add the public key generated from the console here.
getToken(messaging, {
  vapidKey: 'BI-_cMu3ILb5d3ze9ahC_OOxQOZFpuZstsXbb6puM_Y8bVz4WjOMC7FBjlVXkzuNLdx7OAFBDT84JMy-lcqZx78',
});
/**
 * key Pair
 * BI-_cMu3ILb5d3ze9ahC_OOxQOZFpuZstsXbb6puM_Y8bVz4WjOMC7FBjlVXkzuNLdx7OAFBDT84JMy-lcqZx78
 */
// eslint-disable-next-line no-unused-vars
const requestPermission = () => {
  getToken();
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  });
};

module.exports = {
  requestPermission,
};
