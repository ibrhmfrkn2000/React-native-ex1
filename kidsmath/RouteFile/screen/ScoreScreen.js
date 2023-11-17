import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,ImageBackground } from 'react-native';
import SqliteMyDatabase from '../../model/SqliteMyDatabase';
import { islogin } from '../../model/UseStateForLogout';

const ScoreScreen = () => {
  const [scores, setScores] = useState([]);

  const check = islogin;
  useEffect(() => {
    fetchScores(check);
  }, []);

  const fetchScores = () => {
    SqliteMyDatabase.getScores(check)
      .then((scores) => {
        setScores(scores);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderScoreItem = ({ item }) => {
    return (
      <View style={styles.scoreItem}>
        <Text style={styles.scoreText}>Doğru: {item.Correct}  Yanlış: {item.Wrong}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
    source={require('/Users/ibo/Desktop/Furkan/deneme/expo_proje/kidsmath/assets/homescreen.jpg')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <FlatList
        data={scores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scoreList}
        showsVerticalScrollIndicator={true}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreList: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  scoreItem: {
    backgroundColor: 'lightblue',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginHorizontal:90
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    opacity:50
  },
});

export default ScoreScreen;