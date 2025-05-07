
import React from 'react';
import OnboardingForm from '@/components/onboarding/OnboardingForm';

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full">
        <OnboardingForm />
      </div>
    </div>
  );
};

export default Onboarding;
