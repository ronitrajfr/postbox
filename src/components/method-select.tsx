import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function MethodSelect({
  method,
  setMethod,
}: {
  method: string;
  setMethod: (method: string) => void;
}) {
  return (
    <Select value={method} onValueChange={setMethod}>
      <SelectTrigger className="w-[100px] border-gray-700 bg-gray-800 text-white">
        <SelectValue placeholder="Method" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="GET">GET</SelectItem>
        <SelectItem value="POST">POST</SelectItem>
        <SelectItem value="PUT">PUT</SelectItem>
        <SelectItem value="DELETE">DELETE</SelectItem>
      </SelectContent>
    </Select>
  );
}
