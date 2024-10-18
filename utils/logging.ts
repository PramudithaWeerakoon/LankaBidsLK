import fs from 'fs';
import path from 'path';

// Ensure the log directory exists
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

export function writeGeneralLog(
  logFile: string, 
  operation: string, 
  resource: string, 
  userEmail: string, 
  action: string, 
  result: string, 
  details?: string
) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  
  // If the result is 'Failure', include the error details; otherwise, only log the result
  const logDetails = result === 'Failure' && details ? ` - Error Details: ${details}` : ` - ${details || ''}`; 

  const logEntry = `[${timestamp}] [Operation: ${operation}] [Resource: ${resource}] [UserEmail: ${userEmail}]: ${action} - ${result}${logDetails}`;

  const logFilePath = path.join(logDirectory, logFile);

  // Append the log entry to the specified log file
  fs.appendFileSync(logFilePath, logEntry + '\n', 'utf8');
}
