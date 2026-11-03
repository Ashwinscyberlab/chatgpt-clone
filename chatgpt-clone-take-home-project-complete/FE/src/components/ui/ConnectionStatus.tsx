interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({
  isConnected,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center mt-2">
      <div
        className={`w-3 h-3 rounded-full mr-2 ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm text-slate-400">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
