import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { requestSchema } from "~/types/requestSchema";

const rateLimitMap = new Map();
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    //@ts-ignore
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      req.ip ??
      "127.0.0.1";

    console.log(ip);

    //const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const limit = 5; // Limiting requests to 5 per minute per IP
    const windowMs = 60 * 1000; // 1 minute
    const parsedBody = requestSchema.parse(body);
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0;
      ipData.lastReset = Date.now();
    }

    if (ipData.count >= limit) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    ipData.count += 1;

    const { method, url, headers, content } = parsedBody;

    let auth = null;

    if (parsedBody.auth) {
      const {
        auth: { selected, bearer, basic, custom },
      } = parsedBody;

      if (selected === "bearer" && bearer?.trim() !== "Bearer") {
        auth = bearer;
      } else if (
        selected === "basic" &&
        basic?.username?.trim() !== "" &&
        basic?.password?.trim() !== ""
      ) {
        auth = `Basic ${Buffer.from(`${basic?.username}:${basic?.password}`).toString("base64")}`;
      } else if (selected === "custom" && custom?.trim() !== "") {
        auth = custom;
      }
    }

    const requestHeaders = headers.trim() === "" ? {} : JSON.parse(headers);

    let resp;
    const startTime = Date.now();

    const fetchOptions = {
      method,
      headers: {
        ...requestHeaders,
        "Content-Type": content?.type ?? "application/json",
        Authorization: auth ?? null,
      },
      ...(method !== "GET" &&
        method !== "HEAD" && { body: content?.content ?? null }),
    };

    resp = await fetch(url, fetchOptions);

    const timeTaken = Date.now() - startTime;
    const responseData = await resp.text();

    return NextResponse.json({
      status: resp.status,
      headers: Object.fromEntries(resp.headers),
      content: responseData,
      time_taken: timeTaken,
      size: (Buffer.from(responseData).length / 1024).toFixed(2),
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
