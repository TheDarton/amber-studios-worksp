# Dealer Schedule Schema

## File Types
- `dealer_schedule_current.csv` - Current period dealer schedules
- `dealer_schedule_adjacent.csv` - Previous or next period dealer schedules

## Required Columns

| Column Name | Type | Required | Description | Example |
|-------------|------|----------|-------------|---------|
| dealerLogin | string | Yes | Unique dealer login identifier | "john.doe" |
| dealerName | string | Yes | Full dealer name | "John Doe" |
| date | date | Yes | Schedule date (YYYY-MM-DD) | "2024-01-15" |
| shift | string | Yes | Shift type | "morning", "afternoon", "evening" |
| location | string | Yes | Work location | "Warsaw Office" |
| notes | string | No | Additional notes or comments | "Training day" |

## Data Rules

### dealerLogin
- Must match existing dealer user account
- Case-sensitive matching
- Used to filter data for dealer role users

### dealerName  
- Should match the dealer's registered name
- Used for display and validation
- Format: "FirstName LastName"

### date
- Valid date in YYYY-MM-DD format
- Cannot be empty
- Used for filtering and sorting schedules

### shift
- Predefined values: "morning", "afternoon", "evening"
- Case-insensitive during import
- Determines shift color coding in UI

### location
- Free text field for work location
- Used for logistics and planning
- Can include office names, branches, or specific addresses

### notes
- Optional field for additional information
- Limited to 500 characters
- Supports special instructions or comments

## Validation Rules

1. Each dealer can have only one shift per date
2. Location must be specified for each shift
3. Future dates are allowed for planning
4. Historical data should not be older than 2 years

## Import Behavior

- Duplicate entries (same dealer + date) will be updated
- Invalid rows are skipped with detailed error messages
- Partial imports are allowed when some rows are valid
- System logs all import activities for audit trail

## Access Permissions

- **Dealer Users**: Can only see their own schedule entries
- **SM Users**: Can see schedules for their assigned dealers
- **Operation Users**: Can see all schedules (read-only)
- **Admin Users**: Full CRUD access to all schedules

## Example Data

See `dealer_schedule_current.csv` for sample data format.