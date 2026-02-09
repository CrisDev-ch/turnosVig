export interface Event {
  id?: string;
  type: 'shift' | 'overtime' | 'leave' | 'vacation';
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  created_at: string;
  updated_at?: string;
}

export const EVENT_TYPES = {
  shift: { label: 'Turno', color: '#2563eb' },
  overtime: { label: 'Hora Extra', color: '#eab308' },
  leave: { label: 'Permiso', color: '#ef4444' },
  vacation: { label: 'Vacaciones', color: '#10b981' }
};

export const SHIFT_SCHEDULES = [
  { label: '07:00 - 16:00', start: '07:00', end: '16:00' },
  { label: '07:00 - 15:00', start: '07:00', end: '15:00' },
  { label: '11:00 - 20:00', start: '11:00', end: '20:00' },
  { label: '12:00 - 20:00', start: '12:00', end: '20:00' },
  { label: '08:00 - 20:00', start: '08:00', end: '20:00' },
  { label: '20:00 - 08:00', start: '20:00', end: '08:00' },
  { label: '11:00 - 23:00', start: '11:00', end: '23:00' }
];
