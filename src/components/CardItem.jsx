import React from 'react';
import { Card as BootstrapCard, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CardItem = ({ card, handleUpdateQuantity }) => {
  return (
    <BootstrapCard className={`card-item ${(card.quantity_foil + card.quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
      <BootstrapCard.Body>
        <BootstrapCard.Title>{card.name}</BootstrapCard.Title>
        <img src={`/media/gluth/4tb1/MTG/card_images/${card.id}.jpg`} alt={card.name} style={{ width: '100%' }} />
        <Form>
          <Form.Group controlId={`card-quantity-foil-${card.id}`}>
            <Form.Label>Foil Quantity</Form.Label>
            <Form.Control
              type="number"
              value={card.quantity_foil}
              onChange={e => handleUpdateQuantity(card.id, 'foil', parseInt(e.target.value))}
              min="0"
            />
          </Form.Group>
          <Form.Group controlId={`card-quantity-nonfoil-${card.id}`}>
            <Form.Label>Non-Foil Quantity</Form.Label>
            <Form.Control
              type="number"
              value={card.quantity_nonfoil}
              onChange={e => handleUpdateQuantity(card.id, 'nonfoil', parseInt(e.target.value))}
              min="0"
            />
          </Form.Group>
        </Form>
        <div className="card-prices">
          <p>Foil Price: ${card.price_foil}</p>
          <p>Non-Foil Price: ${card.price_nonfoil}</p>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

CardItem.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    quantity_foil: PropTypes.number,
    quantity_nonfoil: PropTypes.number,
    price_foil: PropTypes.number,
    price_nonfoil: PropTypes.number,
  }).isRequired,
  handleUpdateQuantity: PropTypes.func.isRequired,
};

export default CardItem;