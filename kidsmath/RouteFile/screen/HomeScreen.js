import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { islogin } from '../../model/UseStateForLogout';

function HomeScreen() {
  const check = islogin;
  const navigation = useNavigation();
    return (
      <ImageBackground
      source={require('/Users/ibo/Desktop/Furkan/deneme/expo_proje/kidsmath/assets/homescreen.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.conteiner}>
      <View style={styles.buttonContainer}>
       <TouchableOpacity style={styles.buton} onPress={()=>{ navigation.navigate("Question") }}><Text style={styles.butonText}>Başla</Text></TouchableOpacity>
       <TouchableOpacity style={styles.buton} onPress={()=>{ navigation.navigate("Profile") }}><Text style={styles.butonText}>Profil</Text></TouchableOpacity>
       <TouchableOpacity style={styles.buton} onPress={()=>{ navigation.navigate("Score") }}><Text style={styles.butonText}>Skor</Text></TouchableOpacity>
      {check==="Admin"?(<TouchableOpacity style={styles.buton} onPress={()=>{ navigation.navigate("Settings") }}><Text style={styles.butonText}>Admin panel</Text></TouchableOpacity>):null }

      </View>
      </View>
      </ImageBackground>
    );
  }
 const styles = StyleSheet.create({
   conteiner:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  butonText:{
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal:50,
  },
  buton: {
    backgroundColor: '#2e86de',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    opacity:50
  },
 });
export default HomeScreen