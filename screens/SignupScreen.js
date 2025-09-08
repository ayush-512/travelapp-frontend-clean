// frontend/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
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
      <Text style={styles.title}>Signup</Text>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Signup</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20},
  title:{fontSize:28,fontWeight:'700',textAlign:'center',marginBottom:20},
  input:{borderWidth:1,borderColor:'#ddd',padding:12,borderRadius:8,marginBottom:12},
  button:{backgroundColor:'#1f6feb',padding:12,borderRadius:8,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'600'}
});
