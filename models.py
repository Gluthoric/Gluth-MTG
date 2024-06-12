from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()


class Edition(db.Model):
    __tablename__ = 'edition'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(10), nullable=False)
    released_at = db.Column(db.Date)
    set_type = db.Column(db.String(50))
    card_count = db.Column(db.Integer)
    digital = db.Column(db.Boolean)
    nonfoil_only = db.Column(db.Boolean)
    foil_only = db.Column(db.Boolean)
    icon_svg_uri = db.Column(db.String(255))

    cards = db.relationship('Card', backref='edition', lazy=True)

    @hybrid_property
    def collected_cards(self):
        return sum(collection.quantity_foil + collection.quantity_nonfoil for card in self.cards for collection in card.collections)

    @hybrid_property
    def total_value(self):
        return sum((card.prices['usd_foil'] if 'usd_foil' in card.prices else 0) + (card.prices['usd'] if 'usd' in card.prices else 0) for card in self.cards)

    def __repr__(self):
        return f'<Edition {self.name}>'


class Card(db.Model):
    __tablename__ = 'cards'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    set_name = db.Column(db.String(255), nullable=False)
    collector_number = db.Column(db.String(50))
    scryfall_id = db.Column(db.String(50), unique=True, nullable=False)
    prices = db.Column(db.JSON)
    image_url = db.Column(db.String(255))
    oracle_text = db.Column(db.Text)
    type_line = db.Column(db.String(255))
    mana_cost = db.Column(db.String(50))
    cmc = db.Column(db.Numeric(5, 2))
    power = db.Column(db.String(10))
    toughness = db.Column(db.String(10))
    rarity = db.Column(db.String(50))
    colors = db.Column(db.JSON)
    color_identity = db.Column(db.JSON)
    set_code = db.Column(db.String(36))
    released_at = db.Column(db.Date)
    edition_id = db.Column(db.String(36), db.ForeignKey('edition.id'), nullable=False)

    def __repr__(self):
        return f'<Card {self.name}>'


class Collection(db.Model):
    __tablename__ = 'collections'
    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'), nullable=False)
    card = db.relationship('Card', backref=db.backref('collections', lazy=True))
    quantity_foil = db.Column(db.Integer, default=0)
    quantity_nonfoil = db.Column(db.Integer, default=0)


class Kiosk(db.Model):
    __tablename__ = 'kiosk'
    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'), nullable=False)
    card = db.relationship('Card', backref=db.backref('kiosks', lazy=True))
    quantity_foil = db.Column(db.Integer, default=0)
    quantity_nonfoil = db.Column(db.Integer, default=0)
