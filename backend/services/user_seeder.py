from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime
from fastapi import HTTPException
from models.users import User
import uuid
import pandas as pd
from io import BytesIO
from typing import List, Dict, Any

hasher = CryptContext(schemes=["bcrypt"])

class UserSeederService:
    """Service to seed users from Excel files"""
    
    REQUIRED_COLUMNS = ['username', 'email', 'password']
    OPTIONAL_COLUMNS = ['role_id', 'is_active']
    
    @staticmethod
    def validate_excel_data(df: pd.DataFrame) -> tuple[bool, str]:
        """
        Validate the Excel DataFrame has required columns
        Returns: (is_valid, message)
        """
        df_columns = [col.lower().strip() for col in df.columns]
        
        missing_columns = [col for col in UserSeederService.REQUIRED_COLUMNS if col not in df_columns]
        
        if missing_columns:
            return False, f"Missing required columns: {', '.join(missing_columns)}"
        
        if df.empty:
            return False, "Excel file is empty"
        
        return True, "Validation successful"
    
    @staticmethod
    def parse_excel_file(file_bytes: bytes) -> tuple[bool, pd.DataFrame | str]:
        """
        Parse Excel file and return DataFrame
        Returns: (success, data_or_error_message)
        """
        try:
            excel_file = BytesIO(file_bytes)
            df = pd.read_excel(excel_file)
            
            # Normalize column names
            df.columns = [col.lower().strip() for col in df.columns]
            
            return True, df
        except Exception as e:
            return False, f"Error reading Excel file: {str(e)}"
    
    @staticmethod
    def seed_users(file_bytes: bytes, db: Session) -> Dict[str, Any]:
        """
        Main seeding function
        Returns: Dictionary with success status and results
        """
        # Parse Excel file
        success, result = UserSeederService.parse_excel_file(file_bytes)
        if not success:
            raise HTTPException(status_code=400, detail=result)
        
        df = result
        
        # Validate data
        is_valid, validation_message = UserSeederService.validate_excel_data(df)
        if not is_valid:
            raise HTTPException(status_code=400, detail=validation_message)
        
        # Fill NaN values
        df = df.fillna('')
        
        created_users = []
        failed_users = []
        
        for index, row in df.iterrows():
            try:
                username = str(row.get('username', '')).strip()
                email = str(row.get('email', '')).strip()
                password = str(row.get('password', '')).strip()
                role_id = row.get('role_id', 2)  # Default role is 2 (user)
                is_active = row.get('is_active', False)
                
                # Validate individual row
                if not username:
                    failed_users.append({
                        'row': index + 2,
                        'username': username,
                        'error': 'Username is required'
                    })
                    continue
                
                if not email:
                    failed_users.append({
                        'row': index + 2,
                        'username': username,
                        'error': 'Email is required'
                    })
                    continue
                
                if not password:
                    failed_users.append({
                        'row': index + 2,
                        'username': username,
                        'error': 'Password is required'
                    })
                    continue
                
                # Check if user already exists
                existing_user = db.query(User).filter(
                    (User.username == username) | (User.email == email)
                ).first()
                
                if existing_user:
                    failed_users.append({
                        'row': index + 2,
                        'username': username,
                        'error': 'User with this username or email already exists'
                    })
                    continue
                
                # Convert role_id to int
                try:
                    role_id = int(role_id)
                except (ValueError, TypeError):
                    role_id = 2  # Default to user role
                
                # Convert is_active to bool
                if isinstance(is_active, str):
                    is_active = is_active.lower() in ['true', '1', 'yes', 'active']
                else:
                    is_active = bool(is_active)
                
                # Create new user
                new_user = User(
                    id=uuid.uuid4(),
                    username=username,
                    email=email,
                    hashed_password=hasher.hash(password),
                    role_id=role_id,
                    is_active=is_active,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                
                created_users.append({
                    'id': str(new_user.id),
                    'username': new_user.username,
                    'email': new_user.email,
                    'role_id': new_user.role_id,
                    'is_active': new_user.is_active
                })
                
            except Exception as e:
                # Rollback this particular user creation if something goes wrong
                db.rollback()
                failed_users.append({
                    'row': index + 2,
                    'username': str(row.get('username', '')).strip(),
                    'error': f'Unexpected error: {str(e)}'
                })
        
        return {
            'total_rows': len(df),
            'created_users': len(created_users),
            'failed_users': len(failed_users),
            'created_users_list': created_users,
            'failed_users_list': failed_users,
            'message': f'Successfully created {len(created_users)} user(s). {len(failed_users)} user(s) failed.'
        }
