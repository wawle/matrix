import { NextResponse } from "next/server";

export const errorHandler = (err: any) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new ErrorResponse(message, 400);
  }

  return NextResponse.json(
    {
      status: false,
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