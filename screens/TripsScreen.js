// screens/TripsScreen.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../src/api/api.js';

export default function TripsScreen({ route }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = route?.params?.token;

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get('/api/trips', { headers });
      setTrips(res.data || []);
    } catch (err) {
      console.log('Trips fetch error', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.rating}>⭐ {item.rating ?? 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trips</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No trips found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  location: { fontSize: 14, color: '#666' },
  rating: { marginTop: 8, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
