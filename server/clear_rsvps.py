#!/usr/bin/env python3
"""
Script to clear all existing RSVP data from the database.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import RSVP

def clear_rsvps():
    """Clear all RSVP data from the database"""
    with app.app_context():
        try:
            # Count existing RSVPs
            count = RSVP.query.count()
            print(f"Found {count} existing RSVPs")
            
            if count > 0:
                # Delete all RSVPs
                RSVP.query.delete()
                db.session.commit()
                print(f"Successfully deleted {count} RSVPs")
            else:
                print("No RSVPs found to delete")
            
            # Verify deletion
            remaining = RSVP.query.count()
            print(f"Remaining RSVPs in database: {remaining}")
            
        except Exception as e:
            print(f"Error clearing RSVPs: {e}")
            db.session.rollback()

if __name__ == "__main__":
    clear_rsvps() 