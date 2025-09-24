import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Hello from APIs!",
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DB_NAME: process.env.DB_NAME,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: "Data received from " + body.name,
    data: body,
  });
}
