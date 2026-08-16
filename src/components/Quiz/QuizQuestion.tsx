import "./QuizQuestion.css";
import type { QuizQuestion as QuizQuestionType } from "./quizData";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuizQuestionProps) {
  return (
    <div className="quiz-question-card">
      <h2 className="quiz-question">
        {question.question}
      </h2>

      <div className="quiz-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${
              selectedAnswer === index ? "selected" : ""
            }`}
            onClick={() => onSelectAnswer(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}