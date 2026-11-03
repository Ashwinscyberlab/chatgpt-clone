interface FeedbackButtonsProps {
  messageId: string;
  currentFeedback: "thumbs_up" | "thumbs_down" | null;
  onFeedback: (
    messageId: string,
    feedback: "thumbs_up" | "thumbs_down"
  ) => void;
}

export default function FeedbackButtons({
  messageId,
  currentFeedback,
  onFeedback,
}: FeedbackButtonsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => onFeedback(messageId, "thumbs_up")}
        className={`p-1 rounded ${
          currentFeedback === "thumbs_up"
            ? "text-green-400 bg-green-900/30"
            : "text-slate-400 hover:text-green-400"
        }`}
      >
        👍
      </button>
      <button
        onClick={() => onFeedback(messageId, "thumbs_down")}
        className={`p-1 rounded ${
          currentFeedback === "thumbs_down"
            ? "text-red-400 bg-red-900/30"
            : "text-slate-400 hover:text-red-400"
        }`}
      >
        👎
      </button>
    </div>
  );
}
