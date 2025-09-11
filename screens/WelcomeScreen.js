// frontend/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* App Icon / Logo */}
      <Image 
        source={{ uri: 'https://img.icons8.com/color/96/globe--v1.png' }} 
        style={styles.logo} 
      />

      {/* Title */}
      <Text style={styles.title}>🌍 Welcome to Veloura</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Plan your trips, explore destinations, and enjoy your journey
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f5f5f5',
    padding:20
  },
  logo:{
    width:100,
    height:100,
    marginBottom:30
  },
  title:{
    fontSize:28,
    fontWeight:'bold',
    marginBottom:10,
    color:'#333',
    textAlign:'center'
  },
  subtitle:{
    fontSize:16,
    textAlign:'center',
    marginBottom:40,
    color:'#666',
    paddingHorizontal:10
  },
  button:{
    backgroundColor:'#007AFF',
    paddingVertical:15,
    paddingHorizontal:60,
    borderRadius:30,
    elevation:3 // shadow for Android
  },
  buttonText:{
    color:'#fff',
    fontSize:18,
    fontWeight:'600'
  }
});
