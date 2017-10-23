export interface User {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string;
  photoURL: string;
  providerData: Array<{
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
  }>;
}
