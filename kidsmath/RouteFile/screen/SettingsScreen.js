import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import SqliteMyDatabase from '../../model/SqliteMyDatabase';

const SettingsScreen = () => {
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('');
  const [answerTexts, setAnswerTexts] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [questionIdValue, setQuestionIdValue] = useState('');
  const [answerTextValue, setAnswerTextValue] = useState('');
  const [correctAnswerId, setCorrectAnswerId] = useState('');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState('');

  useEffect(() => {   //Başlatıldığında otomatik çalıştırması için
    SqliteMyDatabase.initializeDatabase();
  }, []);
  
  const handleAddQuestion = async () => {
    const answers = answerTexts.split(',');
    try {
      const message = await SqliteMyDatabase.addQuestionWithAnswers(questionText, category, answers);
      console.log("başarılı",message);
    } catch (error) {
      console.error(error);
      console.log("hata soru eklenemedi");
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const message = await SqliteMyDatabase.deleteQuestionWithAnswers(selectedQuestionId);
      console.log(message);
      // Başarılı durumda yapılacak işlemler
    } catch (error) {
      console.error(error);
      console.log("hata silinemedi");
    }
  };
  
  const handleAddCorrectAnswer = async () => {
    try {
      const result = await SqliteMyDatabase.addCorrectAnswer(questionIdValue, answerTextValue);
      console.log(result);
      // Başarılı durumda yapılacak işlemler
    } catch (error) {
      console.error(error);
      // Hata durumunda yapılacak işlemler
    }
  };

  const handleDeleteCorrectAnswer = async () => {
    try {
      const result = await SqliteMyDatabase.deleteCorrectAnswer(correctAnswerId);
      console.log(result);
      Alert.alert('Başarılı', 'Doğru cevap başarıyla silindi.');
      console.log('Başarılı', 'Doğru cevap başarıyla silindi.');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Doğru cevap silinirken bir hata oluştu.');
      console.log('Hata', 'Doğru cevap silinirken bir hata oluştu.');
    }
  };

  const handleGetQuestion = async () => {
    try {
      const questions = await SqliteMyDatabase.getQuestions();
      const selectedQuestion = questions[selectedQuestionIndex];
      if (selectedQuestion) {
        setQuestion(selectedQuestion.questionText);
        setQuestionId(selectedQuestion.id.toString());
      } else {
        console.log('Seçilen soru bulunamadı');
      }
    } catch (error) {
      console.error(error);
      console.log('Soru alınırken hata oluştu');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Soru: {question}</Text>
      <Text>Soru ID'si: {questionId}</Text>
      <TextInput
        style={styles.input}
        value={selectedQuestionIndex}
        onChangeText={setSelectedQuestionIndex}
        placeholder="Soru Index'i"
        keyboardType="numeric"
      />
      <Button title="Soruyu Getir" onPress={handleGetQuestion} />

      <TextInput
        style={styles.input}
        value={questionText}
        onChangeText={setQuestionText}
        placeholder="Soru metni"
      />
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Kategori"
      />
      <TextInput
        style={styles.input}
        value={answerTexts}
        onChangeText={setAnswerTexts}
        placeholder="Cevap metinlerini virgülle ayırarak girin"
      />
      <Button title="Soru Ekle" onPress={handleAddQuestion} />

      <TextInput
        style={styles.input}
        value={selectedQuestionId}
        onChangeText={setSelectedQuestionId}
        placeholder="Silinecek sorunun ID'sini girin"
        keyboardType="numeric"
      />
      <Button title="Soruyu Sil" onPress={handleDeleteQuestion} />

      <TextInput
        style={styles.input}
        value={questionIdValue}
        onChangeText={setQuestionIdValue}
        placeholder="Soru ID'sini girin"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={answerTextValue}
        onChangeText={setAnswerTextValue}
        placeholder="Cevap metnini girin"
      />
      <Button title="Doğru Cevap Ekle" onPress={handleAddCorrectAnswer} />

      <TextInput
        style={styles.input}
        value={correctAnswerId}
        onChangeText={setCorrectAnswerId}
        placeholder="Silinecek Doğru Cevap ID'sini girin"
        keyboardType="numeric"
      />
      <Button title="Doğru Cevabı Sil" onPress={handleDeleteCorrectAnswer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;