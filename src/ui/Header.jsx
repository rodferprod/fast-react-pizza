import { Link } from "react-router-dom"
import SearchOrder from "../features/order/SearchOrder"
import Username from "../features/user/Username"

function Header() {
    return (
        <header className="px-4 py-3 uppercase bg-yellow-500 border-b-2 border-stone-300">
            <Link to="/" className="tracking-widest">Fast React Pizza Co.</Link>
            <SearchOrder />
            <Username />
        </header>
    )
}

export default Header
