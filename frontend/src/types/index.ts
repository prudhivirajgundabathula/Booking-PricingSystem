export type Room = {
  _id: string;
  name: string;
  baseHourlyRate: number;
  capacity: number;
};

export type Booking = {
  _id?: string;
  roomId: string;
  userName: string;
  startTime: string;
  endTime: string;
  totalPrice?: number;
  status?: "CONFIRMED" | "CANCELLED";
};
