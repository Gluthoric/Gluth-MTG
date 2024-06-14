import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';

const SortingFilteringControls = () => {
  const { state, dispatch } = useCardContext();
  const { sortOption, filterOption } = state;

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: e.target.value });
  };

  const handleFilterChange = (e) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: e.target.value });
  };

  return (
    <div className="sorting-filtering-controls">
      <Row>
        <Col>
          <Form.Group controlId="sortOptions">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortOption}
              onChange={handleSortChange}
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
              onChange={handleFilterChange}
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