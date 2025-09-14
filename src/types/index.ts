export interface User {
  id: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  country: Country;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'sm' | 'dealer' | 'operation';

export type Country = 'poland' | 'georgia' | 'colombia' | 'latvia' | 'lithuania';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  country: Country | null;
}

export interface DealerSchedule {
  id: string;
  dealerName: string;
  dealerLogin: string;
  date: string;
  shift: string;
  location: string;
  notes?: string;
}

export interface SMSchedule {
  id: string;
  smName: string;
  smLogin: string;
  date: string;
  shift: string;
  area: string;
  dealers: string[];
  notes?: string;
}

export interface MistakeStatistic {
  id: string;
  period: string;
  dealerName: string;
  dealerLogin: string;
  mistakeType: string;
  count: number;
  severity: 'low' | 'medium' | 'high';
  trend: 'improving' | 'stable' | 'worsening';
}

export interface DailyMistake {
  id: string;
  date: string;
  dealerName: string;
  dealerLogin: string;
  mistakeDescription: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  correctionAction: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  contentType: 'video' | 'document' | 'article' | 'quiz';
  content: string;
  videoUrl?: string;
  duration?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  targetAudience: 'dealer' | 'sm' | 'both';
}

export interface NewsUpdate {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetRoles: UserRole[];
  publishedAt: Date;
  expiresAt?: Date;
  createdBy: string;
  isPublished: boolean;
}

export interface HandoverRecord {
  id: string;
  fromUser: string;
  toUser: string;
  date: Date;
  shift: string;
  items: HandoverItem[];
  status: 'pending' | 'acknowledged' | 'completed';
  notes?: string;
}

export interface HandoverItem {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  notes?: string;
}

export interface CSVImportJob {
  id: string;
  fileName: string;
  fileType: CSVFileType;
  country: Country;
  status: 'uploading' | 'mapping' | 'validating' | 'previewing' | 'importing' | 'completed' | 'failed';
  rowCount: number;
  validRows: number;
  errors: CSVError[];
  columnMapping: Record<string, string>;
  uploadedBy: string;
  uploadedAt: Date;
  completedAt?: Date;
}

export type CSVFileType = 
  | 'sm_schedule'
  | 'dealer_schedule'
  | 'daily_mistakes'
  | 'mistake_statistics';

export interface CSVError {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: Date;
  country: Country;
}