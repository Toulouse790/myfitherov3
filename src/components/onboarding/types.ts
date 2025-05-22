
export interface UserData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  gender: string;
  pseudo: string;
  // Step 2: Measurements and Level
  height: string;
  weight: string;
  experienceLevel: string;
  frequency: string;
  // Step 3: Goals
  mainGoal: string;
  sports: string[];
  // Step 4: Preferences and Constraints
  availableDays: string[];
  equipment: {
    home: boolean;
    gym: boolean;
  };
  dietaryRestrictions: string[];
  notifications: boolean;
}

export interface OnboardingFormProps {
  initialStep?: number;
}
