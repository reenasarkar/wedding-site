from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class RSVP(db.Model):
    __tablename__ = 'rsvps'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    attending = db.Column(db.Boolean, nullable=False)  # True for yes, False for no
    welcome_dinner = db.Column(db.Boolean, default=False)
    ceremony = db.Column(db.Boolean, default=False)
    reception = db.Column(db.Boolean, default=False)
    dietary_restrictions = db.Column(db.Text)
    additional_notes = db.Column(db.Text)
    plus_one_name = db.Column(db.String(100), nullable=True)
    plus_one_email = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<RSVP {self.name} - {"Attending" if self.attending else "Not Attending"}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'attending': self.attending,
            'welcome_dinner': self.welcome_dinner,
            'ceremony': self.ceremony,
            'reception': self.reception,
            'dietary_restrictions': self.dietary_restrictions,
            'additional_notes': self.additional_notes,
            'plus_one_name': self.plus_one_name,
            'plus_one_email': self.plus_one_email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class GiftDonation(db.Model):
    __tablename__ = 'gift_donations'

    id = db.Column(db.Integer, primary_key=True)
    guest_name = db.Column(db.String(100), nullable=False, unique=True)
    associated_names = db.Column(db.Text, nullable=True)
    honeymoon = db.Column(db.Boolean, default=False)
    adventure = db.Column(db.Boolean, default=False)
    donate_in_name = db.Column(db.Boolean, default=False)
    donation_option = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<GiftDonation {self.guest_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'guest_name': self.guest_name,
            'associated_names': self.associated_names.split(',') if self.associated_names else [],
            'honeymoon': self.honeymoon,
            'adventure': self.adventure,
            'donate_in_name': self.donate_in_name,
            'donation_option': self.donation_option,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class MealSelection(db.Model):
    __tablename__ = 'meal_selections'

    id = db.Column(db.Integer, primary_key=True)
    guest_name = db.Column(db.String(100), nullable=False, unique=True)
    meal_choice = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<MealSelection {self.guest_name} - {self.meal_choice}>'

    def to_dict(self):
        return {
            'id': self.id,
            'guest_name': self.guest_name,
            'meal_choice': self.meal_choice,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class InvitedGuest(db.Model):
    __tablename__ = 'invited_guests'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=True)  # Optional email
    plus_one_allowed = db.Column(db.Boolean, default=False)
    plus_one_name = db.Column(db.String(100), nullable=True)
    associated_guest = db.Column(db.String(100), nullable=True)  # Name of associated guest (spouse, partner, etc.)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<InvitedGuest {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'plus_one_allowed': self.plus_one_allowed,
            'plus_one_name': self.plus_one_name,
            'associated_guest': self.associated_guest,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 