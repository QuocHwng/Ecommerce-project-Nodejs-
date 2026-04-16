import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaTruck } from 'react-icons/fa';

const AdminShippingPage = () => {
    const [methods, setMethods] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [time, setTime] = useState('');

    const fetchMethods = async () => {
        const { data } = await axios.get('http://localhost:5000/api/shipping');
        setMethods(data);
    };

    useEffect(() => { fetchMethods(); }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.post('http://localhost:5000/api/shipping', { name, price, estimatedTime: time }, config);
        fetchMethods();
        setName(''); setPrice(0); setTime('');
    };

    const deleteHandler = async (id) => {
        if(window.confirm('Xóa phương thức này?')) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`http://localhost:5000/api/shipping/${id}`, config);
            fetchMethods();
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Thêm */}
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 h-fit">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaPlus /> Thêm gói vận chuyển</h2>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold">Tên gói (VD: Hỏa tốc)</label>
                        <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Phí ship (VNĐ)</label>
                        <input type="number" className="w-full border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Thời gian ước tính (VD: 1-2 ngày)</label>
                        <input className="w-full border p-2 rounded" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>
                    <button className="bg-blue-600 text-white w-full py-2 rounded font-bold hover:bg-blue-700">Lưu cấu hình</button>
                </form>
            </div>

            {/* Danh sách */}
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaTruck /> Danh sách gói vận chuyển</h2>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 font-bold text-xs uppercase">
                        <tr>
                            <th className="p-3">Tên gói</th>
                            <th className="p-3">Giá</th>
                            <th className="p-3">Thời gian</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {methods.map(m => (
                            <tr key={m._id} className="border-b">
                                <td className="p-3 font-bold">{m.name}</td>
                                <td className="p-3">{m.price.toLocaleString()}đ</td>
                                <td className="p-3 text-sm text-slate-500">{m.estimatedTime}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => deleteHandler(m._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminShippingPage;