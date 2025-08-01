#!/usr/bin/env python3
"""
Migration script to add plus_one_name and plus_one_email columns to rsvps table.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db

def add_plus_one_columns():
    """Add plus_one_name and plus_one_email columns to rsvps table"""
    with app.app_context():
        try:
            # Add the new columns
            with db.engine.connect() as connection:
                connection.execute(db.text("ALTER TABLE rsvps ADD COLUMN plus_one_name VARCHAR(100)"))
                connection.execute(db.text("ALTER TABLE rsvps ADD COLUMN plus_one_email VARCHAR(120)"))
                connection.commit()
            print("Successfully added plus_one_name and plus_one_email columns to rsvps table")
            
            # Verify the columns were added
            with db.engine.connect() as connection:
                result = connection.execute(db.text("SELECT column_name FROM information_schema.columns WHERE table_name = 'rsvps' AND column_name IN ('plus_one_name', 'plus_one_email')"))
                columns = [row[0] for row in result.fetchall()]
                if len(columns) == 2:
                    print("Column verification successful")
                else:
                    print(f"Warning: Only {len(columns)} columns were added: {columns}")
                
        except Exception as e:
            print(f"Error adding columns: {e}")
            # Check if columns already exist
            try:
                with db.engine.connect() as connection:
                    result = connection.execute(db.text("SELECT column_name FROM information_schema.columns WHERE table_name = 'rsvps' AND column_name IN ('plus_one_name', 'plus_one_email')"))
                    columns = [row[0] for row in result.fetchall()]
                    if len(columns) == 2:
                        print("Columns already exist, skipping...")
                    else:
                        print(f"Columns partially exist: {columns}")
            except Exception as e2:
                print(f"Error checking column existence: {e2}")

if __name__ == "__main__":
    add_plus_one_columns() 