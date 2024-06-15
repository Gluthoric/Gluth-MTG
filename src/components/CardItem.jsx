import React from 'react';
import { Card as BootstrapCard, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CardItem = ({ card, handleUpdateQuantity }) => {
  const { id, name, image_url, quantity_foil, quantity_nonfoil, price_foil, price_nonfoil } = card;

  return (
    <BootstrapCard className={`card-item ${(quantity_foil + quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
      <BootstrapCard.Body>
        <BootstrapCard.Title>{name}</BootstrapCard.Title>
        <img src={image_url} alt={name} style={{ width: '100%' }} />
        <Form>
          <Form.Group controlId={`card-quantity-foil-${id}`}>
            <Form.Label>Foil Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity_foil}
              onChange={e => handleUpdateQuantity(id, 'foil', parseInt(e.target.value))}
              min="0"
            />
          </Form.Group>
          <Form.Group controlId={`card-quantity-nonfoil-${id}`}>
            <Form.Label>Non-Foil Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity_nonfoil}
              onChange={e => handleUpdateQuantity(id, 'nonfoil', parseInt(e.target.value))}
              min="0"
            />
          </Form.Group>
        </Form>
        <div className="card-prices">
          <p>Foil Price: ${price_foil}</p>
          <p>Non-Foil Price: ${price_nonfoil}</p>
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
