export type Booking = {
    id: number;
    userId: number;          
    date: string;            
    time: string;        
    guests: number;
    note?: string | null;
    createdAt: string | null;
 
  };
  