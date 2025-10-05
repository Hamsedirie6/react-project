export type Booking = {
    id: number;
    userId: number;          
    date: string;            
    time: string;        
    guests: number;
    note?: string | null;
    createdAt: string | null;
 
  };
  export type Product = {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    image?: string | null;   // <- matchar DB-kolumnen "image"
    createdAt?: string | null;
  };