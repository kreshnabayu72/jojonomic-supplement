import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderTable from "./OrderTable";
import SelectedOrderTable from "./SelectedOrderTable";
import TotalOrderTable from "./TotalOrderTable";
import ResultTable from "./ResultTable";

function BagiOrderPage() {
  const [order, setOrder] = useState([]);
  const [detailSupplier, setDetailSupplier] = useState([]);
  const [listDetailTotal, setListDetailTotal] = useState([]);
  const [hasilPembagian, setHasilPembagian] = useState([]);

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingTotalOrder, setLoadingTotalOrder] = useState(false);
  const [loadingDetailSupplier, setLoadingDetailSupplier] = useState(false);
  const [loadingHasilPembagian, setLoadingHasilPembagian] = useState(false);
  const [loadingNewSupplier, setLoadingNewSupplier] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedHasilPembagian, setSelectedHasilPembagian] = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true);
      const result = await axios.get(
        "https://gateway.jojonomic.com/v1/nocode/api/ims/order"
      );
      setLoadingOrder(false);
      setOrder(result.data);
    };

    const fetchDetailSupplier = async () => {
      setLoadingDetailSupplier(true);
      const result = await axios.get(
        "https://api-oos.jojonomic.com/26036/detail-supplier"
      );
      setLoadingDetailSupplier(false);
      setDetailSupplier(result.data);
    };

    fetchOrder();
    fetchDetailSupplier();
  }, []);

  // Handlers
  const OrderTotalHandler = async () => {
    setShowTotal(!showTotal);

    let url =
      "https://api-oos.jojonomic.com/26036/ims/pembagian/detail-orders?";

    await selectedOrder.map((order, index) => {
      if (index > 0) url += "&";
      url += `id_order=${order.id_order}`;
    });

    setLoadingTotalOrder(true);
    const { data } = await axios.get(url);
    setLoadingTotalOrder(false);

    setLoadingTotalOrder(true);
    const result2 = await axios.get(
      `https://api-oos.jojonomic.com/26036/detail-total-order?totalOrder=${data.id_total_order_pembagian}`
    );

    setLoadingTotalOrder(false);

    setListDetailTotal(
      result2.data.map((total) => {
        return {
          ...total,
          supplier: [
            {
              id_supplier: { id: false, name: false },
              id_produk: total.id_produk,
              unit: total.unit,
              jumlah: 0,
            },
          ],
        };
      })
    );
  };

  const BagiPesananHandler = async () => {
    console.log("bagipesanan", selectedHasilPembagian);
    // const jumlahSupplierPerBarang = selectedDetailSupplier.reduce(
    //   (a, { id_produk }) =>
    //     (a[id_produk.name] = a[id_produk.name] + 1 || 1) && a,
    //   {}
    // );
    // let resultPembagian = [];
    // listDetailTotal.map((detailTotal) => {
    //   const detailSuppliers = selectedDetailSupplier.filter(
    //     (e) => e.id_produk.name === detailTotal.id_produk.name
    //   );
    //   if (
    //     jumlahSupplierPerBarang[detailTotal.id_produk.name] > 0 &&
    //     detailSuppliers.length > 0
    //   ) {
    //     detailSuppliers.map((detailSupplier) => {
    //       resultPembagian.push({
    //         id_supplier: detailSupplier.id_supplier,
    //         id_produk: detailSupplier.id_produk,
    //         unit: detailTotal.unit,
    //         jumlah:
    //           detailTotal.jumlah_barang /
    //           jumlahSupplierPerBarang[detailTotal.id_produk.name],
    //       });
    //     });
    //   } else {
    //     resultPembagian.push({
    //       id_supplier: { id: "NONE", name: "KEKURANGAN" },
    //       id_produk: detailTotal.id_produk,
    //       unit: detailTotal.unit,
    //       jumlah: detailTotal.jumlah_barang,
    //     });
    //   }
    // });
    // const ObjekHasil = {
    //   result: resultPembagian,
    // };
    // setLoadingHasilPembagian(true);
    // await axios.post(
    //   "https://api-oos.jojonomic.com/26036/pemenuhan-pesanan-old",
    //   ObjekHasil
    // );
    // setLoadingHasilPembagian(false);
    // setHasilPembagian(resultPembagian);
  };

  return (
    <>
      <button onClick={() => nav("/bagi-order/list")}>
        Histori Pembagian Order
      </button>
      <OrderTable
        loadingOrder={loadingOrder}
        order={order}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
      <SelectedOrderTable
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        OrderTotalHandler={OrderTotalHandler}
        loadingTotalOrder={loadingTotalOrder}
      />
      <TotalOrderTable
        listDetailTotal={listDetailTotal}
        setListDetailTotal={setListDetailTotal}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        BagiPesananHandler={BagiPesananHandler}
        loadingTotalOrder={loadingTotalOrder}
        selectedHasilPembagian={selectedHasilPembagian}
        setSelectedHasilPembagian={setSelectedHasilPembagian}
        detailSupplier={detailSupplier}
        loadingNewSupplier={loadingNewSupplier}
      />
      <ResultTable
        hasilPembagian={hasilPembagian}
        loadingHasilPembagian={loadingHasilPembagian}
      />
    </>
  );
}

export default BagiOrderPage;
