from flask import Flask, render_template, request, jsonify, redirect, url_for
from models import db, Card, Set, Collection, Kiosk

app = Flask(__name__)

# SQLAlchemy configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://mtg_user:Caprisun1!@localhost/mtg_dashboard'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/sets")
def sets():
    all_sets = Set.query.all()
    return render_template('sets.html', sets=all_sets)

@app.route("/sets/<set_name>")
def set_view(set_name):
    page = request.args.get('page', 1, type=int)
    per_page = 20  # Number of cards per page
    set_obj = Set.query.filter_by(name=set_name).first_or_404()
    pagination = Card.query.filter_by(set_id=set_obj.id).paginate(page, per_page, False)
    cards_in_set = pagination.items
    total_pages = pagination.pages
    return render_template('set_view.html', set_name=set_name, cards=cards_in_set, page=page, total_pages=total_pages)

@app.route("/owned")
def owned_sets():
    owned_sets = db.session.query(Collection, Card, Set).join(Card, Collection.card_id == Card.id).join(Set, Card.set_id == Set.id).filter(
        (Collection.quantity_foil > 0) | (Collection.quantity_nonfoil > 0)).with_entities(Set.name).distinct().all()
    return render_template('owned_sets.html', sets=owned_sets)

@app.route("/owned/<set_name>")
def owned_set_view(set_name):
    set_obj = Set.query.filter_by(name=set_name).first_or_404()
    owned_cards = db.session.query(Collection, Card).join(Card, Collection.card_id == Card.id).filter(
        Card.set_id == set_obj.id, (Collection.quantity_foil > 0) | (Collection.quantity_nonfoil > 0)).all()
    return render_template('owned_set_view.html', set_name=set_name, cards=owned_cards)

@app.route("/kiosk")
def kiosk():
    kiosk_items = db.session.query(Kiosk, Card, Set).join(Card, Kiosk.card_id == Card.id).join(Set, Card.set_id == Set.id).filter(
        (Kiosk.quantity_foil > 0) | (Kiosk.quantity_nonfoil > 0)).all()
    return render_template('kiosk.html', items=kiosk_items)

@app.route("/kiosk/<set_name>")
def kiosk_set_view(set_name):
    set_obj = Set.query.filter_by(name=set_name).first_or_404()
    cards_in_kiosk_set = db.session.query(Kiosk, Card).join(Card, Kiosk.card_id == Card.id).filter(
        Card.set_id == set_obj.id, (Kiosk.quantity_foil > 0) | (Kiosk.quantity_nonfoil > 0)).all()
    return render_template('kiosk_set_view.html', set_name=set_name, cards=cards_in_kiosk_set)

@app.route("/cards")
def all_cards():
    cards = Card.query.all()
    return render_template('all_cards.html', cards=cards)

@app.route("/filter_cards", methods=["POST"])
def filter_cards():
    criteria = request.json
    query = Card.query
    if "name" in criteria:
        query = query.filter(Card.name.ilike(f"%{criteria['name']}%"))
    if "set_name" in criteria:
        query = query.join(Set).filter(Set.name == criteria["set_name"])
    if "min_price" in criteria:
        query = query.filter(Card.prices["usd"].astext.cast(db.Float) >= criteria["min_price"])
    if "max_price" in criteria:
        query = query.filter(Card.prices["usd"].astext.cast(db.Float) <= criteria["max_price"])
    filtered_cards = query.all()
    return jsonify(filtered_cards)

# Card images endpoint
@app.route("/static/card_images/<set_name>/<scryfall_id>")
def card_images(set_name, scryfall_id):
    # Logic to fetch and display card images
    return f"/static/card_images/{set_name}/{scryfall_id}"

if __name__ == "__main__":
    app.run(debug=True)
