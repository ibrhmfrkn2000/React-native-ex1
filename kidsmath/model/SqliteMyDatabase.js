import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('MainDb');

//tablo yoksa oluşturmak için
const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, questionText TEXT)',
      [],
      () => {
        console.log('Soru tablosu oluşturuldu.');
      },
      (tx, error) => {
        console.log('Soru tablosu oluşturulurken hata oluştu:', error);
      }
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS answers (id INTEGER PRIMARY KEY AUTOINCREMENT, questionId INTEGER, answerText TEXT)',
      [],
      () => {
        console.log('Cevap tablosu oluşturuldu.');
      },
      (tx, error) => {
        console.log('Cevap tablosu oluşturulurken hata oluştu:', error);
      }
    );
  });
};
//Soruları ve cevapları çekmek için
const getQuestions = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT questions.id, questions.category, questions.questionText, answers.answerText FROM questions LEFT JOIN answers ON questions.id = answers.questionId',
        [],
        (_, result) => {
          const questionsMap = new Map();
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            const questionId = row.id;
            const questionCategory = row.category;
            const questionText = row.questionText;
            const answerText = row.answerText;

            if (questionsMap.has(questionId)) {
              const question = questionsMap.get(questionId);
              question.answers.push(answerText);
            } else {
              const question = {
                id: questionId,
                category: questionCategory,
                questionText: questionText,
                answers: [answerText],
              };
              questionsMap.set(questionId, question);
            }
          }

          const questions = Array.from(questionsMap.values());
          resolve(questions);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
// Soru ve cevapları insert etmek için
const addQuestionWithAnswers = (questionText, category, answerTexts) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO questions (category, questionText) VALUES (?, ?)',
        [category, questionText],
        (_, result) => {
          const questionId = result.insertId;
          const promises = answerTexts.map((answerText) => {
            return new Promise((resolve, reject) => {
              tx.executeSql(
                'INSERT INTO answers (questionId, answerText) VALUES (?, ?)',
                [questionId, answerText],
                (_, result) => {
                  resolve(result);
                },
                (_, error) => {
                  reject(error);
                }
              );
            });
          });
          Promise.all(promises)
            .then(() => {
              resolve('Soru ve cevaplar başarıyla eklendi.');
            })
            .catch((error) => {
              reject('Cevaplar eklenirken hata oluştu:', error);
            });
        },
        (_, error) => {
          reject('Soru eklenirken hata oluştu:', error);
        }
      );
    });
  });
};

//Sorularla cevapları silmek için
const deleteQuestionWithAnswers = (questionId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM questions WHERE id = ?',
        [questionId],
        (_, result) => {
          tx.executeSql(
            'DELETE FROM answers WHERE questionId = ?',
            [questionId],
            (_, result) => {
              resolve('Soru ve cevaplar başarıyla silindi.');
            },
            (tx, error) => {
              reject('Cevaplar silinirken hata oluştu:', error);
            }
          );
        },
        (tx, error) => {
          reject('Soru silinirken hata oluştu:', error);
        }
      );
    });
  });
};
// Doğru cevapları insert etmek için
const addCorrectAnswer = (questionId, answerText) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS correct_answers (id INTEGER PRIMARY KEY AUTOINCREMENT, questionId INTEGER, answerText TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO correct_answers (questionId, answerText) VALUES (?, ?)',
            [questionId, answerText],
            (_, result) => {
              resolve(result);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
//Doğru cevaplar tablosundan soru id'sine göre doğru cevabı çeker
const getCorrectAnswerForQuestion = (questionId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT answerText FROM correct_answers WHERE questionId = ?',
        [questionId],
        (tx, result) => {
          if (result.rows.length > 0) {
            const correctAnswer = result.rows.item(0).answerText;
            resolve(correctAnswer);
          } else {
            reject(new Error('Soru bulunamadı.'));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

const deleteCorrectAnswer = (correctAnswerId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM correct_answers WHERE questionId = ?',
        [correctAnswerId],
        (_, result) => {
          resolve('Doğru cevap başarıyla silindi.');
        },
        (_, error) => {
          reject('Doğru cevap silinirken hata oluştu:', error);
        }
      );
    });
  });
};

const addScore = (nick, CorrectAnswer, WrongAnswer) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${nick} (id INTEGER PRIMARY KEY AUTOINCREMENT, Correct INTEGER, Wrong INTEGER)`,
        [],
        () => {
          console.log('Tablo oluşturuldu.');
        },
        (tx, error) => {
          console.log('Tablo oluşturulurken hata oluştu:', error);
        }
      );
      
      tx.executeSql(
        `INSERT INTO ${nick} (Correct, Wrong) VALUES (?, ?)`,
        [CorrectAnswer, WrongAnswer],
        (_, result) => {
          resolve(result.rowsAffected);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const getScores = (tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        (_, result) => {
          const scores = [];
          for (let i = 0; i < result.rows.length; i++) {
            const score = result.rows.item(i);
            scores.push(score);
          }
          resolve(scores);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};


export default {
  initializeDatabase,
  addQuestionWithAnswers,
  deleteQuestionWithAnswers,
  getQuestions,
  getCorrectAnswerForQuestion,
  addCorrectAnswer,
  deleteCorrectAnswer,
  addScore,
  getScores
};