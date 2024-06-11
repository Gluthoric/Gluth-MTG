import pymysql
import json

# Database connection details
db_url = 'localhost'
db_user = 'mtg_user'
db_password = 'Caprisun1!'
db_name = 'mtg_dashboard'

# Load card data from local JSON file
with open('/media/gluth/4tb1/MTG/Gluth-MTG/default_cards.json', 'r') as file:
    cards_data = json.load(file)
    print(f'Loaded {len(cards_data)} cards from local JSON file.')

# Connect to the database
connection = pymysql.connect(host=db_url, user=db_user, password=db_password, database=db_name)

try:
    with connection.cursor() as cursor:
        # Modify id column to VARCHAR(50) if not already set
        cursor.execute("SHOW COLUMNS FROM cards LIKE 'id';")
        result = cursor.fetchone()
        if result and result[1] != 'varchar(50)':
            cursor.execute("ALTER TABLE cards MODIFY COLUMN id VARCHAR(50);")
            connection.commit()

        # Check if the set_code column exists
        cursor.execute("SHOW COLUMNS FROM cards LIKE 'set_code';")
        result = cursor.fetchone()
        if not result:
            cursor.execute("ALTER TABLE cards ADD COLUMN set_code VARCHAR(36);")
            connection.commit()

        # Check if the released_at column exists
        cursor.execute("SHOW COLUMNS FROM cards LIKE 'released_at';")
        result = cursor.fetchone()
        if not result:
            cursor.execute("ALTER TABLE cards ADD COLUMN released_at DATE;")
            connection.commit()

        # Modify cmc column to DECIMAL(10, 2) if not already set
        cursor.execute("SHOW COLUMNS FROM cards LIKE 'cmc';")
        result = cursor.fetchone()
        if result and result[1] != 'decimal(10,2)':
            cursor.execute("ALTER TABLE cards MODIFY COLUMN cmc DECIMAL(10, 2);")
            connection.commit()

        # Prepare insert statement for cards
        insert_query = """
        INSERT INTO cards (id, name, set_name, collector_number, scryfall_id, prices, image_url, oracle_text, type_line, mana_cost, cmc, power, toughness, rarity, colors, color_identity, set_code, released_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            set_name = VALUES(set_name),
            collector_number = VALUES(collector_number),
            scryfall_id = VALUES(scryfall_id),
            prices = VALUES(prices),
            image_url = VALUES(image_url),
            oracle_text = VALUES(oracle_text),
            type_line = VALUES(type_line),
            mana_cost = VALUES(mana_cost),
            cmc = VALUES(cmc),
            power = VALUES(power),
            toughness = VALUES(toughness),
            rarity = VALUES(rarity),
            colors = VALUES(colors),
            color_identity = VALUES(color_identity),
            set_code = VALUES(set_code),
            released_at = VALUES(released_at)
        """

        # Loop over each card and insert into database
        for card_data in cards_data:
            if 'image_uris' in card_data:
                image_url = card_data['image_uris'].get('normal', None)
            else:
                image_url = None

            # Convert prices, colors, and color_identity to JSON format
            prices = {
                'usd': card_data.get('prices', {}).get('usd', None),
                'usd_foil': card_data.get('prices', {}).get('usd_foil', None)
            }

            colors = json.dumps(card_data.get('colors', []))
            color_identity = json.dumps(card_data.get('color_identity', []))

            cmc = card_data.get('cmc', 0)
            if cmc is None:
                cmc = 0

            cursor.execute(insert_query, (
                card_data['id'],
                card_data['name'],
                card_data['set_name'],
                card_data.get('collector_number', None),
                card_data['id'],
                json.dumps(prices),
                image_url,
                card_data.get('oracle_text', ''),
                card_data.get('type_line', ''),
                card_data.get('mana_cost', ''),
                cmc,
                card_data.get('power', None),
                card_data.get('toughness', None),
                card_data.get('rarity', ''),
                colors,
                color_identity,
                card_data['set'],
                card_data.get('released_at', None)
            ))

        # Commit the transaction
        connection.commit()
        print('Inserted card data into cards table.')
finally:
    connection.close()
