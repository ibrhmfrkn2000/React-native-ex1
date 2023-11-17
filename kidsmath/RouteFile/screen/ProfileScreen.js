import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { islogin } from '../../model/UseStateForLogout';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {   //Çıkış yap butonuna dokunulursa login ekranına dönüyoruz
    navigation.navigate('Login');
  };

  const result = islogin; //giriş yapıldıysa giriş yapanın ismini değişkene atar

  return (
    <ImageBackground
    source={require('/Users/ibo/Desktop/Furkan/deneme/expo_proje/kidsmath/assets/homescreen.jpg')}
    style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <Text style={styles.text}>Kullanıcı: {result}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight:'bold',
  },
  button: {
    backgroundColor: '#555555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});

export default ProfileScreen;