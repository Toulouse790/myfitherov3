
/**
 * Utility function to retry an asynchronous operation with exponential backoff
 * 
 * @param operation The function to execute
 * @param retries The maximum number of retry attempts
 * @param delay The initial delay between retries in ms
 * @param backoff Factor to multiply delay by after each attempt
 * @returns Promise resolving to the operation result
 */
export const retryOperation = async <T,>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 300,
  backoff = 2
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * backoff, backoff);
  }
};
