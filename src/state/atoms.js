import { atom } from 'jotai';

// Auth/user
export const userAtom = atom(null);

// Onboarding/login state
export const isLoginAtom = atom(true);
export const onboardingStepAtom = atom(1);
export const loginStepAtom = atom(1);
export const formDataAtom = atom({
  name: '',
  username: '',
  phoneNumber: '',
  campusId: 'uiuc123',
});
export const otpCodeAtom = atom('');
export const otpSentAtom = atom(false);


