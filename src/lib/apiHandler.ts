import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./exceptions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { logger } from "./logger";

type HandlerContext = { params: any };
type ApiHandlerFunction = (
  req: NextRequest,
  context: HandlerContext,
  session?: any
) => Promise<any> | any;

interface ApiHandlerOptions {
  requireAuth?: boolean;
  requiredRole?: "customer" | "staff" | "admin";
}

export function apiHandler(handler: ApiHandlerFunction, options: ApiHandlerOptions = {}) {
  return async (req: NextRequest, context: HandlerContext) => {
    try {
      let session = null;
      if (options.requireAuth || options.requiredRole) {
        session = await getServerSession(authOptions);
        if (!session || !session.user) {
          return NextResponse.json(
            { success: false, error: "Unauthorized access. Please log in." },
            { status: 401 }
          );
        }

        if (options.requiredRole) {
          const userRole = session.user.role;
          if (userRole !== options.requiredRole && userRole !== "admin") {
            return NextResponse.json(
              { success: false, error: "Forbidden. Insufficient permissions." },
              { status: 403 }
            );
          }
        }
      }

      const resolvedParams = context?.params ? await context.params : {};
      const resolvedContext = { params: resolvedParams };

      const data = await handler(req, resolvedContext, session);
      if (data instanceof NextResponse) {
        return data;
      }
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
      logger.error(`API Exception on ${req.method} ${req.nextUrl.pathname}`, error);

      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message, code: error.errorCode },
          { status: error.statusCode }
        );
      }

      if (error.name === "ValidationError" || error.name === "ZodError") {
        return NextResponse.json(
          { success: false, error: error.message || "Validation failed.", details: error.errors || error.details },
          { status: 400 }
        );
      }

      if (error.code === 11000) {
        return NextResponse.json(
          { success: false, error: "Resource conflict: Duplicated entry." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Internal Server Error." },
        { status: 500 }
      );
    }
  };
}
