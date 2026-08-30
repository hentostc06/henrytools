export type Category = 
  | 'all' 
  | 'organize' 
  | 'optimize' 
  | 'convert' 
  | 'edit' 
  | 'security' 
  | 'intelligence';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: Category;
  subCategory?: 'to_pdf' | 'from_pdf';
  route: string;
  badge?: string;
  iconBg: string;
  iconSvg: string;
}
