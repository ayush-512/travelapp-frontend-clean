// screens/TripsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../src/api/api';

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/trips');
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log('fetchTrips error:', err?.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
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
      <Text style={styles.header}>Trips</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => String(item.id ?? item._id ?? Math.random())}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={{textAlign:'center',marginTop:20}}>No trips found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  header: { fontSize:20, fontWeight:'700', marginBottom:12 },
  card: { flexDirection:'row', padding:12, borderRadius:10, backgroundColor:'#fff', marginBottom:12, elevation:2, shadowColor:'#000', shadowOpacity:0.06 },
  image: { width:80, height:80, borderRadius:8, marginRight:12 },
  name: { fontSize:16, fontWeight:'700' },
  location: { fontSize:14, color:'#666' },
  rating: { marginTop:8, fontWeight:'600' },
  center: { flex:1, alignItems:'center', justifyContent:'center' }
});
