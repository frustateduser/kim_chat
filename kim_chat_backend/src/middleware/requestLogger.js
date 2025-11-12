import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const sanitizedUrl = typeof req.url === "string" ? req.url.replace(/[\n\r]/g, "") : "";
  logger.info("%s %s %s", req.method, sanitizedUrl, JSON.stringify(req.body));
  next();
};

export default requestLogger;
