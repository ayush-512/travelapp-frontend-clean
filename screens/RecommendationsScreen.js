// frontend/screens/RecommendationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRecommendationsApi, setAuthToken } from '../src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecommendationsScreen({ navigation }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 added error state

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) setAuthToken(token);
      fetchRecs();
    })();
  }, []);

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecommendationsApi();
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log('recs err', err?.response?.data || err.message);
      setError('Failed to load recommendations. Please try again.');
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
      </View>
    </TouchableOpacity>
  );

  // ✅ Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Recommended For You</Text>

      {/* ✅ Error + Retry UI */}
      {error && (
        <View style={{padding:12, backgroundColor:'#fee', borderRadius:8, marginBottom:12}}>
          <Text style={{color:'#a00', marginBottom:8}}>{error}</Text>
          <Button title="Retry" onPress={fetchRecs} />
        </View>
      )}

      {/* ✅ Empty list UI */}
      <FlatList 
        data={list} 
        keyExtractor={(i)=>String(i.id ?? i._id ?? Math.random())} 
        renderItem={renderItem} 
        ListEmptyComponent={<Text style={{textAlign:'center',marginTop:20}}>No recommendations available yet. Check back later!</Text>} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16, backgroundColor:'#f5f5f5'},
  header:{fontSize:20,fontWeight:'700',marginBottom:12, textAlign:'center'},
  card:{flexDirection:'row',padding:12,borderRadius:10,backgroundColor:'#fff',marginBottom:12, elevation:2},
  image:{width:80,height:80,borderRadius:8,marginRight:12},
  name:{fontSize:16,fontWeight:'700'},
  location:{fontSize:14,color:'#666'},
  center:{flex:1,alignItems:'center',justifyContent:'center'}
});
