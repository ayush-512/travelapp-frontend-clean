// frontend/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import api, { setAuthToken } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return Alert.alert('Please fill all fields');
    setLoading(true);
    try {
      const res = await api.post('/api/signup', { name, email, password });
      setLoading(false);
      if (res.data?.success) {
        const token = res.data.token;
        if (token) {
          await AsyncStorage.setItem('token', token);
          setAuthToken(token);
          navigation.replace('Trips');
          return;
        }
        Alert.alert('Signup successful', 'You can now login');
        navigation.replace('Login');
      } else {
        Alert.alert('Signup failed', res.data?.message || 'Error');
      }
    } catch (err) {
      setLoading(false);
      console.log('signup err', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.message || 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      {/* App logo */}
      <Image 
        source={{ uri: 'https://img.icons8.com/fluency/96/add-user-male.png' }} 
        style={styles.logo} 
      />

      <Text style={styles.title}>Create Account</Text>

      <TextInput 
        placeholder="Full Name" 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholderTextColor="#888"
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" 
        placeholderTextColor="#888"
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading 
          ? <ActivityIndicator color="#fff" /> 
          : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop:20}} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
    backgroundColor:'#f5f5f5'
  },
  logo:{
    width:90,
    height:90,
    marginBottom:20
  },
  title:{
    fontSize:28,
    fontWeight:'700',
    marginBottom:20,
    color:'#333',
    textAlign:'center'
  },
  input:{
    width:'100%',
    borderWidth:1,
    borderColor:'#ccc',
    backgroundColor:'#fff',
    padding:14,
    borderRadius:10,
    marginBottom:12,
    fontSize:16
  },
  button:{
    width:'100%',
    backgroundColor:'#007AFF',
    padding:15,
    borderRadius:10,
    alignItems:'center',
    marginTop:10,
    elevation:3
  },
  buttonText:{
    color:'#fff',
    fontWeight:'600',
    fontSize:18
  },
  link:{
    color:'#007AFF',
    fontSize:16,
    fontWeight:'500'
  }
});
