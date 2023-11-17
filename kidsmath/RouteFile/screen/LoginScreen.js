import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ImageBackground } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { setislogin } from '../../model/UseStateForLogout';

const db = SQLite.openDatabase('MainDb');

 function LoginScreen(){
  const navigation = useNavigation();

  useEffect (() =>{
    CreateTable();
  }, []);
  //Yoksa tabloyu oluşturur
  const CreateTable = () =>{
    db.transaction((tx)=>tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Users (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Password TEXT)"
    ));
  };

  const [text, setText] = useState('');
  const [password, setPassword] = useState('');

  //Kayıt işlemlerini yapar text ve password boş değilse onları insert eder
  const setData = async () => {
    if (text.length === 0 || password.length === 0) {
      alert("Lütfen boş alanları doldurun.");
    } else {
      try {
        db.transaction(async (tx) => {
          await tx.executeSql(
            "SELECT * FROM Users WHERE Name = ?",
            [text],
            (tx, result) => {
              if (result.rows.length > 0) {
                alert("Hata bu kullanıcı zaten kayıtlı.");
              } else {
                tx.executeSql(
                  "INSERT INTO Users (Name, Password) VALUES (?, ?)",
                  [text, password],
                  () => {
                    setislogin(text);
                    navigation.navigate("Home");
                    setText('');
                    setPassword('');
                  }
                );
              }
            }
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  //Giriş yap butonu için isim ve şifreyi veri tabanında arıyor
  const checkUser = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT Name FROM Users WHERE Name = ? AND Password = ?',
        [text, password],
        (_, result) => {
          if (result.rows.length > 0) {
            setislogin(text);
            navigation.navigate('Home')
            setText('');
            setPassword('');
          } else {
            setislogin(false);
            console.log('Giriş yapılamadı. Hatalı kullanıcı adı veya şifre.');
            alert('Giriş yapılamadı. Hatalı kullanıcı adı veya şifre.');
          }
        },
        (_, error) => {
          console.log('Veritabanında bir hata oluştu:', error);
        }
      );
   });
  };
  const handleLogin = () => {
    checkUser();
  };
  return (
    <ImageBackground
    source={require('/Users/ibo/Desktop/Furkan/deneme/expo_proje/kidsmath/assets/logindcreen.jpg')}
    style={styles.backgroundImage}
  >
    <View  style={styles.container}>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="İsim girin..."
          value={text}
          onChangeText={setText}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifrenizi girin..."
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.link}>
        <TouchableOpacity style={styles.top} onPress={handleLogin}>
          <Text style={styles.yazi}>Giriş yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.top} onPress={setData}>
          <Text style={styles.yazi}>Kayıt ol</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-end",
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor:'white'
  },
  link: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  top: {
    backgroundColor: '#555555',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 2,
  },
  yazi: {
    fontFamily: '',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});

export default LoginScreen