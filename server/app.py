from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from functools import wraps
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models import db, RSVP, InvitedGuest, GiftDonation, MealSelection
from datetime import datetime

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

# ── API Key Auth ──────────────────────────────────────────────────────────────
def api_key_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('x-api-key') or request.args.get('api_key')
        if not os.environ.get('API_KEY') or api_key != os.environ.get('API_KEY'):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

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

        # Check if RSVP already exists for this guest
        existing_rsvp = RSVP.query.filter(
            db.func.lower(RSVP.name) == db.func.lower(data['name'])
        ).order_by(RSVP.created_at.desc()).first()

        if existing_rsvp:
            # Update existing RSVP
            existing_rsvp.email = data['email']
            existing_rsvp.attending = data['attending'] == 'yes'
            existing_rsvp.welcome_dinner = data.get('events', {}).get('welcomeDinner', False) if data['attending'] == 'yes' else False
            existing_rsvp.ceremony = data.get('events', {}).get('ceremony', False) if data['attending'] == 'yes' else False
            existing_rsvp.reception = data.get('events', {}).get('reception', False) if data['attending'] == 'yes' else False
            existing_rsvp.dietary_restrictions = data.get('dietaryRestrictions', '') if data['attending'] == 'yes' else ''
            existing_rsvp.additional_notes = data.get('additionalNotes', '')
            existing_rsvp.plus_one_name = data.get('plusOneName', '')
            existing_rsvp.plus_one_email = data.get('plusOneEmail', '')
            existing_rsvp.updated_at = datetime.utcnow()

            db.session.commit()

            return jsonify({
                'message': 'RSVP updated successfully',
                'rsvp': existing_rsvp.to_dict()
            }), 200
        else:
            # Create new RSVP
            rsvp = RSVP(
                name=data['name'],
                email=data['email'],
                attending=data['attending'] == 'yes',
                welcome_dinner=data.get('events', {}).get('welcomeDinner', False) if data['attending'] == 'yes' else False,
                ceremony=data.get('events', {}).get('ceremony', False) if data['attending'] == 'yes' else False,
                reception=data.get('events', {}).get('reception', False) if data['attending'] == 'yes' else False,
                dietary_restrictions=data.get('dietaryRestrictions', '') if data['attending'] == 'yes' else '',
                additional_notes=data.get('additionalNotes', ''),
                plus_one_name=data.get('plusOneName', ''),
                plus_one_email=data.get('plusOneEmail', '')
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

@app.route("/api/rsvp/<guest_name>", methods=['GET'])
def get_rsvp_by_guest(guest_name):
    try:
        # Find the most recent RSVP for this guest
        rsvp = RSVP.query.filter(
            db.func.lower(RSVP.name) == db.func.lower(guest_name)
        ).order_by(RSVP.created_at.desc()).first()

        if rsvp:
            return jsonify({
                'found': True,
                'rsvp': rsvp.to_dict()
            })
        else:
            return jsonify({
                'found': False,
                'message': 'No RSVP found for this guest'
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

        # Check if name matches a plus one from RSVPs
        plus_one_match = RSVP.query.filter(
            db.func.lower(RSVP.plus_one_name) == db.func.lower(name)
        ).first()

        if plus_one_match:
            return jsonify({
                'is_invited': True,
                'guest': {'name': plus_one_match.plus_one_name, 'is_plus_one': True, 'invited_by': plus_one_match.name}
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
            'message': 'Zuko says you are not on the guest list. Try something else. Or take it up with Reena or Varun.'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ── Helpers ──────────────────────────────────────────────────────────────────

VALID_FUNDS = {'honeymoon', 'adventure', 'donate_in_name'}
VALID_MEALS = {'chicken', 'fish', 'vegetarian'}

# Map fund name to the GiftDonation column name
FUND_COLUMNS = {
    'honeymoon': 'honeymoon',
    'adventure': 'adventure',
    'donate_in_name': 'donate_in_name',
}

def find_gift_donation(guest_name):
    return GiftDonation.query.filter(
        db.func.lower(GiftDonation.guest_name) == db.func.lower(guest_name)
    ).first()

# ── Admin endpoints (API key required) ───────────────────────────────────────

# Gift Donation endpoints
@app.route("/api/gift-donation", methods=["POST"])
def save_gift_donation():
    try:
        data = request.get_json()
        guest_name = data.get('guestName', '').strip()[:100]
        fund = data.get('fund', '').strip()
        associated_names = data.get('associatedNames', [])
        donation_option = data.get('donationOption')

        if not guest_name or not fund:
            return jsonify({'error': 'guestName and fund are required'}), 400

        if fund not in VALID_FUNDS:
            return jsonify({'error': f'Invalid fund. Must be one of: {", ".join(VALID_FUNDS)}'}), 400

        existing = find_gift_donation(guest_name)
        names_str = ','.join(n[:100] for n in associated_names[:20]) if associated_names else None

        if existing:
            existing.associated_names = names_str
            setattr(existing, FUND_COLUMNS[fund], True)
            if fund == 'donate_in_name':
                existing.donation_option = donation_option
        else:
            record = GiftDonation(
                guest_name=guest_name,
                associated_names=names_str,
                **{FUND_COLUMNS[fund]: True},
                donation_option=donation_option if fund == 'donate_in_name' else None
            )
            db.session.add(record)

        db.session.commit()
        return jsonify({'message': 'Donation saved'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route("/api/gift-donation/undo", methods=["POST"])
def undo_gift_donation():
    try:
        data = request.get_json()
        guest_name = data.get('guestName', '').strip()[:100]
        fund = data.get('fund', '').strip()

        if not guest_name or not fund:
            return jsonify({'error': 'guestName and fund are required'}), 400

        if fund not in VALID_FUNDS:
            return jsonify({'error': f'Invalid fund. Must be one of: {", ".join(VALID_FUNDS)}'}), 400

        existing = find_gift_donation(guest_name)
        if existing:
            setattr(existing, FUND_COLUMNS[fund], False)
            if fund == 'donate_in_name':
                existing.donation_option = None
            db.session.commit()

        return jsonify({'message': 'Donation undone'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route("/api/gift-donation/<guest_name>", methods=["GET"])
def get_gift_donation(guest_name):
    try:
        record = GiftDonation.query.filter(
            db.func.lower(GiftDonation.guest_name) == db.func.lower(guest_name)
        ).first()
        if record:
            return jsonify({'donation': record.to_dict()}), 200
        return jsonify({'donation': None}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/api/gift-donation/names", methods=["POST"])
def save_gift_donation_names():
    try:
        data = request.get_json()
        guest_name = data.get('guestName', '').strip()
        associated_names = data.get('associatedNames', [])

        if not guest_name:
            return jsonify({'error': 'guestName is required'}), 400

        existing = GiftDonation.query.filter(
            db.func.lower(GiftDonation.guest_name) == db.func.lower(guest_name)
        ).first()

        names_str = ','.join(associated_names) if associated_names else None

        if existing:
            existing.associated_names = names_str
        else:
            record = GiftDonation(guest_name=guest_name, associated_names=names_str)
            db.session.add(record)

        db.session.commit()
        return jsonify({'message': 'Names saved'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Meal Selection endpoints
@app.route("/api/meal-selection", methods=["POST"])
def save_meal_selection():
    try:
        data = request.get_json()
        guest_name = data.get('guestName', '').strip()
        submitted_by = data.get('submittedBy', '').strip()
        meal_choice = data.get('mealChoice', '').strip()

        if not guest_name or not submitted_by or not meal_choice:
            return jsonify({'error': 'guestName, submittedBy, and mealChoice are required'}), 400

        existing = MealSelection.query.filter(
            db.func.lower(MealSelection.guest_name) == db.func.lower(guest_name),
            db.func.lower(MealSelection.submitted_by) == db.func.lower(submitted_by)
        ).first()

        if existing:
            existing.meal_choice = meal_choice
        else:
            record = MealSelection(guest_name=guest_name, submitted_by=submitted_by, meal_choice=meal_choice)
            db.session.add(record)

        # If someone updates their own meal, sync all other records for them
        if guest_name.lower() == submitted_by.lower():
            others = MealSelection.query.filter(
                db.func.lower(MealSelection.guest_name) == db.func.lower(guest_name),
                db.func.lower(MealSelection.submitted_by) != db.func.lower(submitted_by)
            ).all()
            for other in others:
                other.meal_choice = meal_choice

        db.session.commit()
        return jsonify({'message': 'Meal selection saved'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route("/api/meal-selection/<guest_name>", methods=["GET"])
def get_meal_selection(guest_name):
    try:
        # Meals this person submitted (their cards)
        records = MealSelection.query.filter(
            db.func.lower(MealSelection.submitted_by) == db.func.lower(guest_name)
        ).all()

        # Check if someone else already submitted a meal for this person
        own_meal = None
        own_names = [r.guest_name.lower() for r in records]
        if guest_name.lower() not in own_names:
            other_record = MealSelection.query.filter(
                db.func.lower(MealSelection.guest_name) == db.func.lower(guest_name),
                db.func.lower(MealSelection.submitted_by) != db.func.lower(guest_name)
            ).first()
            if other_record:
                own_meal = other_record.to_dict()

        return jsonify({
            'selections': [r.to_dict() for r in records],
            'own_meal': own_meal
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Add one or many invited guests
# Accepts a single object or an array of objects
@app.route("/api/admin/add-guest", methods=["POST"])
@api_key_required
def add_invited_guest():
    try:
        data = request.get_json()
        guests_data = data if isinstance(data, list) else [data]
        added = []
        skipped = []

        for item in guests_data:
            if not item.get('name'):
                skipped.append({'item': item, 'reason': 'Name is required'})
                continue

            existing_guest = InvitedGuest.query.filter(
                db.func.lower(InvitedGuest.name) == db.func.lower(item['name'])
            ).first()

            if existing_guest:
                skipped.append({'name': item['name'], 'reason': 'Already exists'})
                continue

            guest = InvitedGuest(
                name=item['name'],
                email=item.get('email'),
                plus_one_allowed=item.get('plus_one_allowed', False),
                plus_one_name=item.get('plus_one_name'),
                associated_guest=item.get('associated_guest')
            )
            db.session.add(guest)
            added.append(item['name'])

        db.session.commit()

        return jsonify({
            'message': f"{len(added)} guest(s) added, {len(skipped)} skipped.",
            'added': added,
            'skipped': skipped
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all invited guests
@app.route("/api/admin/guests", methods=["GET"])
@api_key_required
def get_invited_guests():
    try:
        guests = InvitedGuest.query.order_by(InvitedGuest.name).all()
        return jsonify({
            'guests': [guest.to_dict() for guest in guests],
            'total': len(guests)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a guest by ID
@app.route("/api/admin/guests/<int:guest_id>", methods=["DELETE"])
@api_key_required
def delete_invited_guest(guest_id):
    try:
        guest = InvitedGuest.query.get(guest_id)
        if not guest:
            return jsonify({'error': 'Guest not found'}), 404
        db.session.delete(guest)
        db.session.commit()
        return jsonify({'message': f"'{guest.name}' removed from guest list."})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Summary — clean RSVP overview for Reena
@app.route("/api/admin/summary", methods=["GET"])
@api_key_required
def summary():
    try:
        all_rsvps = RSVP.query.all()
        attending     = [r for r in all_rsvps if r.attending]
        not_attending = [r for r in all_rsvps if not r.attending]
        pending_names = []

        all_guests = InvitedGuest.query.order_by(InvitedGuest.name).all()
        rsvp_names_lower = {r.name.lower() for r in all_rsvps}
        for g in all_guests:
            if g.name.lower() not in rsvp_names_lower:
                pending_names.append(g.name)

        dietary = [
            {'name': r.name, 'restrictions': r.dietary_restrictions}
            for r in attending if r.dietary_restrictions
        ]

        plus_ones = [
            {'guest': r.name, 'plus_one': r.plus_one_name}
            for r in attending if r.plus_one_name
        ]

        return jsonify({
            'summary': {
                'total_invited':   len(all_guests),
                'total_rsvps':     len(all_rsvps),
                'attending':       len(attending),
                'not_attending':   len(not_attending),
                'no_response_yet': len(pending_names),
            },
            'events': {
                'welcome_dinner': len([r for r in attending if r.welcome_dinner]),
                'ceremony':       len([r for r in attending if r.ceremony]),
                'reception':      len([r for r in attending if r.reception]),
            },
            'plus_ones':         plus_ones,
            'dietary_needs':     dietary,
            'no_response_yet':   pending_names,
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
