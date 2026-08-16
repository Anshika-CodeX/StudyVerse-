import { AlertTriangle, BookOpen, Target, BrainCircuit } from 'lucide-react';

interface NotesViewerProps {
  notes?: string[];
  edgeCases?: string[];
  interviewQuestions?: string[];
  practiceProblems?: string[];
}

export const NotesViewer = ({
  notes,
  edgeCases,
  interviewQuestions,
  practiceProblems
}: NotesViewerProps) => {
  
  const hasContent = 
    (notes?.length ?? 0) > 0 || 
    (edgeCases?.length ?? 0) > 0 || 
    (interviewQuestions?.length ?? 0) > 0 || 
    (practiceProblems?.length ?? 0) > 0;

  if (!hasContent) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes && notes.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-3">
            <BookOpen size={16} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Important Notes</h3>
          </div>
          <ul className="space-y-2">
            {notes.map((note, i) => (
              <li key={i} className="text-sm text-blue-100/80 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {edgeCases && edgeCases.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <AlertTriangle size={16} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Edge Cases</h3>
          </div>
          <ul className="space-y-2">
            {edgeCases.map((case_, i) => (
              <li key={i} className="text-sm text-amber-100/80 flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>{case_}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {interviewQuestions && interviewQuestions.length > 0 && (
        <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-pink-400 mb-3">
            <BrainCircuit size={16} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Interview Variations</h3>
          </div>
          <ul className="space-y-2">
            {interviewQuestions.map((q, i) => (
              <li key={i} className="text-sm text-pink-100/80 flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {practiceProblems && practiceProblems.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <Target size={16} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Practice Problems</h3>
          </div>
          <ul className="space-y-2">
            {practiceProblems.map((prob, i) => (
              <li key={i} className="text-sm text-emerald-100/80 flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{prob}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
