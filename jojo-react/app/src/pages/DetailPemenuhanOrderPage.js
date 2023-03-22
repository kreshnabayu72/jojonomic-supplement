import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetailPemenuhanOrderPage() {
  const [list, setList] = useState([]);

  const params = useParams();

  useEffect(() => {
    const fetchDetailPemenuhanOrder = async () => {
      const result = await axios.get(
        "https://api-oos.jojonomic.com/26036/detailPemenuhan"
      );
      const data = await result.data.filter(
        (detailPemenuhanOrder) =>
          detailPemenuhanOrder.id_pemenuhan_order.id === params.id
      );
      await setList(data);
      console.log(list);
    };
    fetchDetailPemenuhanOrder();
  }, []);

  const DetailPemenuhanOrderList = () => {
    if (list && list.length > 0) {
      return list.map((item, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.id_pemenuhan_order.id}</td>
            <td>{item.id_supplier.name}</td>
            <td>{item.id_produk.name}</td>
            <td>{item.jumlah}</td>
            <td>{item.unit}</td>
          </tr>
        );
      });
    } else {
      return <h1>Empty List</h1>;
    }
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID Pemenuhan Order</th>
            <th>Supplier</th>
            <th>Produk</th>
            <th>Jumlah Barang</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          <DetailPemenuhanOrderList />
        </tbody>
      </table>
    </>
  );
}

export default DetailPemenuhanOrderPage;
