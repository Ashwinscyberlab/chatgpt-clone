import { useState } from "react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isConnected: boolean;
  isLoading: boolean;
  onImageUpload: (file: File, message: string) => Promise<void>;
}

export default function MessageInput({
  inputMessage,
  setInputMessage,
  sendMessage,
  isConnected,
  isLoading,
  onImageUpload,
}: MessageInputProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedImage) {
        handleImageSend();
      } else {
        sendMessage();
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleImageSend = async () => {
    if (!selectedImage || !isConnected || isLoading) return;

    const message = inputMessage.trim();
    await onImageUpload(selectedImage, message);

    setSelectedImage(null);
    setImagePreview(null);
    setInputMessage("");
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const isImageMode = selectedImage !== null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 shadow-lg">
        {imagePreview && (
          <div className="mb-3 p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-200">
                📷 Image selected
              </span>
              <button
                onClick={removeSelectedImage}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                ✕ Remove
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border border-slate-600"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-300">{selectedImage?.name}</p>
                <p className="text-xs text-slate-400">
                  {(selectedImage?.size || 0) / 1024 / 1024} MB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <label className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={!isConnected || isLoading}
              className="hidden"
            />
            <span className="hidden sm:inline">🖼️</span>
            <span className="sm:hidden">🖼️</span>
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isImageMode
                ? "Add a message about this image..."
                : "Type your message..."
            }
            disabled={!isConnected || isLoading}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 bg-slate-700 text-slate-200 placeholder-slate-400"
          />
          <button
            onClick={isImageMode ? handleImageSend : sendMessage}
            disabled={
              !isConnected ||
              isLoading ||
              (!inputMessage.trim() && !isImageMode)
            }
            className="px-3 py-2 sm:px-6 sm:py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <span className="hidden sm:inline">
              {isImageMode ? "Send Image" : "Send"}
            </span>
            <span className="sm:hidden">{isImageMode ? "📷" : "→"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
