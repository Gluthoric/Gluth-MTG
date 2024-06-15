import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EditionCard = ({ id, name, iconSvgUri }) => {
  return (
    <Card className="edition-card">
      <Card.Body>
        <Link to={`/editions/${id}/cards`}>
          <Card.Img variant="top" src={iconSvgUri} alt={`${name} set symbol`} />
          <Card.Title>{name}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

EditionCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  iconSvgUri: PropTypes.string.isRequired,
};

export default EditionCard;