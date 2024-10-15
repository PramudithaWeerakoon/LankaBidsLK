// components/SearchResultsSection.tsx
import { useEffect, useState } from 'react';
import Card from '@/components/customer/card/card';

interface SearchResultsProps {
    searchTerm: string;
}

interface BidItem {
    BidItemID: number;
    ItemName: string;
    category: string;
    Image: string | null;
    CurrentPrice: number;
    BidEndTime: string;
}

const SearchResultsSection = ({ searchTerm }: SearchResultsProps) => {
    const [searchResults, setSearchResults] = useState<BidItem[]>([]);

    useEffect(() => {
        if (searchTerm) {
            const fetchResults = async () => {
                const response = await fetch(`/api/search?searchTerm=${searchTerm}`);
                const results = await response.json();
                setSearchResults(results);
            };
            fetchResults();
        }
    }, [searchTerm]);

    if (searchResults.length === 0) return null;

    return (
        <div className="py-12 bg-white">
            <h2 className="text-4xl font-bold text-neutral-600 text-center mb-8">Search Results</h2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {searchResults.map((item) => (
                    <Card
                        key={item.BidItemID}
                        bidItemID={item.BidItemID}
                        image={`data:image/jpeg;base64,${item.Image}`}
                        itemName={item.ItemName}
                        category={item.category}
                        currentPrice={item.CurrentPrice}
                        bidEndTime={item.BidEndTime}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchResultsSection;
