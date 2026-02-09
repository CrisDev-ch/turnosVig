export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'worker';
  created_at: string;
}
