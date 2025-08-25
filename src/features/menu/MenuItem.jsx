import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { addItem } from "../cart/cartSlice";

function MenuItem({ pizza }) {
    const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

    const dispatch = useDispatch();

    function handleAddToCart() {
        const newItem = {
            pizzaId: id,
            name,
            quantity: 1,
            unitPrice,
            totalPrice: unitPrice * 1,
        }
        dispatch(addItem(newItem));
    }

    return (
        <li className="flex gap-4 py-2">
            <img src={imageUrl} alt={name} className={`h-24 ${soldOut ? 'grayscale opacity-70' : ''}`} />
            <div className="flex flex-col grow pt-0.5">
                <p className="font-medium">{name}</p>
                <p className="text-sm italic capitalize text-stone-500">{ingredients.join(', ')}</p>
                <div className="flex items-center justify-between mt-auto">
                    {!soldOut ? <p className="text-sm">{formatCurrency(unitPrice)}</p> : <p className="text-sm uppercase text-stone-500">Sold out</p>}
                    {!soldOut && <Button type="small" onClick={handleAddToCart}>Add to cart</Button>}
                </div>
            </div>
        </li>
    );
}

export default MenuItem;
