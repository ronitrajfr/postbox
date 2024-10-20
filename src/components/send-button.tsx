import { Button } from "~/components/ui/button";
import { Send, Loader2 } from "lucide-react";

export function SendButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
      type="submit"
      className="bg-purple-600 hover:bg-purple-700"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Sending..." : "Send"}
    </Button>
  );
}
