import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function UrlInput({
  url,
  setUrl,
}: {
  url: string;
  setUrl: (url: string) => void;
}) {
  return (
    <div className="flex-grow">
      <Label htmlFor="url" className="sr-only">
        URL
      </Label>
      <Input
        id="url"
        type="url"
        placeholder="Enter request URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border-gray-700 bg-gray-800 text-white placeholder-gray-400"
      />
    </div>
  );
}
