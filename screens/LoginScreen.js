// frontend/screens/LoginScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Alert, Image 
} from 'react-native';
import api, { setAuthToken } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';   // 👁 for eye toggle

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Updated handleLogin (from your snippet)
  const handleLogin = async (email,password,navigation,setLoading) => {
    if (!email || !password) {
      return Alert.alert('Missing info', 'Please enter email & password');
    }
    setLoading(true);
    try {
      const resp = await api.post('/api/login', { email, password });
      const token = resp.data.token;
      if (!token) throw new Error('No token received');

      // save locally
      await AsyncStorage.setItem('token', token);
      // attach to subsequent requests
      setAuthToken(token);
      console.log('✅ Token saved:', token.slice(0, 20) + '...');

      // navigate to main screen
      navigation.replace('Home');
    } catch (err) {
      console.error('Login error', err?.response?.data || err.message);
      Alert.alert('Login failed', err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App logo */}
      <Image 
        source={{ uri: 'https://img.icons8.com/fluency/96/login-rounded-right.png' }} 
        style={styles.logo} 
      />

      <Text style={styles.title}>Login</Text>

      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address" 
        placeholderTextColor="#888"
      />

      {/* Password input with eye toggle */}
      <View style={styles.passwordContainer}>
        <TextInput 
          placeholder="Password" 
          style={styles.passwordInput} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={!showPassword} 
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={22} 
            color="#333" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleLogin} 
        disabled={loading}
      >
        {loading 
          ? <ActivityIndicator color="#fff" /> 
          : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
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
  passwordContainer:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#ccc',
    backgroundColor:'#fff',
    paddingHorizontal:14,
    borderRadius:10,
    marginBottom:12
  },
  passwordInput:{
    flex:1,
    fontSize:16,
    paddingVertical:14
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
