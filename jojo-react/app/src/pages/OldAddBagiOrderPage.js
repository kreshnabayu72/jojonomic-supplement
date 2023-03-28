import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OldAddBagiOrderPage() {
  const [order, setOrder] = useState([]);
  const [detailSupplier, setDetailSupplier] = useState([]);
  const [listDetailTotal, setListDetailTotal] = useState([]);
  const [hasilPembagian, setHasilPembagian] = useState([]);

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingTotalOrder, setLoadingTotalOrder] = useState(false);
  const [loadingDetailSupplier, setLoadingDetailSupplier] = useState(false);
  const [loadingHasilPembagian, setLoadingHasilPembagian] = useState(false);
  const [showTotal, setShowTotal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedDetailSupplier, setSelectedDetailSupplier] = useState([]);

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

  const AddOrRemoveButton = ({ item, array, setFunction }) => {
    if (array.indexOf(item) === -1)
      return (
        <button
          onClick={() => {
            setFunction([...array, item]);
          }}
        >
          +
        </button>
      );
    else {
      return (
        <button
          onClick={() => {
            setFunction(array.filter((eachItem) => eachItem !== item));
          }}
        >
          -
        </button>
      );
    }
  };

  // Tables
  const SelectedOrderTable = () => {
    const SelectedOrderList = () => {
      if (selectedOrder && selectedOrder.length > 0) {
        return selectedOrder.map((oneOrder, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{oneOrder.id}</td>
              <td>{oneOrder.nomorpo}</td>
              <td>{new Date(oneOrder.tanggal).toLocaleDateString()}</td>
            </tr>
          );
        });
      }
    };
    if (selectedOrder.length > 0)
      return (
        <>
          <h1>SELECTED ORDER:</h1>
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
              <SelectedOrderList />
            </tbody>
          </table>
          <button onClick={OrderTotalHandler}>Show Total</button>
        </>
      );
  };

  const OrderTable = () => {
    const OrderStatus = () => {
      if (loadingOrder)
        return (
          <tr>
            <td> Loading Order..</td>
          </tr>
        );
      else if (order.length === 0)
        return (
          <tr>
            <td>List Empty</td>
          </tr>
        );
    };
    const OrderList = () => {
      if (order && order.length > 0) {
        return order.map((oneOrder, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{oneOrder.id}</td>
              <td>{oneOrder.nomorpo}</td>
              <td>{new Date(oneOrder.tanggal).toLocaleDateString()}</td>
              <td>
                <AddOrRemoveButton
                  item={oneOrder}
                  array={selectedOrder}
                  setFunction={setSelectedOrder}
                />
              </td>
            </tr>
          );
        });
      }
    };

    return (
      <>
        <h1>ORDER LIST:</h1>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Nomor PO</th>
              <th>Tanggal</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            <OrderList />
            <OrderStatus />
          </tbody>
        </table>
      </>
    );
  };

  const TotalOrderTable = () => {
    const TotalOrderList = () => {
      return listDetailTotal.map((detailTotal, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{new Date(detailTotal.created_at).toLocaleString("en-GB")}</td>
            <td>{detailTotal.id_produk.name}</td>
            <td>{detailTotal.jumlah_barang}</td>
            <td>{detailTotal.unit}</td>
          </tr>
        );
      });
    };

    if (listDetailTotal.length > 0) {
      return (
        <>
          <h1>TOTAL PESANAN UNTUK DIBAGI:</h1>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Waktu Dibuat</th>
                <th>Produk</th>
                <th>Jumlah Barang</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <TotalOrderList />
            </tbody>
          </table>
          <h1>Pilih Supplier:</h1>
        </>
      );
    }
  };

  const SupplierTable = () => {
    const SupplierStatus = () => {
      if (loadingDetailSupplier) {
        return (
          <tr>
            <td>Loading supplier</td>
          </tr>
        );
      }
    };

    const SupplierList = () => {
      if (detailSupplier && detailSupplier.length > 0) {
        return detailSupplier.map((oneDetailSupplier, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{oneDetailSupplier.id_supplier.name}</td>
              <td>{oneDetailSupplier.id_produk.name}</td>
              <td>
                <AddOrRemoveButton
                  item={oneDetailSupplier}
                  array={selectedDetailSupplier}
                  setFunction={setSelectedDetailSupplier}
                />
              </td>
            </tr>
          );
        });
      }
    };

    if (listDetailTotal.length > 0)
      return (
        <>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Nama Produk</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              <SupplierList />
              <SupplierStatus />
            </tbody>
          </table>
        </>
      );
  };

  const SelectedSupplierTable = () => {
    const SelectedSupplierList = () => {
      if (selectedDetailSupplier && selectedDetailSupplier.length > 0) {
        return selectedDetailSupplier.map((oneDetailSupplier, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{oneDetailSupplier.id_supplier.name}</td>
              <td>{oneDetailSupplier.id_produk.name}</td>
            </tr>
          );
        });
      }
    };

    if (selectedDetailSupplier.length > 0)
      return (
        <>
          <h1>SELECTED SUPPLIER:</h1>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Produk</th>
              </tr>
            </thead>
            <tbody>
              <SelectedSupplierList />
            </tbody>
          </table>
          <button onClick={BagiPesananHandler}>Bagi Pesanan</button>
        </>
      );
  };

  const ResultTable = () => {
    const ResultList = () => {
      if (hasilPembagian && hasilPembagian.length > 0) {
        return hasilPembagian.map((oneHasil, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{oneHasil["id_supplier"]["name"]}</td>
              <td>{oneHasil["id_produk"]["name"]}</td>
              <td>{oneHasil["jumlah"]}</td>
            </tr>
          );
        });
      }
    };

    if (hasilPembagian && hasilPembagian.length > 0)
      return (
        <>
          <h1>Hasil Pembagian:</h1>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Supplier</th>
                <th>Produk</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <ResultList />
            </tbody>
          </table>
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

  const BagiPesananHandler = async () => {
    const jumlahSupplierPerBarang = selectedDetailSupplier.reduce(
      (a, { id_produk }) =>
        (a[id_produk.name] = a[id_produk.name] + 1 || 1) && a,
      {}
    );

    // const resultPembagian = selectedDetailSupplier.map((supplier) => {
    //   //Ngemap per selected detail supplier salah
    //   const oneDetailTotal = listDetailTotal.find(
    //     (detailTotal) => detailTotal.id_produk.name == supplier.id_produk.name
    //   );

    //   if (jumlahSupplierPerBarang[supplier.id_produk.name] > 0)
    //     return {
    //       id_supplier: supplier.id_supplier,
    //       id_produk: supplier.id_produk,
    //       jumlah:
    //         oneDetailTotal.jumlah_barang /
    //         jumlahSupplierPerBarang[supplier.id_produk.name],
    //       unit: oneDetailTotal.unit,
    //     };
    //   else
    //     return {
    //       id_supplier: { id: "none", name: "Kekurangan" },
    //       id_produk: supplier.id_produk,
    //       jumlah:
    //         oneDetailTotal.jumlah_barang /
    //         jumlahSupplierPerBarang[supplier.id_produk.name],
    //       unit: oneDetailTotal.unit,
    //     };
    // });

    let resultPembagian = [];
    listDetailTotal.map((detailTotal) => {
      const detailSuppliers = selectedDetailSupplier.filter(
        (e) => e.id_produk.name === detailTotal.id_produk.name
      );

      console.log(detailSuppliers);
      if (
        jumlahSupplierPerBarang[detailTotal.id_produk.name] > 0 &&
        detailSuppliers.length > 0
      ) {
        detailSuppliers.map((detailSupplier) => {
          resultPembagian.push({
            id_supplier: detailSupplier.id_supplier,
            id_produk: detailSupplier.id_produk,
            unit: detailTotal.unit,
            jumlah:
              detailTotal.jumlah_barang /
              jumlahSupplierPerBarang[detailTotal.id_produk.name],
          });
        });
      } else {
        console.log("DETAIL TOTAL ELSE:");
        console.log(detailTotal);
        resultPembagian.push({
          id_supplier: { id: "NONE", name: "KEKURANGAN" },
          id_produk: detailTotal.id_produk,
          unit: detailTotal.unit,
          jumlah: detailTotal.jumlah_barang,
        });
      }
    });

    const ObjekHasil = {
      result: resultPembagian,
    };

    console.log(resultPembagian);

    setLoadingHasilPembagian(true);
    await axios.post(
      "https://api-oos.jojonomic.com/26036/pemenuhan-pesanan",
      ObjekHasil
    );
    setLoadingHasilPembagian(false);
    setHasilPembagian(resultPembagian);
    console.log("Posted");
  };

  //Loading
  const LoadingTotalOrder = () => {
    if (loadingTotalOrder) {
      return <h1>LOADING TOTAL ORDER...</h1>;
    }
  };
  const LoadingHasilPembagian = () => {
    if (loadingHasilPembagian) {
      return <h1>LOADING HASIL PEMBAGIAN...</h1>;
    }
  };

  return (
    <>
      <button onClick={() => nav("/bagi-order/list")}>
        Histori Pembagian Order
      </button>
      <OrderTable />
      <SelectedOrderTable />
      <LoadingTotalOrder />
      <TotalOrderTable />
      <SupplierTable />
      <SelectedSupplierTable />
      <LoadingHasilPembagian />
      <ResultTable />
    </>
  );
}

export default OldAddBagiOrderPage;
