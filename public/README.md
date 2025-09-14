# CSV Data Files

This folder contains sample CSV data files for the Amber-Studios Workspace application. Each country has 4 CSV files that are automatically imported by the system.

## File Naming Convention

Each country's data files follow this naming pattern:
- `{country}_sm_schedule.csv` - SM (Sales Manager) work schedules
- `{country}_dealer_schedule.csv` - Dealer work schedules  
- `{country}_daily_mistakes.csv` - Daily mistake reports
- `{country}_mistake_statistics.csv` - Aggregated mistake statistics

## Countries Supported

- poland
- georgia
- colombia
- latvia
- lithuania

## File Structures

### SM Schedule (`*_sm_schedule.csv`)
```csv
sm_name,sm_login,date,shift,area,dealers,notes
```

### Dealer Schedule (`*_dealer_schedule.csv`)
```csv
dealer_name,dealer_login,date,shift,location,notes
```

### Daily Mistakes (`*_daily_mistakes.csv`)
```csv
date,dealer_name,dealer_login,mistake_description,category,severity,correction_action,status
```

### Mistake Statistics (`*_mistake_statistics.csv`)
```csv
period,dealer_name,dealer_login,mistake_type,count,severity,trend
```

## Power Automate Integration

Power Automate can push files to this repository's public folder, and the application will automatically import them via webhook endpoints.

## Visibility Rules

- **Dealers**: See their own rows from dealer_schedule, daily_mistakes, mistake_statistics
- **SMs**: See their own rows from sm_schedule, plus all dealer data they supervise
- **Operations**: See all data from all 4 file types (no filters)
- **Admins**: Full access to all data and can manage imports

## API Endpoints

The application exposes these REST endpoints for CSV operations:
- `GET /api/csv/{country}/{file_type}` - Retrieve data
- `POST /api/webhook/csv-import` - Import from GitHub
- `POST /api/csv/upload` - Manual upload
- `GET /api/csv/history` - Import history