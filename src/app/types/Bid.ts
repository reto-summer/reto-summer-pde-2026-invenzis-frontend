export interface Bid {
  id: string;
  type: string;
  number: string;
  institution: string;
  department?: string;
  description: string;
  deadline: string;
  timeToClose: number; // horas hasta el cierre
  aperturaElectronica?: boolean;
}
