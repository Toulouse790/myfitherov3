import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import { AdminService, N8nConfig } from '@/services/admin';
import { retryOperation } from '@/utils/retryOperation';

export const useN8nConfig = () => {
  const [n8nUrl, setN8nUrl] = useState('');
  const [n8nTestLoading, setN8nTestLoading] = useState(false);
  const [n8nConnectionStatus, setN8nConnectionStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchN8nConfig = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null); // Reset error messages
    
    try {
      // Use the retry function to attempt up to 3 times with exponential backoff
      const config = await retryOperation(
        () => AdminService.getN8nConfig(),
        3, // 3 attempts
        300, // Initial delay of 300ms
        2 // Backoff factor
      );
      
      setN8nUrl(config.url);
      setN8nConnectionStatus(config.status);
    } catch (error) {
      console.error('Error fetching n8n config after retries:', error);
      setN8nConnectionStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(`Failed after multiple attempts: ${error.message}`);
      } else {
        setErrorMessage('Failed after multiple attempts: unknown error');
      }
      
      toast.error('Error', { 
        description: 'Unable to load n8n configuration after multiple attempts' 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const testN8nConnection = useCallback(async () => {
    setN8nTestLoading(true);
    setErrorMessage(null);
    
    try {
      // API call to test webhook
      const testResult = await AdminService.updateN8nConfig(n8nUrl);
      
      if (testResult) {
        setN8nConnectionStatus('connected');
        toast.success("Test successful", { 
          description: "Connection established with n8n" 
        });
      } else {
        setN8nConnectionStatus('error');
        setErrorMessage("Failed to connect to n8n webhook");
        toast.error("Test failed", { 
          description: "Unable to connect to n8n webhook" 
        });
      }
    } catch (error) {
      setN8nConnectionStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(`Connection error: ${error.message}`);
      } else {
        setErrorMessage("An error occurred during the test");
      }
      
      toast.error("Error", { 
        description: "An error occurred during the test"
      });
    } finally {
      setN8nTestLoading(false);
    }
  }, [n8nUrl]);

  return {
    n8nUrl,
    setN8nUrl,
    n8nTestLoading,
    n8nConnectionStatus,
    loading,
    errorMessage,
    fetchN8nConfig,
    testN8nConnection
  };
};
