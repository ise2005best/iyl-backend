export interface TaxCalculation {
  amount: number;
  rate: number;
  currency: string;
  breakdown?: TaxBreakdownItem[];
}

export interface TaxBreakdownItem {
  name: string;
  rate: number;
  amount: number;
  description?: string;
}
