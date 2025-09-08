// frontend/screens/TripsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api, { setAuthToken } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      setAuthToken(token);
      fetchTrips();
    })();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/trips');
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log('fetch trips err', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setAuthToken(null);
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.rating}>⭐ {item.rating ?? '—'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <Text style={styles.header}>Trips</Text>
        <TouchableOpacity onPress={handleLogout} style={{padding:8}}>
          <Text style={{color:'#e33'}}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => String(item.id ?? item._id ?? Math.random())}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:20 }}>No trips found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  header: { fontSize:22, fontWeight:'700' },
  card: { flexDirection:'row', padding:12, borderRadius:10, backgroundColor:'#fff', marginBottom:12, elevation:2, shadowColor:'#000', shadowOpacity:0.05 },
  image: { width:80, height:80, borderRadius:8, marginRight:12 },
  name: { fontSize:16, fontWeight:'700' },
  location: { fontSize:14, color:'#666' },
  rating: { marginTop:8, fontWeight:'600' },
  center: { flex:1, alignItems:'center', justifyContent:'center' }
});
