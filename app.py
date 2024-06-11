import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
from models import db, Card, Edition
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

@app.route("/editions/<edition_name>")
def edition_view(edition_name):
    page = request.args.get('page', 1, type=int)
    per_page = 20  # Number of cards per page

    edition_obj = Edition.query.filter_by(name=edition_name).first_or_404()
    
    color = request.args.get('color')
    rarity = request.args.get('rarity')
    
    query = Card.query.filter_by(edition_id=edition_obj.id)
    
    if color:
        query = query.filter(Card.colors.contains([color]))
    if rarity:
        query = query.filter_by(rarity=rarity)
        
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    cards_in_edition = pagination.items
    total_pages = pagination.pages
    
    edition_info = {
        "icon_svg_uri": edition_obj.icon_svg_uri
    }

    return render_template('edition_view.html', edition_name=edition_name, edition_info=edition_info, cards=cards_in_edition, page=page, total_pages=total_pages)

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
        edition_obj = Edition.query.filter_by(name=criteria["edition_name"]).first_or_404()
        query = query.filter_by(edition_id=edition_obj.id)
    
    filtered_cards = query.all()
    result = []
    for card in filtered_cards:
        result.append({
            'name': card.name,
            'edition_name': card.edition.name,
            'scryfall_id': card.scryfall_id,
            'prices': card.prices,
            'colors': card.colors,
            'rarity': card.rarity
        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
