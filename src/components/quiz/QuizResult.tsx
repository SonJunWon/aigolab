interface Props {
  title: string;
  total: number;
  correct: number;
  onRetry: () => void;
  onNext?: () => void;
}

export function QuizResult({ title, total, correct, onRetry, onNext }: Props) {
  const percent = Math.round((correct / total) * 100);
  const isPerfect = correct === total;
  const isGood = percent >= 60;

  const emoji = isPerfect ? "🏆" : isGood ? "👍" : "📚";
  const message = isPerfect
    ? "완벽해요! 모두 맞았습니다!"
    : isGood
    ? "잘했어요! 대부분 맞았네요."
    : "아직 어려운 부분이 있네요. 챕터를 다시 읽어보면 도움이 될 거예요.";

  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="text-xl font-semibold text-colab-text mb-1">
        {title} 결과
      </h3>
      <p className="text-3xl font-bold text-colab-accent mb-2">
        {correct} / {total}
      </p>
      <p className="text-sm text-colab-textDim mb-6">{message}</p>

      {/* 스코어 바 */}
      <div className="max-w-xs mx-auto mb-6">
        <div className="h-3 rounded-full bg-colab-bg overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPerfect
                ? "bg-colab-green"
                : isGood
                ? "bg-colab-accent"
                : "bg-colab-yellow"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-colab-textDim">{percent}%</div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-5 py-2 text-sm rounded-lg border border-colab-subtle text-colab-text
                     hover:border-colab-accent hover:text-colab-accent transition-colors"
        >
          다시 풀기
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="px-5 py-2 text-sm rounded-lg bg-colab-accent text-colab-bg font-medium
                       hover:bg-colab-accentDim transition-colors"
          >
            다음 챕터 →
          </button>
        )}
      </div>
    </div>
  );
}
