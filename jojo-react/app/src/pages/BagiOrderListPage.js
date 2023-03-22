import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BagiOrderListPage() {
  const [pemenuhanOrder, setPemenuhanOrder] = useState([]);
  const [loadingPemenuhanOrder, setLoadingPemenuhanOrder] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingPemenuhanOrder(true);
      const result = await axios.get(
        "https://api-oos.jojonomic.com/26036/pemenuhan"
      );
      setLoadingPemenuhanOrder(false);
      setPemenuhanOrder(result.data);
    };
    fetchOrder();
  }, []);

  const PemenuhanOrderList = () => {
    if (pemenuhanOrder && pemenuhanOrder.length > 0) {
      return pemenuhanOrder.map((oneOrder, index) => {
        return (
          <tr
            className="hover-pointer"
            onClick={() => nav(`/pemenuhanOrder/${oneOrder.id}`)}
          >
            <td>{index + 1}</td>
            <td>{oneOrder.id}</td>
            <td>{`${new Date(oneOrder.created_at).toLocaleDateString(
              "en-gb"
            )} ${new Date(oneOrder.created_at).toLocaleTimeString()}`}</td>
          </tr>
        );
      });
    }
  };

  const PemenuhanOrderStatus = () => {
    if (loadingPemenuhanOrder) return <h4>Loading Pemenuhan Order..</h4>;
    else if (pemenuhanOrder.length == 0) return <h4>List Empty</h4>;
  };

  return (
    <>
      List Pemenuhan Order
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Tanggal Dibuat</th>
          </tr>
        </thead>
        <tbody>
          <PemenuhanOrderList />
          <PemenuhanOrderStatus />
        </tbody>
      </table>
    </>
  );
}

export default BagiOrderListPage;
