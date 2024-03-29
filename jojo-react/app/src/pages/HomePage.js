import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [order, setOrder] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const nav = useNavigate();

  const fetchOrder = async (filter = {}) => {
    setLoadingOrder(true);
    let result = await axios.get(
      "https://gateway.jojonomic.com/v1/nocode/api/ims/order"
    );
    result = result.data.sort((a, b) => b.created_at - a.created_at);

    if (filter.fromDate) {
      result = await result.filter((data) => data.created_at < filter.fromDate);
    }

    setOrder(result);
    setLoadingOrder(false);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const OrderList = () => {
    if (order && order.length > 0) {
      return order.map((oneOrder, index) => {
        return (
          <tr
            className="hover-pointer"
            onClick={() => nav(`/order/${oneOrder.id}`)}
            key={index}
          >
            <td>{index + 1}</td>
            <td>{oneOrder.id}</td>
            <td>{oneOrder.nomorpo}</td>
            <td>{new Date(oneOrder.tanggal).toLocaleDateString()}</td>
            <td>
              {new Date(oneOrder.created_at).toLocaleDateString("en-gb")}{" "}
              {new Date(oneOrder.created_at).toLocaleTimeString("en-gb")}
            </td>
          </tr>
        );
      });
    }
  };

  const OrderStatus = () => {
    if (loadingOrder)
      return (
        <tr>
          <td>
            <h4>Loading Order..</h4>
          </td>
        </tr>
      );
    else if (order.length == 0)
      return (
        <tr>
          <td>
            <h4>List Empty</h4>
          </td>
        </tr>
      );
  };

  return (
    <>
      <h4 className="mt-2">LIST ORDER</h4>

      <div className="row">
        <div className="col-3 mt-auto">
          <div className="row justify-content-center">
            <button>Seminggu Terakhir</button>
            <button>Sebulan Terakhir</button>
          </div>
        </div>
        <div className="col-2 d-flex flex-column">
          <label htmlFor="month-select"> Pilih Bulan & Tahun</label>
          <input type="month" name="month-select" id="month-select" />
          <button onClick={() => fetchOrder({ fromDate: 1679275387206 })}>
            Filter
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Nomor PO</th>
            <th>Tanggal Order</th>
            <th>Tanggal Upload</th>
          </tr>
        </thead>
        <tbody>
          <OrderList />
          <OrderStatus />
        </tbody>
      </table>
    </>
  );
}

export default HomePage;
