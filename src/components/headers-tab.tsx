import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export function HeadersTab({
  headers,
  setHeaders,
}: {
  headers: string;
  setHeaders: (headers: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="headers">Headers (JSON format)</Label>
      <Textarea
        id="headers"
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        placeholder="Enter headers in JSON format"
        className="min-h-[200px] border-gray-700 bg-gray-800 font-mono text-white"
      />
    </div>
  );
}
