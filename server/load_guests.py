#!/usr/bin/env python3
"""
Script to pre-load invited guests into the database.
Run this script to add your guest list before deploying.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import InvitedGuest

# Sample guest list - replace with your actual guests
GUEST_LIST = [
    {"name": "Amanda Chen", "email": "amandac188@gmail.com", "plus_one_allowed": False},
    {"name": "Cody Wall", "email": "", "plus_one_allowed": False},
    {"name": "Chinyu Sarkar", "email": "", "plus_one_allowed": False},
    {"name": "Soumyo Sarkar", "email": "", "plus_one_allowed": False},
    {"name": "Sumit Sarkar", "email": "ssarkar45678@gmail.com", "plus_one_allowed": False},
    {"name": "Rhea Vohra", "email": "", "plus_one_allowed": False},
    {"name": "Ritu Vohra", "email": "", "plus_one_allowed": False},
    {"name": "Rohit Vohra", "email": "", "plus_one_allowed": False},
    {"name": "Teja Yeramosu", "email": "", "plus_one_allowed": True, "plus_one_name": ""},
    # Add more guests here...
]

def load_guests():
    """Load the guest list into the database"""
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        print("Loading guests into database...")
        
        for guest_data in GUEST_LIST:
            # Check if guest already exists
            existing = InvitedGuest.query.filter(
                db.func.lower(InvitedGuest.name) == db.func.lower(guest_data['name'])
            ).first()
            
            if existing:
                print(f"Guest {guest_data['name']} already exists, skipping...")
                continue
            
            # Create new guest
            guest = InvitedGuest(**guest_data)
            db.session.add(guest)
            print(f"Added guest: {guest_data['name']}")
        
        # Commit all changes
        db.session.commit()
        
        # Print summary
        total_guests = InvitedGuest.query.count()
        print(f"\nTotal guests in database: {total_guests}")
        
        # List all guests
        print("\nAll guests:")
        for guest in InvitedGuest.query.order_by(InvitedGuest.name).all():
            print(f"- {guest.name}")

if __name__ == "__main__":
    load_guests() 