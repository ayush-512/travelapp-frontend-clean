// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { setAuthToken } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 added error state

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/profile'); // protected route
      setProfile(res.data);
    } catch (err) {
      console.log('profile error', err?.response?.data || err.message);
      setError('Could not load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    setAuthToken(null);
    navigation.replace('Login');
  }

  useEffect(() => { loadProfile(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#555' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Error + Retry */}
      {error && (
        <View style={{padding:12, backgroundColor:'#fee', borderRadius:8, marginBottom:20}}>
          <Text style={{color:'#a00', marginBottom:8}}>{error}</Text>
          <Button title="Retry" onPress={loadProfile} />
        </View>
      )}

      {/* ✅ Empty state */}
      {!profile && !error && (
        <View style={styles.center}>
          <Text style={{ color: '#e33' }}>No profile data</Text>
        </View>
      )}

      {profile && (
        <>
          {/* Avatar */}
          <Image
            source={{ uri: 'https://img.icons8.com/color/96/user-male-circle--v1.png' }}
            style={styles.avatar}
          />

          {/* Name & Email */}
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>

          {/* Buttons */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Trips')}>
            <Text style={styles.buttonText}>⬅ Back to Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#e33', marginTop: 10 }]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 20 
  },
  name: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#333', 
    marginBottom: 6 
  },
  email: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 30 
  },
  button: { 
    width: '80%',
    backgroundColor: '#007AFF', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center',
    elevation: 3
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  }
});
