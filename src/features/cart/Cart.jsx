import Button from '../../ui/Button';
import LinkButton from '../../ui/LinkButton';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, getUserName, clearCart } from './cartSlice';

function Cart() {
    const cart = useSelector(getCart);
    const username = useSelector(getUserName);
    const dispatch = useDispatch();

    if (!cart.length) return <EmptyCart />;
    return (
        <div className='px-4 py-3'>
            <LinkButton to="/menu">&larr; Back to menu</LinkButton>

            <h2 className='text-xl font-semibold mt-7'>Your cart, {username}</h2>

            <ul className='mt-3 border-b divide-y divide-stone-200'>
                {cart.map(item => <CartItem key={item.pizzaId} item={item} />)}
            </ul>

            <div className='mt-6 space-x-2'>
                <Button type="large" to="/order/new">Order pizzas</Button>
                <Button type="default" onClick={() => dispatch(clearCart())}>Clear cart</Button>
            </div>
        </div >
    );
}

export default Cart;
