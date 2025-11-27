import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CoachFormData } from '@/types/coach';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import AvailabilityStep from './steps/availability-step';
import DocumentsStep from './steps/DocumentsStep';
import { useCoaches } from '@/context/CoachContext';
import { useRouter } from 'next/navigation';

const STEPS = [
  { title: 'Personal Information', description: 'Basic details about the coach' },
  { title: 'Availability', description: 'Set available times and skills' },
  { title: 'Documents', description: 'Upload CV and finalize' },
];

const initialFormData: CoachFormData = {
  name: '',
  dateOfBirth: '',
  photo: null,
  contactNo: '',
  email: '',
  homeAddress: '',
  school: '',
  availability: [],
  employmentType: 'full-time',
  cvFile: null,
  cvFileName: null,
  skills: [],
};

const CoachFormWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CoachFormData>(initialFormData);
  const { addCoach } = useCoaches();
  const router = useRouter();

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateFormData = (data: Partial<CoachFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!formData.name || !formData.email || !formData.contactNo) {
          console.log('Missing Information');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          console.log('Invalid Email');
          return false;
        }
        return true;

      case 1:
        if (formData.availability.length === 0) {
          console.log('No Availability Added');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    addCoach(formData);

    console.log('Coach Added Successfully');
    console.log(`${formData.name} has been added to the system.`);

    router.push('/coaches');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <AvailabilityStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <DocumentsStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Coach</CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

          <CardContent>
            {/* Step Indicators */}
            <div className="mb-8 flex justify-between">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex flex-1 flex-col items-center ${
                    index !== STEPS.length - 1 ? 'relative' : ''
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      index < currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : index === currentStep
                        ? 'border-primary bg-background text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden text-center text-xs sm:block ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button onClick={handleSubmit}>
                  <Check className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              ) : (
                <Button onClick={() => validateStep() && handleNext()}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachFormWizard;
