import React, { createContext, useReducer, useContext } from 'react';

const CardContext = createContext();

const initialState = {
  cards: [],
  sortOption: '',
  filterOption: '',
  loading: true,
  error: null,
};

const cardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload, loading: false, error: null };
    case 'UPDATE_CARD_QUANTITY':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id
            ? { ...card, quantity_foil: action.payload.quantity_foil, quantity_nonfoil: action.payload.quantity_nonfoil }
            : card
        ),
      };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'SET_FILTER_OPTION':
      return { ...state, filterOption: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);