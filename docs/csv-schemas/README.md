# CSV File Schemas

This directory contains the schema definitions for all 8 CSV file types supported by the Amber-Studios Workspace system.

## File Types Overview

1. **Dealer Schedules** - Work schedules for dealers
2. **SM Schedules** - Work schedules for Sales Managers  
3. **Mistake Statistics** - Aggregated mistake data
4. **Daily Mistakes** - Individual mistake records

Each type has current and previous/adjacent period versions.

## Common Rules

- All CSV files must have headers in the first row
- Date formats: YYYY-MM-DD
- Time formats: HH:mm (24-hour)
- Text encoding: UTF-8
- Field separator: comma (,)
- Text qualifier: double quotes (") when needed

## Data Validation

- Required fields cannot be empty
- Dates must be valid and in correct format
- Login fields must match existing user accounts
- Country-specific data only (no cross-country imports)

## Column Mapping

During import, the system allows mapping CSV columns to expected fields:
- Automatic detection for standard column names
- Manual mapping for custom column names
- Preview before final import

## Error Handling

- Invalid rows are flagged but don't stop the import
- Detailed error reports show specific issues
- Partial imports are supported (valid rows only)

See individual schema files for detailed column specifications.