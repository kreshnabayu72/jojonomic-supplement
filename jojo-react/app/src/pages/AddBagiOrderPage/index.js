import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderTable from "./OrderTable";
import SelectedOrderTable from "./SelectedOrderTable";
import TotalOrderTable from "./TotalOrderTable";
// import ResultTable from "./ResultTable";
import Loading from "../../components/Loading";

function BagiOrderPage() {
  const [order, setOrder] = useState([]);
  const [detailSupplier, setDetailSupplier] = useState([]);
  const [listDetailTotal, setListDetailTotal] = useState([]);
  const [hasilPembagian, setHasilPembagian] = useState([]);
  const [kekuranganSupplier, setKekuranganSupplier] = useState([]);

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingTotalOrder, setLoadingTotalOrder] = useState(false);
  const [loadingDetailSupplier, setLoadingDetailSupplier] = useState(false);
  const [loadingHasilPembagian, setLoadingHasilPembagian] = useState(false);
  const [loadingNewSupplier, setLoadingNewSupplier] = useState(false);
  const [showTotal, setShowTotal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState([]);

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

  const ResultTable = () => {
    const ResultList = () => {
      if (hasilPembagian && hasilPembagian.length > 0) {
        return hasilPembagian.map((oneHasil, index) => {
          if (oneHasil.jumlah > 0)
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{oneHasil["id_supplier"]["name"] || ""}</td>
                <td>{oneHasil["id_produk"]["name"] || ""}</td>
                <td>{oneHasil["jumlah"]}</td>
                <td>{oneHasil["unit"]}</td>
              </tr>
            );
          else return <tr key={index}>Data pembagian kosong</tr>;
        });
      }
    };
    const KoreksiList = () => {
      if (kekuranganSupplier && kekuranganSupplier.length > 0) {
        return kekuranganSupplier.map((oneHasil, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{oneHasil?.id_produk.name || ""}</td>
              <td>{oneHasil?.jumlah}</td>
              <td>{oneHasil?.unit}</td>
            </tr>
          );
        });
      }
    };

    const PembagianTable = () => {
      if (hasilPembagian && hasilPembagian.length > 0)
        return (
          <div>
            <h4>Pembagian Per Supplier</h4>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Supplier</th>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                <ResultList />
              </tbody>
            </table>
          </div>
        );
    };

    const KoreksiTable = () => {
      if (kekuranganSupplier && kekuranganSupplier.length > 0)
        return (
          <div>
            <h4>Koreksi/Kekurangan</h4>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                <KoreksiList />
              </tbody>
            </table>
          </div>
        );
    };

    return (
      <>
        <PembagianTable />
        <KoreksiTable />
      </>
    );
  };

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
    setListDetailTotal(result2.data);
  };

  Array.prototype.flatten = function () {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
      if (Array.isArray(this[i])) {
        ret = ret.concat(this[i].flatten());
      } else {
        ret.push(this[i]);
      }
    }
    return ret;
  };

  const BagiPesananHandler = async (listDetailTotal, selectedSupplier) => {
    const sumData = selectedSupplier.map((productSuppliers) => {
      return productSuppliers.reduce(
        (a, b) => {
          return { ...b, jumlah: a.jumlah + b.jumlah };
        },
        { jumlah: 0 }
      );
    });

    const kurang = [...listDetailTotal]
      .map((totalOrder, index) => {
        console.log("sumData[index].jumlah", sumData[index].jumlah);
        console.log("index", index);
        console.log("sumdata", sumData);
        let jumlah_kurang = totalOrder.jumlah_barang - sumData[index].jumlah;

        if (jumlah_kurang > 0) {
          return {
            id_produk: totalOrder.id_produk,
            id_supplier: { id: false, name: "Koreksi" },
            unit: totalOrder.unit,
            jumlah: jumlah_kurang,
          };
        } else if (jumlah_kurang < 0) {
          console.log("JUMLAHKURANG", jumlah_kurang);
          console.log("totalorderjumlah", totalOrder.jumlah_barang);

          //Jangan post harusnya
          return {
            id_produk: totalOrder.id_produk,
            id_supplier: { id: false, name: "Kelebihan Supply" },
            unit: totalOrder.unit,
            jumlah: -1 * jumlah_kurang,
          };
        } else {
          return {
            id_produk: totalOrder.id_produk,
            id_supplier: { id: false, name: false },
            unit: totalOrder.unit,
            jumlah: 0,
          };
        }
      })
      .filter((kurang) => kurang.jumlah !== null && kurang.jumlah !== 0);

    const processedData = await selectedSupplier
      .flatten()
      .filter((data) => data.id_supplier.id !== false);

    console.log("processed", processedData);
    console.log("kurang", kurang);

    const fullData = [...processedData, ...kurang];

    setLoadingHasilPembagian(true);
    await axios.post("https://api-oos.jojonomic.com/26036/pemenuhan-pesanan", {
      result: fullData,
    });

    setKekuranganSupplier(kurang);
    setHasilPembagian(processedData);
    setLoadingHasilPembagian(false);
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
        BagiPesananHandler={BagiPesananHandler}
        loadingTotalOrder={loadingTotalOrder}
        detailSupplier={detailSupplier}
        loadingNewSupplier={loadingNewSupplier}
      />
      <Loading isLoading={loadingHasilPembagian} />
      <ResultTable />
    </>
  );
}

export default BagiOrderPage;
