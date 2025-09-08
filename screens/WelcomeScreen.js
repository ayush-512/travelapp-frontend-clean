// frontend/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Welcome to TravelApp</Text>
      <Text style={styles.subtitle}>Plan your trips, explore destinations, and enjoy your journey</Text>

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
  container:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#f5f5f5',padding:20},
  title:{fontSize:28,fontWeight:'bold',marginBottom:10,color:'#333',textAlign:'center'},
  subtitle:{fontSize:16, textAlign:'center', marginBottom:40, color:'#666'},
  button:{backgroundColor:'#007AFF',paddingVertical:15,paddingHorizontal:40,borderRadius:10},
  buttonText:{color:'#fff',fontSize:18,fontWeight:'600'}
});
