import { useState } from 'react';
import { db } from './firebase';
import { ref, push } from 'firebase/database';
import { useAuth } from './AuthContext';

export default function OrderForm({ product, closeModal }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill out all fields.');
      return;
    }

    const orderData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      customerDetails: formData,
      orderDate: new Date().toISOString(),
    };

    const ordersRef = ref(db, 'orders');
    push(ordersRef, orderData)
      .then(() => {
        alert('Order placed successfully!');
        closeModal();
      })
      .catch((error) => {
        alert('Failed to place order.');
        console.error('Order Error:', error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        <button onClick={closeModal} className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Order: {product.title}</h2>
        <p className="text-lg font-semibold text-indigo-600 mb-6">Price: ₹{product.price}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full p-3 border rounded-lg text-gray-900" />
          <textarea name="address" placeholder="Shipping Address" required onChange={handleChange} className="w-full p-3 border rounded-lg text-gray-900" />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} className="w-full p-3 border rounded-lg text-gray-900" />
          <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">Confirm Purchase</button>
        </form>
      </div>
    </div>
  );
}