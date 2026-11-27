// src/app/api/registrations/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      status: false,
      message: 'This registration endpoint has been retired. Please use the current registration form.',
    },
    { status: 410 },
  );
}