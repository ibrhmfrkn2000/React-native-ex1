import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import SqliteMyDatabase from '../../model/SqliteMyDatabase';
import { islogin } from '../../model/UseStateForLogout';
import { useNavigation } from '@react-navigation/native';

const QuestionScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {   //Başlatıldığında otomatik çalıştırması için
    fetchQuestions();
  }, []);

  const handleAnswerSelection = (answer) => { // seçili cevap yoksa seçim yapmak için
    if (!selectedAnswer) {
      setSelectedAnswer(answer);
    }
  };

  const fetchQuestions = () => { //Soruları çektiğimiz fonksiyon
    SqliteMyDatabase.getQuestions() //Soruları çekiyoruz
      .then((response) => {   //Sorular response ile gelir
        setQuestions(response); // Question gelen response ile güncellenir

        if (response.length > 0) {  //Eğer soru varsa
          const randomIndex = Math.floor(Math.random() * response.length); //Soru sayısına göre random bir sayıyı değişkene atıyoruz
          const newQuestion = response[randomIndex]; //Sonra bu random sayıyı soru dizisi olarak gelen response ile birlikte kullanıp soruyu değişkene atıyoruz
          setCurrentQuestion(newQuestion); // O değişkeni kullanarak içindeki soruyu question içine atıyoruz
          setSelectedAnswer(null); // Soru geldiğinde seçili cevap olmasın diye null atıyoruz
        } else {
          setCurrentQuestion(null); //Soru yoksa question içine null atıyoruz
        }
      })
      .catch((error) => {
        console.log('Soruları çekerken hata oluştu:', error);
      });
  };
  const handleNextQuestion = async () => {
    if (!selectedAnswer) {
      return; // Cevap seçilmemişse işlem yapmaması için
    }
  
    const isCorrectAnswer = await checkAnswer(); //Checkanswer cevap doğru mu kontrolü yapıyor ve döndürdüğü değeri bu değişkene atıyoruz
  
    if (isCorrectAnswer) { //Cevap doğru mu? kontrolü
      setCorrectCount(correctCount + 1);// Doğru cevap verildiyse 1 arttırıyoruz
    } else {
      setWrongCount(wrongCount + 1);// Yanlış cevap verildiyse 1 arttırıyoruz
    }
  
    const remainingQuestions = questions.filter((question) => question.id !== currentQuestion.id); // Aynı soru üst üste gelmesin diye currentquestion.id den farklı olanlardan seçiyoruz
  
    if (remainingQuestions.length > 0) {  // remainingQuestions içinde soru var mı kontrolü yapıyoruz
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);//varsa random seçiyoruz
      const newQuestion = remainingQuestions[randomIndex]; // Bunu newquestion değişkenine atıyoruz
      setCurrentQuestion(newQuestion); // Setcurrentquestion state'i ile currentquestionu güncelliyoruz
    } else {
      setCurrentQuestion(null); // Else durumunda null atıyoruz
    }
  
    setSelectedAnswer(null); // Seçili cevabı sıfırlıyoruz
  };
  
  const checkAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) { //İkisinden biri yoksa direkt false dönderiyoruz
      return false;
    }

    try {
      const correctAnswer = await SqliteMyDatabase.getCorrectAnswerForQuestion(currentQuestion.id); //Şuanki sorunun id si neyse ona göre doğru cevabı çekiyoruz
      if (correctAnswer === null) {   //Doğru cevap geldi mi kontrolü
        console.log('Doğru cevap bulunamadı.');
        return false;
      }

      const isCorrectAnswer = selectedAnswer === correctAnswer;  //Doğru cevap ve seçilen cevap denk mi kontrolü yapıyoruz ve denkse değişkene atıyoruz

      console.log('Selected Answer:', selectedAnswer);
      console.log('Correct Answer:', correctAnswer);
      console.log('Is Correct Answer:', isCorrectAnswer);

      return isCorrectAnswer;
    } catch (error) {
      console.log('Doğru cevap çekilirken bir hata oluştu:', error);
      return false;
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) {   //Currentquestion yoksa null dönderiyoruz
      return null;
    }

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        {currentQuestion.answers.map((answer, index) => ( 
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelection(answer)}
            style={[
              styles.option,
              selectedAnswer === answer && styles.selectedOption,
            ]}
          >
            <Text style={styles.optionText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleScore = async () => {
    try {
      await SqliteMyDatabase.addScore(islogin, correctCount, wrongCount);
      console.log('Skor başarıyla eklendi.');
      navigation.navigate('Home')
    } catch (error) {
      console.error('Skor eklenirken hata oluştu:', error);
    }
  };
  
  const renderNextButton = () => { //Sonraki soruya geçmek için kullanılacak butonu oluşturuyoruz
    return (
    <>
      <TouchableOpacity onPress={handleNextQuestion} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Sonraki</Text>
      </TouchableOpacity>
            <TouchableOpacity onPress={handleScore} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Bitir</Text>
          </TouchableOpacity>
    </>
    );
  };

  return (
    <ImageBackground
    source={require('/Users/ibo/Desktop/Furkan/deneme/expo_proje/kidsmath/assets/questionscreen.png')}
    style={styles.backgroundImage}
  >
    <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Doğru: {correctCount}</Text>
        <Text style={styles.scoreText1}>Yanlış: {wrongCount}</Text>
      </View>
    <View style={styles.container}>

      {renderQuestion()}
      {renderNextButton()}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 5,
    marginTop:40
  },
  scoreText: {
    fontSize: 18,
    marginRight: 10,
    fontWeight:'bold',
    color:'green'
  },
  scoreText1: {
    fontSize: 18,
    marginRight: 10,
    fontWeight:'bold',
    color:'red'
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  option: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'green',
  },
  optionText: {
    fontSize: 16,
    marginHorizontal: 100,
  },
  nextButton: {
    backgroundColor: '#29B6F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:5
  },
  nextButtonText: {
    fontSize: 15,
    color: 'white',
    marginHorizontal: 140,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});

export default QuestionScreen;
