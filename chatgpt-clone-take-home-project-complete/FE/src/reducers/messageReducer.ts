import { MessageType } from "@/components/chat/Message";

type MessageAction =
  | { type: "ADD_MESSAGE"; payload: MessageType }
  | { type: "ADD_STREAMING_MESSAGE" }
  | { type: "UPDATE_STREAMING_MESSAGE"; payload: string }
  | {
      type: "COMPLETE_STREAMING_MESSAGE";
      payload: { text: string; metrics?: MessageType["metrics"] };
    }
  | {
      type: "SET_FEEDBACK";
      payload: { messageId: string; feedback: MessageType["feedback"] };
    };

export const messageReducer = (
  state: MessageType[],
  action: MessageAction
): MessageType[] => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];

    case "ADD_STREAMING_MESSAGE":
      return [
        ...state,
        {
          id: Math.random().toString(),
          text: "",
          sender: "ai",
          timestamp: new Date(),
          isStreaming: true,
          feedback: null,
        },
      ];

    case "UPDATE_STREAMING_MESSAGE":
      const updatedState = state.map((msg) => {
        const updatedMessageText = msg.text + action.payload;

        return msg.isStreaming
          ? {
              ...msg,
              text: updatedMessageText,
            }
          : msg;
      });
      return updatedState;

    case "COMPLETE_STREAMING_MESSAGE":
      return state.map((msg) =>
        msg.isStreaming
          ? {
              ...msg,
              text: action.payload.text,
              isStreaming: false,
              metrics: action.payload.metrics,
            }
          : msg
      );

    case "SET_FEEDBACK":
      return state.map((msg) =>
        msg.id === action.payload.messageId
          ? { ...msg, feedback: action.payload.feedback }
          : msg
      );

    default:
      return state;
  }
};
