// frontend/screens/TripsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { setAuthToken, saveTripApi, unsaveTripApi, getSavedTripIdsApi } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);   // 👈 added error state
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingIds, setSavingIds] = useState(new Set());

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      setAuthToken(token);
      await loadData();
    })();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tripsRes = await api.get('/api/trips');
      setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
      const ids = await getSavedTripIdsApi();
      setSavedIds(new Set(ids));
    } catch (err) {
      console.log('loadData err', err?.response?.data || err.message);
      setError('Could not load trips. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (tripId) => {
    if (savingIds.has(tripId)) return;
    const isSaved = savedIds.has(tripId);

    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(tripId); else next.add(tripId);
      return next;
    });
    setSavingIds(prev => new Set(prev).add(tripId));

    try {
      if (!isSaved) {
        await saveTripApi(tripId);
      } else {
        await unsaveTripApi(tripId);
      }
    } catch (err) {
      setSavedIds(prev => {
        const next = new Set(prev);
        if (!isSaved) next.delete(tripId); else next.add(tripId);
        return next;
      });
      console.log('toggleSave err', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to update saved status.');
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(tripId);
        return next;
      });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setAuthToken(null);
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => {
    const id = item.id ?? item._id;
    const isSaved = savedIds.has(id);
    const isSaving = savingIds.has(id);

    return (
      <View style={styles.card}>
        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.rating}>⭐ {item.rating ?? '—'}</Text>
        </View>

        <TouchableOpacity onPress={() => toggleSave(id)} style={styles.saveButton}>
          {isSaving ? (
            <ActivityIndicator size="small" />
          ) : (
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? 'red' : '#333'} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ✅ Loading UI
  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Heading at the top */}
      <View style={styles.headerBar}>
        <Text style={styles.header}>Trips</Text>
      </View>

      {/* ✅ Error + Retry UI */}
      {error && (
        <View style={{padding:12, backgroundColor:'#fee', borderRadius:8, margin:12}}>
          <Text style={{color:'#a00', marginBottom:8}}>{error}</Text>
          <Button title="Retry" onPress={loadData} />
        </View>
      )}

      {/* Trips List */}
      <FlatList
        data={trips}
        keyExtractor={(item) => String(item.id ?? item._id ?? Math.random())}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        // ✅ Empty list UI
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:20 }}>No trips yet. Save one to see it here.</Text>}
      />

      {/* 🔹 Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.bottomButton}>
          <Ionicons name="person-circle-outline" size={22} color="#007AFF" />
          <Text style={styles.bottomText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Recommendations')} style={styles.bottomButton}>
          <Ionicons name="sparkles-outline" size={22} color="#007AFF" />
          <Text style={styles.bottomText}>Recommendations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Confirm Logout",
              "Are you sure you want to log out?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: handleLogout }
              ]
            );
          }}
          style={styles.bottomButton}
        >
          <Ionicons name="log-out-outline" size={22} color="#e33" />
          <Text style={[styles.bottomText, {color:'#e33'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f9f9f9' },

  // Header
  headerBar:{
    paddingTop:50,
    paddingBottom:12,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderColor:'#ddd',
    alignItems:'center'
  },
  header: { fontSize:22, fontWeight:'700', color:'#333' },

  // Trip cards
  card: { flexDirection:'row', padding:12, borderRadius:10, backgroundColor:'#fff', margin:12, alignItems:'center', elevation:2, shadowColor:'#000', shadowOpacity:0.05 },
  image: { width:80, height:80, borderRadius:8, marginRight:12 },
  name: { fontSize:16, fontWeight:'700' },
  location: { fontSize:14, color:'#666' },
  rating: { marginTop:8, fontWeight:'600' },
  saveButton: { padding:8, marginLeft:8 },
  center: { flex:1, alignItems:'center', justifyContent:'center' },

  // Bottom bar
  bottomBar:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    paddingVertical:10,
    borderTopWidth:1,
    borderColor:'#ddd',
    backgroundColor:'#fff',
    position:'absolute',
    bottom:0,
    left:0,
    right:0
  },
  bottomButton:{
    alignItems:'center'
  },
  bottomText:{
    fontSize:12,
    fontWeight:'600',
    marginTop:4
  }
});
