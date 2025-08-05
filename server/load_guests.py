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

GUEST_LIST = [
    {"name": "Reena Sarkar", "email": "reena.sarkar15@gmail.com", "plus_one_allowed": False, "associated_guest": "Varun Vohra"},
    {"name": "Varun Vohra", "email": "vrnvhr22@gmail.com", "plus_one_allowed": False, "associated_guest": "Ur butt hole"},
    {"name": "Amanda Chen", "email": "amandac188@gmail.com", "plus_one_allowed": False, "associated_guest": "Cody Wall"},
    {"name": "Cody Wall", "email": "", "plus_one_allowed": False, "associated_guest": "Amanda Chen"},
    {"name": "Chinyu Sarkar", "email": "", "plus_one_allowed": False, "associated_guest": "Soumyo Sarkar"},
    {"name": "Soumyo Sarkar", "email": "", "plus_one_allowed": False, "associated_guest": "Chinyu Sarkar"},
    {"name": "Sumit Sarkar", "email": "ssarkar45678@gmail.com", "plus_one_allowed": False, "associated_guest": ""},
    {"name": "Rhea Vohra", "email": "", "plus_one_allowed": False, "associated_guest": ""},
    {"name": "Ritu Vohra", "email": "", "plus_one_allowed": False, "associated_guest": "Rohit Vohra"},
    {"name": "Rohit Vohra", "email": "", "plus_one_allowed": False, "associated_guest": "Ritu Vohra"},
    {"name": "Teja Yeramosu", "email": "", "plus_one_allowed": True, "plus_one_name": "", "associated_guest": ""},
    {"name": "Christina Ambrosino", "email": "", "plus_one_allowed": False, "associated_guest": ""},
    {"name": "Eva Drake", "email": "", "plus_one_allowed": False, "associated_guest": "Jeff Drake"},
    {"name": "Jeff Drake", "email": "", "plus_one_allowed": False, "associated_guest": "Eva Drake"},
    {"name": "John Drake", "email": "", "plus_one_allowed": False, "associated_guest": "Eva Drake"},
    {"name": "Mo Krishnan", "email": "", "plus_one_allowed": False, "associated_guest": "Shoba Krishnan"},
    {"name": "Ujj Nath", "email": "", "plus_one_allowed": False, "associated_guest": "Mamta Nath"},
    {"name": "Mamta Nath", "email": "", "plus_one_allowed": False, "associated_guest": "Ujj Nath"},
    {"name": "Candy Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Nai Nai Huang"},
    {"name": "Litang Yen", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Nai Nai Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Candy Huang"},
    {"name": "Renee Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Vivian & Jimbo Huang"},
    {"name": "Jimbo Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Renee & Vivian Huang"},
    {"name": "Vivian Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Renee & Jimbo Huang"},
    {"name": "Ken Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Karen Huang"},
    {"name": "Karen Huang", "email": "", "plus_one_allowed": False, "associated_guest": "Ken Huang"},
    {"name": "Swati Bose", "email": "", "plus_one_allowed": False, "associated_guest": "Anjan Bose"},
    {"name": "Anjan Bose", "email": "", "plus_one_allowed": False, "associated_guest": "Swati Bose"},
    {"name": "Anjali Bose", "email": "", "plus_one_allowed": False, "associated_guest": "Rahul Bose"},
    {"name": "Rahul Bose", "email": "", "plus_one_allowed": False, "associated_guest": "Anjali Bose"},
    {"name": "Ishani Guha", "email": "", "plus_one_allowed": False, "associated_guest": "Tukun Guha"},
    {"name": "Tukun Guha", "email": "", "plus_one_allowed": False, "associated_guest": "Ishani Guha"},
    {"name": "Melanie Santos", "email": "", "plus_one_allowed": False, "associated_guest": "Rahul Bose"},
    {"name": "Cozy Sarkar", "email": "", "plus_one_allowed": False, "associated_guest": "Shawn"},
    {"name": "Shawn Sarkar", "email": "", "plus_one_allowed": False, "associated_guest": "Cozy"},
    {"name": "Riddhi Khara", "email": "", "plus_one_allowed": False, "associated_guest": "Kunal Khandakar"},
    {"name": "Kunal Khandakar", "email": "", "plus_one_allowed": False, "associated_guest": "Riddhi Khara"},
    {"name": "Siddhi Khara Shah", "email": "", "plus_one_allowed": False, "associated_guest": "Ashish Shah"},
    {"name": "Ashish Shah", "email": "", "plus_one_allowed": False, "associated_guest": "Siddhi Khara Shah"},
    {"name": "Niddhi Khara", "email": "", "plus_one_allowed": False, "associated_guest": "Cory Smith"},
    {"name": "Cory Smith", "email": "", "plus_one_allowed": False, "associated_guest": "Niddhi Khara"},
    {"name": "Priti Khara", "email": "", "plus_one_allowed": False, "associated_guest": "Sage Khara"},
    {"name": "Sage Khara", "email": "", "plus_one_allowed": False, "associated_guest": "Priti Khara"},
    {"name": "Anand Pandi", "email": "", "plus_one_allowed": False, "associated_guest": "Roopa Pandit"},
    {"name": "Roopa Pandit", "email": "", "plus_one_allowed": False, "associated_guest": "Anand Pandit"},
    {"name": "Renata Hoca", "email": "", "plus_one_allowed": False, "associated_guest": "Rich Ambrosino"},
    {"name": "Rich Ambrosino", "email": "", "plus_one_allowed": False, "associated_guest": "Renata Hoca"},
    {"name": "Ruth Duke", "email": "", "plus_one_allowed": False, "associated_guest": "Kevin Duke"},
    {"name": "Kevin Duke", "email": "", "plus_one_allowed": False, "associated_guest": "Ruth Duke"},
    {"name": "Joan Costa", "email": "", "plus_one_allowed": False, "associated_guest": "Rita Stugiene"},
    {"name": "Rita Stugiene", "email": "", "plus_one_allowed": False, "associated_guest": "Joan Costa"},
    {"name": "Ashton Duke", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Aish Pandit-Chaudry", "email": "", "plus_one_allowed": False, "associated_guest": "Sahil Chaudry"},
    {"name": "Rue Pandit", "email": "", "plus_one_allowed": False, "associated_guest": "Aish Pandit"},
    {"name": "Abigail Zuckerman", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Lauren Wang", "email": "", "plus_one_allowed": False, "associated_guest": "Nick Purple Drankk"},
    {"name": "Nick Allen", "email": "", "plus_one_allowed": False, "associated_guest": "imlwang"},
    {"name": "Vishnu Joshi", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Charlie Gulian", "email": "", "plus_one_allowed": False, "associated_guest": "Julia Vamos ala Playa"},
    {"name": "Julia Laplaza", "email": "", "plus_one_allowed": False, "associated_guest": "Charlini Goolian"},
    {"name": "Adrian Jimenez", "email": "", "plus_one_allowed": False, "associated_guest": "Skim"},
    {"name": "Soyun Kim", "email": "", "plus_one_allowed": False, "associated_guest": "Dr. Sr. Jimenez"},
    {"name": "Mich Fredricks", "email": "", "plus_one_allowed": False, "associated_guest": "Molly"},
    {"name": "Molly Radwell", "email": "", "plus_one_allowed": False, "associated_guest": "Michiruuuuuu"},
    {"name": "Noh Mehbratu", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Danielle Obando", "email": "", "plus_one_allowed": False, "associated_guest": "Soumy/Sumi/Soumaila aka soumyplease"},
    {"name": "Soumaila Haidara", "email": "", "plus_one_allowed": False, "associated_guest": "Dani O"},
    {"name": "Monica Kung", "email": "", "plus_one_allowed": False, "associated_guest": "Karan Kumar"},
    {"name": "Karan Kumar", "email": "", "plus_one_allowed": False, "associated_guest": "Monica Kung"},
    {"name": "Nikki Lopez", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Adriana Donis", "email": "", "plus_one_allowed": False, "associated_guest": "Luli & Sofya"},
    {"name": "Sofya Freyman", "email": "", "plus_one_allowed": False, "associated_guest": "Luli & Adri"},
    {"name": "Lucia Sablich", "email": "", "plus_one_allowed": False, "associated_guest": "Adri & Sofya"},
    {"name": "Sanat Deshpande", "email": "", "plus_one_allowed": True, "associated_guest": ""},
    {"name": "Roman Darker", "email": "", "plus_one_allowed": False, "associated_guest": "Charlie"},
    {"name": "Charlie Loggins", "email": "", "plus_one_allowed": False, "associated_guest": "Roman Darker"},
    {"name": "Vijaya Dasari", "email": "", "plus_one_allowed": False, "associated_guest": "Amit Nag"},
    {"name": "Amit Nag", "email": "", "plus_one_allowed": False, "associated_guest": "j4kix"},
    {"name": "Jaimin Patel", "email": "", "plus_one_allowed": False, "associated_guest": "Kajal, our new golf queen"},
    {"name": "Kajal Parikh", "email": "", "plus_one_allowed": False, "associated_guest": "Jaimin (pronounced w a hai- in the beginning"},
    {"name": "Nicolas Scharmer", "email": "", "plus_one_allowed": False, "associated_guest": "Christina-Renata-Hoca-Brosino"},
    {"name": "Nanu", "email": "", "plus_one_allowed": False, "associated_guest": "Ritu"},
    {"name": "Rinku Mamu", "email": "", "plus_one_allowed": False, "associated_guest": "Palak Mami"},
    {"name": "Palak Mami", "email": "", "plus_one_allowed": False, "associated_guest": "Rinku Mamu"},
    {"name": "Adit Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Aarav Gupta"},
    {"name": "Aarav Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Adit Gupta"},
    {"name": "Reena Manchanda", "email": "", "plus_one_allowed": False, "associated_guest": "Deepak Manchanda"},
    {"name": "Rushali Manchanda", "email": "", "plus_one_allowed": False, "associated_guest": "Shane Mainland"},
    {"name": "Shane Mainland", "email": "", "plus_one_allowed": False, "associated_guest": "Rushali Manchanda"},
    {"name": "Sumit Chachu", "email": "", "plus_one_allowed": False, "associated_guest": "Geeta Chachi"},
    {"name": "Geeta Chachi", "email": "", "plus_one_allowed": False, "associated_guest": "Sumit Chachu"},
    {"name": "Rajesh Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Seema Gupta"},
    {"name": "Seema Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Rajesh Gupta"},
    {"name": "Shivani Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Atul Gupta"},
    {"name": "Atul Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Shivani Gupta"},
    {"name": "Shivang Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Shivani Gupta"},
    {"name": "Kamini Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Sham Gupta"},
    {"name": "Sham Gupta", "email": "", "plus_one_allowed": False, "associated_guest": "Kamini Gupta"},
    {"name": "Vandana Verma", "email": "", "plus_one_allowed": False, "associated_guest": "Vivek Verma"},
    {"name": "Vivek Verma", "email": "", "plus_one_allowed": False, "associated_guest": "Vandana Verma"},
    {"name": "Shiva Sood", "email": "", "plus_one_allowed": False, "associated_guest": ""},
    {"name": "Testy Boobs", "email": "test@test.com", "plus_one_allowed": False, "associated_guest": "Daenerys Stormborn of the House Targaryen"},
]

def load_guests():
    """Load the guest list into the database"""
    with app.app_context():
        # Create tables if they don"t exist
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