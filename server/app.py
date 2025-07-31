from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from models import db, RSVP
import os

app = Flask(__name__, static_folder="../client/build", static_url_path="/")
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///rsvp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask!")

# Create database tables
with app.app_context():
    db.create_all()

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

@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)