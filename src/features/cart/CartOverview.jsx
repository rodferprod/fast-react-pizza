import { Link } from "react-router-dom";

function CartOverview() {
    return (
        <div className="px-4 py-4 uppercase bg-stone-800 text-stone-200">
            <p className="space-x-4 font-semibold text-stone-300">
                <span>23 pizzas</span>
                <span>$23.45</span>
            </p>
            <Link to="/cart">Open cart &rarr;</Link>
        </div>
    );
}

export default CartOverview;
