import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

function apiLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
      },
      "API Request",
    );
  });

  next();
}

export default apiLogger;
