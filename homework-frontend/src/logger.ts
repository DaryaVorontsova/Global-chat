class Logger {
  static logRequest(url: string, options: RequestInit, requestName: string) {
    console.log(`[${requestName}] Request made to: ${url}`, options);
  }

  static logResponse(response: Response, requestName: string) {
    console.log(`[${requestName}] Response received:`, response);
  }

  static logError(error: unknown, requestName: string) {
    console.error(`[${requestName}] Error occurred:`, error);
  }
}

export default Logger;
