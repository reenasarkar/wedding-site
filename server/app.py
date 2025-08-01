from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models import db, RSVP, InvitedGuest

# Check if React build exists, otherwise serve from current directory
static_folder = "../client/build" if os.path.exists("../client/build") else "."
app = Flask(__name__, static_folder=static_folder, static_url_path="/")
CORS(app)

# Database configuration
database_url = os.environ.get('DATABASE_URL', 'sqlite:///rsvp.db')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask!")

# Create database tables
try:
    with app.app_context():
        db.create_all()
        print("Database tables created successfully")
except Exception as e:
    print(f"Error creating database tables: {e}")

# RSVP API endpoints
@app.route("/api/rsvp", methods=['POST'])
def submit_rsvp():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or data.get('attending') is None:
            return jsonify({'error': 'Name, email, and attendance status are required'}), 400
        
        # Create new RSVP
        rsvp = RSVP(
            name=data['name'],
            email=data['email'],
            attending=data['attending'] == 'yes',
            welcome_dinner=data.get('events', {}).get('welcomeDinner', False) if data['attending'] == 'yes' else False,
            ceremony=data.get('events', {}).get('ceremony', False) if data['attending'] == 'yes' else False,
            reception=data.get('events', {}).get('reception', False) if data['attending'] == 'yes' else False,
            dietary_restrictions=data.get('dietaryRestrictions', '') if data['attending'] == 'yes' else '',
            additional_notes=data.get('additionalNotes', '')
        )
        
        db.session.add(rsvp)
        db.session.commit()
        
        return jsonify({
            'message': 'RSVP submitted successfully',
            'rsvp': rsvp.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route("/api/rsvp", methods=['GET'])
def get_rsvps():
    try:
        rsvps = RSVP.query.order_by(RSVP.created_at.desc()).all()
        return jsonify({
            'rsvps': [rsvp.to_dict() for rsvp in rsvps],
            'total': len(rsvps),
            'attending': len([r for r in rsvps if r.attending]),
            'not_attending': len([r for r in rsvps if not r.attending])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Guest validation endpoint
@app.route("/api/check-guest", methods=["POST"])
def check_guest():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        
        # Search for exact match first
        guest = InvitedGuest.query.filter(
            db.func.lower(InvitedGuest.name) == db.func.lower(name)
        ).first()
        
        if guest:
            return jsonify({
                'is_invited': True,
                'guest': guest.to_dict()
            })
        
        # If no exact match, search for partial matches
        partial_matches = InvitedGuest.query.filter(
            db.func.lower(InvitedGuest.name).contains(db.func.lower(name))
        ).limit(5).all()
        
        if partial_matches:
            return jsonify({
                'is_invited': False,
                'suggestions': [g.name for g in partial_matches],
                'message': 'Name not found. Did you mean one of these?'
            })
        
        return jsonify({
            'is_invited': False,
            'message': 'Name not found in guest list'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin endpoint to add invited guests (for you to pre-load the list)
@app.route("/api/admin/add-guest", methods=["POST"])
def add_invited_guest():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        # Check if guest already exists
        existing_guest = InvitedGuest.query.filter(
            db.func.lower(InvitedGuest.name) == db.func.lower(data['name'])
        ).first()
        
        if existing_guest:
            return jsonify({'error': 'Guest already exists'}), 400
        
        # Create new invited guest
        guest = InvitedGuest(
            name=data['name'],
            email=data.get('email'),
            plus_one_allowed=data.get('plus_one_allowed', False),
            plus_one_name=data.get('plus_one_name')
        )
        
        db.session.add(guest)
        db.session.commit()
        
        return jsonify({
            'message': 'Guest added successfully',
            'guest': guest.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Admin endpoint to get all invited guests
@app.route("/api/admin/guests", methods=["GET"])
def get_invited_guests():
    try:
        guests = InvitedGuest.query.order_by(InvitedGuest.name).all()
        return jsonify({
            'guests': [guest.to_dict() for guest in guests],
            'total': len(guests)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)