import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/HomeScreen';
import LoginScreen from './screen/LoginScreen';
import QuestionScreen from './screen/QuestionScreen';
import ProfileScreen from './screen/ProfileScreen';
import SettingsScreen from './screen/SettingsScreen';
import ScoreScreen from './screen/ScoreScreen';

const Stack = createNativeStackNavigator();
//Bütün ekranlar burdan yönlendiriliyor
const Directions = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Login'>
    <Stack.Screen options={{ title: 'Giriş', headerTitleAlign:'center'}} name="Login" component={LoginScreen} />
    <Stack.Screen options={{ title: 'Anasayfa', headerShown:false}} name="Home" component={HomeScreen} />
    <Stack.Screen options={{ title: 'Sorular', headerTitleAlign:'center'}} name="Question" component={QuestionScreen} />
    <Stack.Screen options={{ title: 'Profil', headerTitleAlign:'center'}} name="Profile" component={ProfileScreen} />
    <Stack.Screen options={{ title: 'Ayarlar', headerTitleAlign:'center'}} name="Settings" component={SettingsScreen} />
    <Stack.Screen options={{ title: 'Skor', headerTitleAlign:'center'}} name="Score" component={ScoreScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default Directions