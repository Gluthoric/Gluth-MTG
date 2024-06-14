import React, { createContext, useReducer, useContext } from 'react';

const CardContext = createContext();

const initialState = {
  cards: [],
  sortOption: '',
  filterOption: '',
};

const cardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'UPDATE_CARD_QUANTITY':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id ? { ...card, quantity: action.payload.quantity } : card
        ),
      };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'SET_FILTER_OPTION':
      return { ...state, filterOption: action.payload };
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