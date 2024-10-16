import { useState } from 'react';

interface PaymentFormModalProps {
    onSubmit: (cardDetails: CardDetails) => void;
    onClose: () => void;
}

interface CardDetails {
    cardHolderName: string;
    cardNo: string; // Keep as string
    cvv: string;    // Keep as string
    billingAddress: string;
}

const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ onSubmit, onClose }) => {
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardHolderName: '',
        cardNo: '',
        cvv: '',
        billingAddress: '',
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const validateCardDetails = () => {
        const { cardNo, cvv } = cardDetails;
        // Basic validation for card number and CVV
        if (cardNo.length < 16 || cardNo.length > 19) {
            setError('Card number must be between 16 and 19 digits.');
            return false;
        }
        if (cvv.length < 3 || cvv.length > 4) {
            setError('CVV must be 3 or 4 digits.');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateCardDetails()) {
            onSubmit(cardDetails);
            setError(''); // Clear any previous error
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <input
                    type="text"
                    name="cardHolderName"
                    placeholder="Cardholder Name"
                    value={cardDetails.cardHolderName}
                    onChange={handleChange}
                    className="border p-2 w-full mb-4"
                />
                <input
                    type="text"
                    name="cardNo"
                    placeholder="Card Number"
                    value={cardDetails.cardNo}
                    onChange={handleChange}
                    className="border p-2 w-full mb-4"
                />
                <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleChange}
                    className="border p-2 w-full mb-4"
                />
                <input
                    type="text"
                    name="billingAddress"
                    placeholder="Billing Address"
                    value={cardDetails.billingAddress}
                    onChange={handleChange}
                    className="border p-2 w-full mb-4"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-red-500 text-white py-2 px-4 rounded w-full mt-4"
                >
                    Submit Payment
                </button>
                <button
                    onClick={onClose}
                    className="text-gray-500 text-sm mt-2 w-full"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PaymentFormModal;
