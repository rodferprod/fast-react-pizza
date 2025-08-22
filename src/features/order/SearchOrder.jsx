import { useState } from "react"
import { useNavigate } from "react-router-dom";

function SearchOrder() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    function handleSubmit(e) {
        e.preventDefault();
        if (!query) {
            alert('Please, inform the order id!')
            return;
        }
        navigate(`/order/${query}`);
        setQuery('');
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                className="px-4 py-2 text-sm duration-300 bg-yellow-100 rounded-full w-28 sm:w-64 sm:focus:w-72 placeholder:text-stone-400 transition:all focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                type="text"
                placeholder="Filter orders..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    )
}

export default SearchOrder
