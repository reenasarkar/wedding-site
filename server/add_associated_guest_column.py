#!/usr/bin/env python3
"""
Migration script to add associated_guest column to invited_guests table.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db

def add_associated_guest_column():
    """Add associated_guest column to invited_guests table"""
    with app.app_context():
        try:
            # Add the new column
            db.engine.execute("ALTER TABLE invited_guests ADD COLUMN associated_guest VARCHAR(100)")
            print("Successfully added associated_guest column to invited_guests table")
            
            # Verify the column was added
            result = db.engine.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'invited_guests' AND column_name = 'associated_guest'")
            if result.fetchone():
                print("Column verification successful")
            else:
                print("Warning: Column may not have been added properly")
                
        except Exception as e:
            print(f"Error adding column: {e}")
            # Check if column already exists
            try:
                result = db.engine.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'invited_guests' AND column_name = 'associated_guest'")
                if result.fetchone():
                    print("Column already exists, skipping...")
                else:
                    print("Column does not exist and could not be added")
            except Exception as e2:
                print(f"Error checking column existence: {e2}")

if __name__ == "__main__":
    add_associated_guest_column() 