from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Set(db.Model):
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

    def __repr__(self):
        return f'<Set {self.name}>'

class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    set_id = db.Column(db.Integer, db.ForeignKey('set.id'), nullable=False)
    set = db.relationship('Set', backref=db.backref('cards', lazy=True))
    collector_number = db.Column(db.String(50))
    scryfall_id = db.Column(db.String(50), unique=True, nullable=False)
    prices = db.Column(db.JSON)
    quantity = db.Column(db.JSON)
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

    def __repr__(self):
        return f'<Card {self.name}>'

class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id'), nullable=False)
    quantity_foil = db.Column(db.Integer, default=0)
    quantity_nonfoil = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Collection Card ID {self.card_id} Foil {self.quantity_foil} Non-foil {self.quantity_nonfoil}>'

class Kiosk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id'), nullable=False)
    quantity_foil = db.Column(db.Integer, default=0)
    quantity_nonfoil = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Kiosk Card ID {self.card_id} Foil {self.quantity_foil} Non-foil {self.quantity_nonfoil}>'
