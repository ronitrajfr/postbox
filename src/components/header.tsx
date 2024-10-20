import { Send } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <h1 className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
        Postbox
      </h1>
      <div className="flex items-center space-x-2">
        <Send className="h-6 w-6 text-purple-400" />
        <span className="text-sm text-gray-400">
          Make API requests with style
        </span>
      </div>
    </header>
  );
}
