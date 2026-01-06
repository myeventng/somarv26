export interface RSVPFormData {
  name: string;
  email: string;
  attending: boolean;
  guestCount: number;
  message?: string;
}

export interface RSVP extends RSVPFormData {
  id: string;
  createdAt: Date;
}
