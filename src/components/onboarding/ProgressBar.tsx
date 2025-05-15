
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
          <div
            key={step}
            className={`flex items-center justify-center w-8 h-8 rounded-full border ${
              step === currentStep
                ? "bg-primary text-primary-foreground border-primary"
                : step < currentStep
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-muted border-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
