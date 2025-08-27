import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import { useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    );

function CreateOrder() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const formErrors = useActionData();

    const username = useSelector((state) => state.user.username);

    const [withPriority, setWithPriority] = useState(false);

    // When passing a selector function to the useSelector hook, the function is called with the current Redux store state.
    // A common error is to execute the selector function inside de useSelector hook - useSelector(getCart()) - which would result in an error not easy to debug.
    const cart = useSelector(getCart);

    const totalCartPrice = useSelector(getTotalCartPrice);
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
    const totalPrice = totalCartPrice + priorityPrice;

    if (!cart.length) return <EmptyCart />

    const inputGroup = "flex flex-col gap-2 mb-5 sm:flex-row sm:items-center";

    return (
        <div className="px-4 py-6">
            <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

            { /* <Form method="POST" action="/order/new"> */}
            <Form method="POST">
                <div className={inputGroup}>
                    <label className="sm:basis-40">First Name</label>
                    <input
                        className="input-text grow"
                        type="text"
                        defaultValue={username}
                        name="customer"
                        required />
                </div>

                <div className={inputGroup}>
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input
                            className="w-full input-text"
                            type="tel"
                            name="phone"
                            required />
                        {formErrors?.phone && (
                            <p role="alert" className="p-2 mt-2 text-xs text-red-700 bg-red-200 rounded-md">{formErrors.phone}</p>
                        )}
                    </div>
                </div>

                <div className={inputGroup}>
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            className="w-full input-text"
                            type="text" name="address" required />
                    </div>
                </div>

                <div className="flex items-center gap-5 mb-12">
                    <input
                        className="w-6 h-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
                </div>

                <div>
                    <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                    <Button type="large" disabled={isSubmitting}>
                        {isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === "true"
    }
    const errors = {};
    if (!isValidPhone(order.phone)) {
        errors.phone = "Phone number is not valid";
    }
    if (Object.keys(errors).length > 0) {
        return errors;
    }
    const newOrder = await createOrder(order);

    // Clear the cart like that will deactivate some performance optimizations Redux provides on this page
    // DO NOT OVERUSE THIS TECHNIQUE
    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
