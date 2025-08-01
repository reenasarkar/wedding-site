#!/usr/bin/env python3
"""
Script to update existing guests with their associated guest information.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import InvitedGuest

# Guest associations to update
GUEST_ASSOCIATIONS = {
    "Amanda Chen": "Cody Wall",
    "Cody Wall": "Amanda Chen",
    "Chinyu Sarkar": "Soumyo Sarkar",
    "Soumyo Sarkar": "Chinyu Sarkar",
    "Ritu Vohra": "Rohit Vohra",
    "Rohit Vohra": "Ritu Vohra"
}

def update_associated_guests():
    """Update existing guests with their associated guest information"""
    with app.app_context():
        print("Updating guest associations...")
        
        for guest_name, associated_guest in GUEST_ASSOCIATIONS.items():
            # Find the guest
            guest = InvitedGuest.query.filter(
                db.func.lower(InvitedGuest.name) == db.func.lower(guest_name)
            ).first()
            
            if guest:
                # Update the associated guest
                guest.associated_guest = associated_guest
                print(f"Updated {guest_name} -> associated with {associated_guest}")
            else:
                print(f"Guest {guest_name} not found, skipping...")
        
        # Commit all changes
        db.session.commit()
        
        # Print summary
        print(f"\nUpdated {len(GUEST_ASSOCIATIONS)} guest associations")
        
        # List all guests with their associations
        print("\nAll guests with associations:")
        for guest in InvitedGuest.query.order_by(InvitedGuest.name).all():
            print(f"- {guest.name} (associated: {guest.associated_guest or 'none'})")

if __name__ == "__main__":
    update_associated_guests() 