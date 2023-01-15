import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [order, setOrder] = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await axios.get(
        "https://gateway.jojonomic.com/v1/nocode/api/ims/order"
      );
      setOrder(result.data);
    };
    fetchOrder();
  }, []);

  const OrderList = () => {
    if (order && order.length != 0) {
      return order.map((oneOrder, index) => {
        console.log(oneOrder);
        return (
          <tr
            className="hover-pointer"
            onClick={() => nav(`/order/${oneOrder.id}`)}
          >
            <td>{index + 1}</td>
            <td>{oneOrder.id}</td>
            <td>{oneOrder.nomorpo}</td>
            <td>{new Date(oneOrder.tanggal).toLocaleDateString()}</td>
          </tr>
        );
      });
    } else {
      return <h4>Loading Order..</h4>;
    }
  };

  return (
    <>
      HomePage
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Nomor PO</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <OrderList />
        </tbody>
      </table>
    </>
  );
}

export default HomePage;
