
import { StorageService } from '../storage';

/**
 * Service for admin authentication functionality
 */
export class AdminAuthService {
  private static ADMIN_AUTH_KEY = 'adminAuth';
  
  /**
   * Checks if admin is authenticated
   * @returns Boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    return StorageService.getItem<boolean>(this.ADMIN_AUTH_KEY, false);
  }
  
  /**
   * Authenticates admin with password
   * @param password Admin password
   * @returns Promise resolving to authentication success status
   */
  static authenticate(password: string): Promise<boolean> {
    // For demo purposes, we're using a direct comparison
    // In production, this should be a secure API call to validate credentials
    const isValid = password === "admin123"; // This should be replaced with a secure auth system
    
    if (isValid) {
      StorageService.setItem(this.ADMIN_AUTH_KEY, true);
    }
    
    return Promise.resolve(isValid);
  }
  
  /**
   * Logs out the admin user
   */
  static logout(): void {
    StorageService.removeItem(this.ADMIN_AUTH_KEY);
  }
}
