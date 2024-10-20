import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export function AuthorizationTab({
  authType,
  setAuthType,
  bearerToken,
  setBearerToken,
}: {
  authType: string;
  setAuthType: (type: string) => void;
  bearerToken: string;
  setBearerToken: (token: string) => void;
}) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={authType}
        onValueChange={setAuthType}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bearer" id="bearer" />
          <Label htmlFor="bearer">Bearer Token</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="basic" id="basic" />
          <Label htmlFor="basic">Basic Auth</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom</Label>
        </div>
      </RadioGroup>
      {authType === "bearer" && (
        <div>
          <Label htmlFor="token">Token</Label>
          <Input
            id="token"
            type="text"
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
            placeholder="Enter bearer token"
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>
      )}
      {/* Add inputs for other auth types */}
    </div>
  );
}
