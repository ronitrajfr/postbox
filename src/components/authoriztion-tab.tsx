import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

const formatBearerToken = (token: string) => {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

export function AuthorizationTab({
  authType,
  setAuthType,
  bearerToken,
  setBearerToken,
  basicAuth,
  setBasicAuth,
  customAuth,
  setCustomAuth,
}: {
  authType: string;
  setAuthType: (type: string) => void;
  bearerToken: string;
  setBearerToken: (token: string) => void;
  basicAuth: { username: string; password: string };
  setBasicAuth: (auth: { username: string; password: string }) => void;
  customAuth: string;
  setCustomAuth: (auth: string) => void;
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
          <Label htmlFor="bearer-token">Bearer Token</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-700 bg-gray-800 px-3 text-sm text-gray-400">
              Bearer
            </span>
            <Input
              id="bearer-token"
              type="text"
              value={bearerToken}
              onChange={(e) =>
                setBearerToken(
                  e.target.value.startsWith("Bearer ")
                    ? e.target.value.slice(7)
                    : e.target.value,
                )
              }
              placeholder="Enter token"
              className="flex-1 rounded-none rounded-r-md border-gray-700 bg-gray-800 text-white"
            />
          </div>
        </div>
      )}

      {authType === "basic" && (
        <div className="space-y-2">
          <div>
            <Label htmlFor="basic-username">Username</Label>
            <Input
              id="basic-username"
              type="text"
              value={basicAuth.username}
              onChange={(e) =>
                setBasicAuth({ ...basicAuth, username: e.target.value })
              }
              placeholder="Enter username"
              className="border-gray-700 bg-gray-800 text-white"
            />
          </div>
          <div>
            <Label htmlFor="basic-password">Password</Label>
            <Input
              id="basic-password"
              type="password"
              value={basicAuth.password}
              onChange={(e) =>
                setBasicAuth({ ...basicAuth, password: e.target.value })
              }
              placeholder="Enter password"
              className="border-gray-700 bg-gray-800 text-white"
            />
          </div>
        </div>
      )}

      {authType === "custom" && (
        <div>
          <Label htmlFor="custom-auth">Custom Authorization</Label>
          <Input
            id="custom-auth"
            type="text"
            value={customAuth}
            onChange={(e) => setCustomAuth(e.target.value)}
            placeholder="Enter custom authorization"
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>
      )}
    </div>
  );
}
