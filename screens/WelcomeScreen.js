import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Optional: put a logo in assets/images/logo.png */}
      <Image source={require('./assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to TravelApp</Text>
      <Text style={styles.subtitle}>Discover places. Plan trips. Travel easy.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:20 },
  logo: { width:100, height:100, marginBottom:20, resizeMode:'contain' },
  title: { fontSize:26, fontWeight:'700', marginBottom:8 },
  subtitle: { fontSize:16, color:'#555', textAlign:'center', marginBottom:20 },
  button: { backgroundColor:'#1f6feb', paddingVertical:12, paddingHorizontal:30, borderRadius:8 },
  buttonText: { color:'#fff', fontSize:16, fontWeight:'600' }
});
