import { UserRole } from '@/types';

export const COUNTRIES: { value: string; label: string }[] = [
  { value: 'poland', label: 'Poland' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'latvia', label: 'Latvia' },
  { value: 'lithuania', label: 'Lithuania' },
];

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
];

export const CSV_FILE_TYPES = [
  { value: 'dealer_schedule_current', label: 'Dealer Schedule (Current)' },
  { value: 'dealer_schedule_adjacent', label: 'Dealer Schedule (Adjacent)' },
  { value: 'sm_schedule_current', label: 'SM Schedule (Current)' },
  { value: 'sm_schedule_adjacent', label: 'SM Schedule (Adjacent)' },
  { value: 'mistake_statistics_current', label: 'Mistake Statistics (Current)' },
  { value: 'mistake_statistics_previous', label: 'Mistake Statistics (Previous)' },
  { value: 'daily_mistakes_current', label: 'Daily Mistakes (Current)' },
  { value: 'daily_mistakes_previous', label: 'Daily Mistakes (Previous)' },
];

export const ROLE_PERMISSIONS = {
  admin: {
    csvAccess: 'all' as const,
    trainingAccess: ['dealer', 'sm'],
    canSeeAllRows: true,
    hasNewsAccess: true,
    canManageUsers: true,
    canImportCSV: true,
  },
} as const;