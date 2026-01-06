export interface WeddingEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
}

export interface Couple {
  bride: {
    name: string;
    surname: string;
  };
  groom: {
    name: string;
    surname: string;
  };
}
