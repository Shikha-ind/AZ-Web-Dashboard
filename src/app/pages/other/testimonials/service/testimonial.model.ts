export interface Testimonial {
  t_id: number;
  to: string;
  from: string;
  content: string;
  service_name: string;
  region_name: string;
  likes: number;
  isLiked?: boolean; // frontend helper flag
  created_at?: string;
  value: string; // e.g., "2024-07"
  label: string; // e.g., "July 2024"
  action: string;
  upload_path?: string; // optional
}

