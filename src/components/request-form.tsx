"use client";

import { useState } from "react";
import { UrlInput } from "./url-input";
import { MethodSelect } from "./method-select";
import { SendButton } from "./send-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { AuthorizationTab } from "./authoriztion-tab";
import { ContentTab } from "./content-tab";
import { HeadersTab } from "./headers-tab";
import { ResponseDisplay } from "./ui/response-display";

export function RequestForm() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("{}");
  const [content, setContent] = useState("");
  const [authType, setAuthType] = useState("bearer");
  const [bearerToken, setBearerToken] = useState("");
  const [basicAuth, setBasicAuth] = useState({ username: "", password: "" });
  const [customAuth, setCustomAuth] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/get-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method,
          url,
          headers,
          auth: {
            selected: authType,
            bearer: authType === "bearer" ? bearerToken : undefined,
            basic: authType === "basic" ? basicAuth : undefined,
            custom: authType === "custom" ? customAuth : undefined,
          },
          content: {
            type: "application/json", // You might want to make this configurable
            content,
          },
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error occured",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <UrlInput url={url} setUrl={setUrl} />
          <MethodSelect method={method} setMethod={setMethod} />
          <SendButton isLoading={isLoading} />
        </div>
        <Tabs defaultValue="authorization" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="authorization">Authorization</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="authorization">
            <AuthorizationTab
              authType={authType}
              setAuthType={setAuthType}
              bearerToken={bearerToken}
              setBearerToken={setBearerToken}
              basicAuth={basicAuth}
              setBasicAuth={setBasicAuth}
              customAuth={customAuth}
              setCustomAuth={setCustomAuth}
            />
          </TabsContent>
          <TabsContent value="content">
            <ContentTab content={content} setContent={setContent} />
          </TabsContent>
          <TabsContent value="headers">
            <HeadersTab headers={headers} setHeaders={setHeaders} />
          </TabsContent>
        </Tabs>
      </form>
      {response && <ResponseDisplay response={response} />}
    </div>
  );
}
