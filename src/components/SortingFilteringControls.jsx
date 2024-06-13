
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const SortingFilteringControls = ({ sortOption, filterOption, onSortChange, onFilterChange }) => {
  return (
    <div className="sorting-filtering-controls">
      <Row>
        <Col>
          <Form.Group controlId="sortOptions">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="name">Name</option>
              <option value="quantity">Quantity</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filterOptions">
            <Form.Label>Filter By</Form.Label>
            <Form.Control
              as="select"
              value={filterOption}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="owned">Owned</option>
              <option value="unowned">Unowned</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default SortingFilteringControls;
