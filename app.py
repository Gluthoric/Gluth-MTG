import os, re
from flask import Flask, render_template, request, jsonify, redirect, url_for
from models import db, Card, Edition, Collection, Kiosk
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# SQLAlchemy configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

@app.route("/")
def home():
    return redirect(url_for('editions'))

@app.route("/static/card_images/<edition_name>/<scryfall_id>")
def card_image(edition_name, scryfall_id):
    # Logic to fetch and display card images
    return f"/static/card_images/{edition_name}/{scryfall_id}"


@app.route("/editions")
def editions():
    page = request.args.get('page', 1, type=int)
    per_page = 20  # Number of editions per page

    set_type = request.args.get('set_type')
    
    query = Edition.query
    
    if set_type:
        query = query.filter_by(set_type=set_type)
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    editions = pagination.items
    total_pages = pagination.pages

    return render_template('editions.html', editions=pagination, page=page, total_pages=total_pages)

def collector_number_sort_key(card):
    match = re.match(r'(\d+)(\D*)', card.collector_number)
    if match:
        return (int(match.group(1)), match.group(2))
    else:
        return (0, '')

@app.route("/editions/<edition_name>")
def edition_view(edition_name):
    edition_obj = Edition.query.filter_by(name=edition_name).first_or_404()
    color = request.args.get('color')
    rarity = request.args.get('rarity')
    order = request.args.get('order', 'asc')  # Default order is ascending

    query = Card.query.filter_by(set_name=edition_name)

    if color:
        query = query.filter(Card.colors.contains([color]))
    if rarity:
        query = query.filter_by(rarity=rarity)

    cards_in_edition = query.all()  # Fetch all cards without pagination

    if order == 'desc':
        cards_in_edition.sort(key=collector_number_sort_key, reverse=True)
    else:
        cards_in_edition.sort(key=collector_number_sort_key)

    edition_info = {
        'icon_svg_uri': edition_obj.icon_svg_uri
    }
    return render_template('edition_view.html', edition_name=edition_name, edition_info=edition_info, cards=cards_in_edition, order=order)

@app.route("/filter_cards", methods=["POST"])
def filter_cards():
    criteria = request.json
    query = Card.query
    
    if "colors" in criteria and criteria["colors"]:
        query = query.filter(Card.colors.contains(criteria["colors"]))
    if "rarities" in criteria and criteria["rarities"]:
        query = query.filter(Card.rarity.in_(criteria["rarities"]))
    if "searchTerm" in criteria and criteria["searchTerm"]:
        query = query.filter(Card.name.ilike(f"%{criteria['searchTerm']}%"))
    if "edition_name" in criteria and criteria["edition_name"]:
        query = query.filter_by(set_name=criteria["edition_name"])
    
    filtered_cards = query.all()
    result = []
    for card in filtered_cards:
        result.append({
            'name': card.name,
            'edition_name': card.set_name,
            'scryfall_id': card.scryfall_id,
            'prices': card.prices,
            'colors': card.colors,
            'rarity': card.rarity
        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
