import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function ResponseDisplay({ response }: { response: any }) {
  // const [isHtml, setIsHtml] = useState(false);

  // //useEffect(() => {
  //   const contentType = response.headers["content-type"] || "";
  //   setIsHtml(contentType.includes("text/html"));
  // //}, [response]);
  const isHtml =
    response.headers["content-type"]?.includes("text/html") ?? false;
  const renderContent = () => {
    if (isHtml) {
      return (
        <Tabs defaultValue="raw" className="w-full">
          <TabsList>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="raw">
            <ScrollArea className="h-60 rounded-md border border-gray-700">
              <pre className="p-4 text-sm">{response.content}</pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="html">
            <ScrollArea className="h-60 rounded-md border border-gray-700">
              <div
                className="p-4 text-sm"
                dangerouslySetInnerHTML={{ __html: response.content }}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      );
    } else {
      return (
        <ScrollArea className="h-60 rounded-md border border-gray-700">
          <pre className="p-4 text-sm">
            {typeof response.content === "object"
              ? JSON.stringify(response.content, null, 2)
              : response.content}
          </pre>
        </ScrollArea>
      );
    }
  };

  return (
    <Card className="mt-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Response</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-1 text-sm font-semibold">Status</h3>
            <p className="text-lg">{response.status}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">Time Taken</h3>
            <p className="text-lg">{response.time_taken} ms</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">Size</h3>
            <p className="text-lg">{response.size} KB</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="mb-1 text-sm font-semibold">Headers</h3>
          <ScrollArea className="h-40 rounded-md border border-gray-700">
            <pre className="p-4 text-sm">
              {JSON.stringify(response.headers, null, 2)}
            </pre>
          </ScrollArea>
        </div>
        <div className="mt-4">
          <h3 className="mb-1 text-sm font-semibold">Content</h3>
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}
