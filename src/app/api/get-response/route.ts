import { NextResponse, NextRequest } from "next/server";
import { z, ZodError } from "zod";

const requestSchema = z.object({
  auth: z
    .object({
      selected: z.enum(["bearer", "basic", "custom"]),
      bearer: z.string().optional(),
      basic: z
        .object({
          username: z.string().optional(),
          password: z.string().optional(),
        })
        .optional(),
      custom: z.string().optional(),
    })
    .optional(),
  headers: z.string(),
  method: z.enum(["GET", "HEAD", "POST", "PUT", "DELETE"]),
  url: z.string().url(),
  content: z
    .object({
      type: z.string(),
      content: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const parsedBody = requestSchema.parse(body);

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
        "Content-Type": content?.type ?? "application/json", // Use nullish coalescing
        Authorization: auth ?? null, // Keeping it as null
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
      size: (Buffer.from(responseData).length / 1024).toFixed(2), // Size in KB
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
