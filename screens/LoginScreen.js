// frontend/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api, { setAuthToken } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Please enter email & password');
    setLoading(true);
    try {
      const res = await api.post('/api/login', { email, password });
      setLoading(false);
      if (res.data?.success) {
        const token = res.data.token;
        if (token) {
          await AsyncStorage.setItem('token', token);
          setAuthToken(token);
        }
        navigation.replace('Trips');
      } else {
        Alert.alert('Login failed', res.data?.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoading(false);
      console.log('login err', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.message || 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop:12}} onPress={() => navigation.navigate('Signup')}>
        <Text style={{color:'#1f6feb', textAlign:'center'}}>Create an account</Text>
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
