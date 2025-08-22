import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    );

const fakeCart = [
    {
        pizzaId: 12,
        name: "Mediterranean",
        quantity: 2,
        unitPrice: 16,
        totalPrice: 32,
    },
    {
        pizzaId: 6,
        name: "Vegetale",
        quantity: 1,
        unitPrice: 13,
        totalPrice: 13,
    },
    {
        pizzaId: 11,
        name: "Spinach and Mushroom",
        quantity: 1,
        unitPrice: 15,
        totalPrice: 15,
    },
];

function CreateOrder() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const formErrors = useActionData();

    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    return (
        <div>
            <h2>Ready to order? Let's go!</h2>

            { /* <Form method="POST" action="/order/new"> */}
            <Form method="POST">
                <div>
                    <label>First Name</label>
                    <input type="text" name="customer" required />
                </div>

                <div>
                    <label>Phone number</label>
                    <div>
                        <input type="tel" name="phone" required />
                    </div>
                    {formErrors?.phone && (
                        <p role="alert">{formErrors.phone}</p>
                    )}
                </div>

                <div>
                    <label>Address</label>
                    <div>
                        <input
                            className="w-full px-4 py-2 text-sm transition-all duration-300 border rounded-full md:px-6 md:py-3 border-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-400"
                            type="text" name="address" required />
                    </div>
                </div>

                <div>
                    <input
                        className="w-6 h-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        type="checkbox"
                        name="priority"
                        id="priority"
                    // value={withPriority}
                    // onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label htmlFor="priority">Want to yo give your order priority?</label>
                </div>

                <div>
                    <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                    <button className="px-4 py-3 font-semibold tracking-wide uppercase transition-colors duration-300 bg-yellow-400 rounded-full text-stone-800 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed" disabled={isSubmitting}>
                        {isSubmitting ? "Placing order..." : "Order now"}
                    </button>
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
        priority: data.priority === "on"
    }
    const errors = {};
    if (!isValidPhone(order.phone)) {
        errors.phone = "Phone number is not valid";
    }
    if (Object.keys(errors).length > 0) {
        return errors;
    }
    const newOrder = await createOrder(order);
    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
