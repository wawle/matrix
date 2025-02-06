export const errorMiddleware = {
  template: (name: string, props: any) => {
    return `
import { NextResponse } from "next/server";

export const errorHandler = (err: any) => {
  let error = { ...err };
  error.message = err.message;

  console.log({ err });

  // Mongoose bad ObjectId
  if (err.message.includes("Cast to ObjectId")) {
    const message = \`Resource not found\`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.message.includes("duplicate key value")) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.message.includes("validation failed")) {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new ErrorResponse(message, 400);
  }

  return NextResponse.json(
    {
      success: false,
      error: error.message || "Server Error",
    },
    { status: error.statusCode || 500 }
  );
};

export class ErrorResponse extends Error {
  constructor(message: any, statusCode: any) {
    super(message);
    (this as any).statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

    `;
  },
};
