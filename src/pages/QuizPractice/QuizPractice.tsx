import { useMemo, useState } from 'react';
import QuizQuestion from '../../components/Quiz/QuizQuestion';
import {
  QUIZ_COUNTS,
  QUIZ_TOPICS,
  getQuestionsByTopic,
  type QuizQuestion as QuizQuestionType,
  type QuizTopic,
} from '../../components/Quiz/quizData';
import './QuizPractice.css';

type QuizStage = 'setup' | 'quiz' | 'result';

interface QuizHistoryItem {
  id: string;
  topic: QuizTopic;
  totalQuestions: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  completedAt: string;
}

const QUIZ_HISTORY_KEY = 'studyverse.quiz.history.v1';

function shuffleQuestions(items: QuizQuestionType[]): QuizQuestionType[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function readQuizHistory(): QuizHistoryItem[] {
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuizHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQuizHistory(history: QuizHistoryItem[]) {
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
}

export function QuizPractice() {
  const [stage, setStage] = useState<QuizStage>('setup');

  const [selectedTopic, setSelectedTopic] = useState<QuizTopic>('Array');
  const [selectedCount, setSelectedCount] = useState<(typeof QUIZ_COUNTS)[number]>(5);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [history, setHistory] = useState<QuizHistoryItem[]>(() => readQuizHistory());

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isQuizComplete = currentQuestionIndex >= quizQuestions.length;
  const correctAnswers = score;
  const wrongAnswers = Math.max(0, quizQuestions.length - correctAnswers);
  const percentage = quizQuestions.length > 0 ? Math.round((correctAnswers / quizQuestions.length) * 100) : 0;

  const availableForTopic = useMemo(() => getQuestionsByTopic(selectedTopic), [selectedTopic]);

  const startQuiz = () => {
    const selected = shuffleQuestions(availableForTopic).slice(0, selectedCount);
    setQuizQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setStage('quiz');
  };

  const submitAnswer = () => {
    if (!currentQuestion || selectedAnswer === null || isSubmitted) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    setIsSubmitted(true);
  };

  const nextQuestion = () => {
    if (!isSubmitted) return;

    const nextIndex = currentQuestionIndex + 1;
    setSelectedAnswer(null);
    setIsSubmitted(false);

    if (nextIndex >= quizQuestions.length) {
      const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
      const finalCorrect = finalScore;
      const finalWrong = Math.max(0, quizQuestions.length - finalCorrect);
      const finalPercent = quizQuestions.length > 0 ? Math.round((finalCorrect / quizQuestions.length) * 100) : 0;

      const record: QuizHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        topic: selectedTopic,
        totalQuestions: quizQuestions.length,
        score: finalCorrect,
        correctAnswers: finalCorrect,
        wrongAnswers: finalWrong,
        percentage: finalPercent,
        completedAt: new Date().toISOString(),
      };

      const nextHistory = [record, ...history].slice(0, 20);
      setHistory(nextHistory);
      writeQuizHistory(nextHistory);
      setStage('result');
      return;
    }

    setCurrentQuestionIndex(nextIndex);
  };

  const resetToSetup = () => {
    setStage('setup');
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
  };

  const isCurrentCorrect = currentQuestion ? selectedAnswer === currentQuestion.correctAnswer : false;

  return (
    <div className="quiz-practice-page">
      <div className="quiz-practice-shell">
        <h1 className="quiz-practice-title">Quiz Practice</h1>
        <p className="quiz-practice-subtitle">Practice MCQs by topic with instant feedback and score history.</p>

        {stage === 'setup' && (
          <div className="quiz-setup-grid">
            <div className="quiz-setup-block">
              <h3>Select Topic</h3>
              <div className="quiz-choice-row">
                {QUIZ_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    className={`quiz-choice-btn ${selectedTopic === topic ? 'active' : ''}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-setup-block">
              <h3>Select Number of Questions</h3>
              <div className="quiz-choice-row">
                {QUIZ_COUNTS.map((count) => (
                  <button
                    key={count}
                    className={`quiz-choice-btn ${selectedCount === count ? 'active' : ''}`}
                    onClick={() => setSelectedCount(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="quiz-primary-btn"
              onClick={startQuiz}
              disabled={availableForTopic.length < selectedCount}
            >
              Start Quiz
            </button>

            <div className="quiz-muted">
              {availableForTopic.length} questions available for {selectedTopic}
            </div>

            {history.length > 0 && (
              <div className="quiz-history-box">
                <h3>Recent History</h3>
                <ul className="quiz-history-list">
                  {history.slice(0, 5).map((item) => (
                    <li key={item.id} className="quiz-history-item">
                      <span className="quiz-history-topic">{item.topic}</span>
                      <span>{item.score}/{item.totalQuestions} ({item.percentage}%)</span>
                      <span className="quiz-muted">{new Date(item.completedAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {stage === 'quiz' && currentQuestion && !isQuizComplete && (
          <>
            <div className="quiz-meta-row">
              <span>Topic: <strong>{selectedTopic}</strong></span>
              <span>Question {currentQuestionIndex + 1} / {quizQuestions.length}</span>
            </div>

            <QuizQuestion
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={setSelectedAnswer}
            />

            {!isSubmitted ? (
              <button
                className="quiz-primary-btn"
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            ) : (
              <>
                <div className={`quiz-answer-feedback ${isCurrentCorrect ? 'correct' : 'wrong'}`}>
                  <h3>{isCurrentCorrect ? 'Correct' : 'Incorrect'}</h3>
                  <p>{currentQuestion.explanation}</p>
                </div>

                <button className="quiz-primary-btn" onClick={nextQuestion}>
                  Next Question
                </button>
              </>
            )}
          </>
        )}

        {stage === 'result' && (
          <>
            <div className="quiz-result-grid">
              <div className="quiz-result-card">
                <div className="quiz-result-label">Final Score</div>
                <div className="quiz-result-value">{correctAnswers} / {quizQuestions.length}</div>
              </div>
              <div className="quiz-result-card">
                <div className="quiz-result-label">Percentage</div>
                <div className="quiz-result-value">{percentage}%</div>
              </div>
              <div className="quiz-result-card">
                <div className="quiz-result-label">Correct Answers</div>
                <div className="quiz-result-value">{correctAnswers}</div>
              </div>
              <div className="quiz-result-card">
                <div className="quiz-result-label">Wrong Answers</div>
                <div className="quiz-result-value">{wrongAnswers}</div>
              </div>
            </div>

            <div className="quiz-choice-row" style={{ marginTop: 22 }}>
              <button className="quiz-primary-btn" onClick={resetToSetup}>Back to Setup</button>
              <button className="quiz-choice-btn" onClick={startQuiz}>Retry Same Setup</button>
            </div>

            <div className="quiz-history-box">
              <h3>Quiz History</h3>
              <ul className="quiz-history-list">
                {history.map((item) => (
                  <li key={item.id} className="quiz-history-item">
                    <span className="quiz-history-topic">{item.topic}</span>
                    <span>{item.correctAnswers} correct / {item.wrongAnswers} wrong</span>
                    <span>{item.percentage}%</span>
                    <span className="quiz-muted">{new Date(item.completedAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
