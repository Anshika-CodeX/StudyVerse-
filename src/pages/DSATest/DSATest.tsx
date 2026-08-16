import { useState } from "react";
import { DSA_TEST_QUESTIONS } from "../../components/Quiz/quizData";
import QuizQuestion from "../../components/Quiz/QuizQuestion";
import "./DSATest.css";

export default function DSATest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question = DSA_TEST_QUESTIONS[currentQuestion];

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setIsSubmitted(true);

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setCurrentQuestion(currentQuestion + 1);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="test-page">
      <div className="test-container">
        <div className="test-header">
          <h1>Linked List Test</h1>

          <p className="question-count">
            Question {currentQuestion + 1} / {DSA_TEST_QUESTIONS.length}
          </p>
        </div>

        <QuizQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
        />

        {!isSubmitted ? (
          <button
            className="submit-button"
            disabled={selectedAnswer === null}
            onClick={handleSubmit}
          >
            Submit Answer
          </button>
        ) : (
          <>
            <div
              className={`answer-result ${
                isCorrect ? "correct" : "wrong"
              }`}
            >
              <h3>
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </h3>

              <p>
                {question.explanation}
              </p>
            </div>

            {currentQuestion < DSA_TEST_QUESTIONS.length - 1 && (
              <button
                className="submit-button"
                onClick={handleNext}
              >
                Next Question →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}