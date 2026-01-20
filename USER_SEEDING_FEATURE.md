# User Seeding Feature Documentation

## Overview
The User Seeding feature allows administrators to quickly add multiple users to the system from an Excel file. This eliminates the need for manual user creation and enables bulk operations.

## Backend Implementation

### Service: `UserSeederService` (`backend/services/user_seeder.py`)
The core service that handles Excel parsing and user creation:

- **`validate_excel_data(df)`**: Validates that the Excel file contains required columns
- **`parse_excel_file(file_bytes)`**: Reads and parses Excel file using pandas
- **`seed_users(file_bytes, db)`**: Main method that processes the file and creates users

#### Key Features:
- Validates required columns: `username`, `email`, `password`
- Optional columns: `role_id`, `is_active`
- Handles duplicate users (skips if username or email exists)
- Returns detailed results showing created and failed users
- Prevents errors from stopping the entire batch (individual user failures don't block others)

### API Endpoint: `POST /Eaten/auth/seed-users`
Located in [backend/routes/auth.py](../../backend/routes/auth.py)

#### Requirements:
- Requires authentication (Bearer token)
- Only accessible to Admin (role_id=1) or Superadmin (role_id=0)
- Accepts multipart/form-data with Excel file

#### Response Format:
```json
{
  "total_rows": 10,
  "created_users": 8,
  "failed_users": 2,
  "created_users_list": [
    {
      "id": "uuid",
      "username": "user1",
      "email": "user1@example.com",
      "role_id": 2,
      "is_active": true
    }
  ],
  "failed_users_list": [
    {
      "row": 5,
      "username": "user4",
      "error": "User with this username or email already exists"
    }
  ],
  "message": "Successfully created 8 user(s). 2 user(s) failed."
}
```

## Frontend Implementation

### Component: `UserSeederSection` (`frontend/src/app/components/admin/UserSeederSection.tsx`)
React component for the admin panel with the following features:

- **File Upload**: Drag-and-drop or click to select Excel file
- **Validation**: Checks file type (only .xlsx, .xls)
- **Template Download**: Users can download a sample template
- **Results Display**: Shows detailed results of created and failed users
- **Error Handling**: Clear error messages for file issues

### Admin Panel Integration
The component is integrated into the admin panel with:
- New "Seed Users" tab in the admin dashboard
- Placed between "Users" and "Feedbacks" tabs
- Only visible to authenticated admin users

## Excel File Format

### Required Columns:
| Column | Type | Description |
|--------|------|-------------|
| username | string | Unique username for the user |
| email | string | Unique email address |
| password | string | User's password (will be hashed) |

### Optional Columns:
| Column | Type | Default | Description |
|--------|------|---------|-------------|
| role_id | integer | 2 | 0=Superadmin, 1=Admin, 2=User |
| is_active | boolean | false | Whether user is active |

### Example Excel File:
```
username,email,password,role_id,is_active
john_doe,john@example.com,securepass123,2,true
jane_smith,jane@example.com,password456,1,true
bob_wilson,bob@example.com,mypassword789,2,false
alice_johnson,alice@example.com,alicepass,2,true
```

## Usage Instructions

### Step 1: Navigate to Admin Panel
1. Login as admin or superadmin
2. Click "Admin Panel" in the main navigation
3. Click the "Seed Users" tab

### Step 2: Prepare Excel File
1. Create an Excel file (.xlsx or .xls) with user data
2. Include columns: `username`, `email`, `password`
3. Optionally add: `role_id`, `is_active`
4. Or download the template from the panel

### Step 3: Upload File
1. Click "Select Excel File" or drag-and-drop
2. Choose your Excel file
3. Click "Upload & Seed Users"
4. Wait for processing

### Step 4: Review Results
- Green boxes show successfully created users
- Red boxes show failed users with reasons
- Check the summary for total count

## Validation Rules

### User Creation Validation:
1. **Username**: Required, must be unique
2. **Email**: Required, must be unique and valid format
3. **Password**: Required, minimum 3 characters (no length limit)
4. **Role ID**: Optional (defaults to 2), must be 0, 1, or 2
5. **Is Active**: Optional (defaults to false), accepts: true/false, 1/0, yes/no, active/inactive

### Duplicate Handling:
- If username already exists: User is skipped (added to failed list)
- If email already exists: User is skipped (added to failed list)
- Other users in the batch continue processing

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Missing required columns | Excel doesn't have username, email, or password | Add missing columns |
| Excel file is empty | No data rows in file | Add user data to spreadsheet |
| Username is required | Username cell is empty | Fill in username for all rows |
| Email is required | Email cell is empty | Fill in email for all rows |
| Password is required | Password cell is empty | Fill in password for all rows |
| User already exists | Username or email duplicate | Check for duplicates in system |
| Error reading Excel file | File is corrupted | Ensure file is valid Excel (.xlsx/.xls) |

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **Authentication Required**: Only authenticated admin users can access
3. **Authorization Check**: Only role_id 0 or 1 can perform seeding
4. **File Validation**: Only Excel files are accepted
5. **Error Isolation**: Individual user failures don't affect batch process

## Dependencies

### Backend:
- `openpyxl==3.11.0` - Excel file reading
- `pandas==2.1.4` - Data processing and validation
- `passlib` - Password hashing (already in requirements)

### Frontend:
- React (already included)
- TypeScript (already included)

## Installation

1. **Backend**: Install new dependencies
   ```bash
   pip install openpyxl pandas
   ```
   Or run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Frontend**: No additional installation needed (React components)

## Database Impact

- No schema changes required
- Uses existing `User` model
- Compatible with current database structure

## Performance Considerations

- Large Excel files (1000+ rows) may take time to process
- Each user is individually validated before insertion
- Database commits after each successful user creation
- Server memory depends on file size

## Future Enhancements

1. **CSV Support**: Add support for CSV files
2. **Bulk Operations**: Add bulk edit/delete functionality
3. **Email Notifications**: Send credentials to newly created users
4. **Import History**: Track all import operations
5. **Duplicate Resolution**: Options to handle duplicates (skip, overwrite, etc.)
6. **Batch Size Limits**: Limit file size to prevent memory issues
7. **Template Customization**: Allow custom field mapping

## Testing Checklist

- [ ] Upload valid Excel file with all required fields
- [ ] Upload Excel with optional fields
- [ ] Upload Excel with duplicate users (verify they're skipped)
- [ ] Upload Excel with missing required columns
- [ ] Upload empty Excel file
- [ ] Upload non-Excel file
- [ ] Verify password hashing works
- [ ] Verify role_id assignment
- [ ] Verify is_active status
- [ ] Check frontend displays results correctly
- [ ] Verify admin can access but non-admin cannot
- [ ] Test with large batch (500+ users)
