import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export function ContentTab({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Request Body</Label>
      <Textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter request body"
        className="min-h-[200px] border-gray-700 bg-gray-800 font-mono text-white"
      />
    </div>
  );
}
