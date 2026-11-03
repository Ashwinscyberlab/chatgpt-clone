import ConnectionStatus from "../ui/ConnectionStatus";

interface ChatHeaderProps {
  isConnected: boolean;
}

export default function ChatHeader({ isConnected }: ChatHeaderProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 p-3 sm:p-4">
      <h1 className="text-lg sm:text-xl font-semibold text-slate-200">
        ChatApp
      </h1>
      <ConnectionStatus isConnected={isConnected} />
    </div>
  );
}
