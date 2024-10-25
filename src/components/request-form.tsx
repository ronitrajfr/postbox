"use client";

import { useState } from "react";
import { UrlInput } from "./url-input";
import { MethodSelect } from "./method-select";
import { SendButton } from "./send-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AuthorizationTab } from "./authoriztion-tab";
import { ContentTab } from "./content-tab";
import { HeadersTab } from "./headers-tab";
import { ResponseDisplay } from "./ui/response-display";
import { ErrorMessage } from "./error-message";

export function RequestForm() {
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      if (!url) {
        throw new Error("URL is required");
      }

      const res = await fetch("/api/get-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method,
          url,
          headers: headers,
          auth: {
            selected: authType,
            bearer: authType === "bearer" ? `Bearer ${bearerToken}` : undefined,
            basic: authType === "basic" ? basicAuth : undefined,
            custom: authType === "custom" ? customAuth : undefined,
          },
          content: {
            type: "application/json",
            content,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            "An error occurred while processing your request",
        );
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
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
      {error && <ErrorMessage message={error} />}
      {response && <ResponseDisplay response={response} />}
    </div>
  );
}
