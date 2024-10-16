import React from 'react';

interface ConfirmProps {
    onConfirm: () => void;   // User continues with existing payment
    onCancel: () => void;    // User updates payment details
    onClose: () => void;     // Close the modal
}

const Confirm: React.FC<ConfirmProps> = ({ onConfirm, onCancel, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4 text-center">Confirm Payment</h2>
                <p className="text-center mb-6">
                    Do you want to continue with the current payment details or update them?
                </p>
                <div className="flex justify-between">
                    <button
                        onClick={onConfirm}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-5"
                    >
                        Continue (Use Current Payment)
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Update Payment Details
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-gray-500 underline text-sm block text-center justify-center"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Confirm;
