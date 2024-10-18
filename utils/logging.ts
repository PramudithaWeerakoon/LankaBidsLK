import fs from 'fs';
import path from 'path';

// Ensure the log directory exists
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Utility function to write logs to a specific log file
export function writeLog(logFile: string, role: string, userEmail: string, productId: number, action: string, result: string, details: string) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const logEntry = `[${timestamp}] [${role}] [UserEmail: ${userEmail}]: ${action} on ProductID: ${productId} - ${result} - ${details}\n`;

  const logFilePath = path.join(logDirectory, logFile);

  // Append the log entry to the specified log file
  fs.appendFileSync(logFilePath, logEntry, 'utf8');
}
