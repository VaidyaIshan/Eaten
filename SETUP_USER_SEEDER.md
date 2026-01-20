# User Seeder Feature - Quick Setup Guide

## What Was Added

A complete user seeding system that allows admins to import multiple users from Excel files in bulk.

## Files Created/Modified

### Backend Files

1. **[backend/services/user_seeder.py](../backend/services/user_seeder.py)** (NEW)
   - Core service for Excel parsing and user creation
   - Validates user data and handles duplicates
   - Returns detailed success/failure reports

2. **[backend/schemas/user_seeder_schemas.py](../backend/schemas/user_seeder_schemas.py)** (NEW)
   - Pydantic schemas for API responses
   - Defines response structure with user list and errors

3. **[backend/routes/auth.py](../backend/routes/auth.py)** (MODIFIED)
   - Added new endpoint: `POST /Eaten/auth/seed-users`
   - Added necessary imports (File, UploadFile, HTTPException)
   - Includes authorization check (admin only)

4. **[backend/requirements.txt](../backend/requirements.txt)** (MODIFIED)
   - Added `openpyxl==3.11.0` for Excel file reading
   - Added `pandas==2.1.4` for data processing

### Frontend Files

1. **[frontend/src/app/components/admin/UserSeederSection.tsx](../frontend/src/app/components/admin/UserSeederSection.tsx)** (NEW)
   - Admin UI component for file upload
   - File validation and error handling
   - Results display with created/failed user lists
   - Template download functionality

2. **[frontend/src/app/admin/page.tsx](../frontend/src/app/admin/page.tsx)** (MODIFIED)
   - Added "Seed Users" tab to admin panel
   - Updated TabType to include "user-seeder"
   - Integrated UserSeederSection component

### Documentation Files

1. **[USER_SEEDING_FEATURE.md](../USER_SEEDING_FEATURE.md)** (NEW)
   - Comprehensive documentation of the feature
   - API specifications and response formats
   - Usage instructions and validation rules
   - Testing checklist

2. **[dev_info/generate_template.py](../dev_info/generate_template.py)** (NEW)
   - Script to generate Excel template for users
   - Includes instructions and example data

## Installation Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

Or install directly:
```bash
pip install openpyxl==3.11.0 pandas==2.1.4
```

### Step 2: Restart Backend Server
```bash
cd backend
python main.py
# or
uvicorn main:app --reload
```

### Step 3: Generate Excel Template (Optional)
```bash
cd dev_info
python generate_template.py
```
This creates a formatted Excel template file for users to fill in.

### Step 4: Verify Frontend Components
Frontend components are automatically included when you start the development server. No build step needed for Next.js.

## How to Use

### Via Admin Panel
1. Login as Admin or Superadmin
2. Go to Admin Panel
3. Click "Seed Users" tab
4. Upload Excel file with user data
5. Review results

### Excel File Format

**Required Columns:**
- `username` - Unique username
- `email` - Unique email address
- `password` - User password (will be hashed)

**Optional Columns:**
- `role_id` - 0 (Superadmin), 1 (Admin), 2 (User, default)
- `is_active` - true/false (defaults to false)

**Example:**
```
username,email,password,role_id,is_active
john_doe,john@example.com,secure123,2,true
admin_user,admin@example.com,admin456,1,true
```

## API Endpoint

**POST** `/Eaten/auth/seed-users`

**Authentication:** Required (Bearer token)

**Authorization:** Admin (role_id=1) or Superadmin (role_id=0) only

**Parameters:**
- `file` (multipart/form-data) - Excel file (.xlsx or .xls)

**Response:**
```json
{
  "total_rows": 10,
  "created_users": 8,
  "failed_users": 2,
  "created_users_list": [...],
  "failed_users_list": [...],
  "message": "Successfully created 8 user(s). 2 user(s) failed."
}
```

## Key Features

✓ **Bulk User Creation** - Add multiple users at once from Excel  
✓ **Validation** - Checks for duplicates, missing fields, data types  
✓ **Error Handling** - Individual failures don't block batch processing  
✓ **Detailed Reports** - Shows exactly which users were created/failed  
✓ **Password Security** - All passwords are bcrypt hashed  
✓ **Role Assignment** - Support for different user roles  
✓ **User Status** - Control if users are active or inactive  
✓ **Template Download** - Users can download a ready-to-use template  
✓ **Authorization** - Admin-only access with proper checks  
✓ **Responsive UI** - Works on desktop and mobile

## Troubleshooting

### "Missing required columns" Error
- Ensure Excel has columns: `username`, `email`, `password`
- Column names must be lowercase

### "User already exists" Error
- Check for duplicate usernames or emails in the system
- Use unique values for each row

### "Only admins can seed users" Error
- Login as admin (role_id=1) or superadmin (role_id=0)
- Non-admin users cannot access this feature

### Excel file not uploading
- Ensure file is .xlsx or .xls format
- File should not be empty
- Try opening and re-saving the file

### Backend packages not installing
```bash
pip install --upgrade pip
pip install openpyxl pandas
```

## Rollback Instructions

If needed, you can rollback changes:

1. Remove the endpoint from `backend/routes/auth.py` (lines with seed-users)
2. Delete `backend/services/user_seeder.py`
3. Delete `backend/schemas/user_seeder_schemas.py`
4. Remove the UserSeederSection tab from admin panel
5. Remove new dependencies from requirements.txt

## Performance Notes

- Small files (< 1000 rows): Processes in seconds
- Medium files (1000-5000 rows): Takes 5-30 seconds
- Large files (> 5000 rows): May take 1+ minute
- Each user is validated and inserted individually
- Database transactions are committed after each user

## Security Considerations

✓ Authentication required  
✓ Authorization checks (admin only)  
✓ Password hashing with bcrypt  
✓ File type validation  
✓ SQL injection prevention (SQLAlchemy ORM)  
✓ Individual user validation  
✓ Duplicate username/email prevention  

## Next Steps

1. Test with sample Excel files
2. Monitor logs for any errors
3. Create templates for different user types
4. Consider adding bulk export functionality
5. Add email notifications for newly created users

## Support

For detailed documentation, see [USER_SEEDING_FEATURE.md](../USER_SEEDING_FEATURE.md)

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Verify Excel file format
4. Check user authentication and authorization
