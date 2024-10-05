import React from 'react';

// Define the type for the props your Card will receive
interface CardProps {
  image: string;
  itemName: string;
  currentPrice: number;
}

const Card: React.FC<CardProps> = ({ image, itemName, currentPrice }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4">
      <img src={image} alt={itemName} className="w-full h-48 object-cover mb-4" />
      <h3 className="text-lg font-bold mb-2">{itemName}</h3>
      <div className="text-green-500 text-2xl mb-4">${currentPrice}</div>
      <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded w-full">
        Bid Now
      </button>
    </div>
  );
};

export default Card;
