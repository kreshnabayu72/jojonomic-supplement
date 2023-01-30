import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BagiOrderPage() {
  const [order, setOrder] = useState([]);
  const [detailSupplier, setDetailSupplier] = useState([]);
  const [listDetailTotal, setListDetailTotal] = useState([]);
  const [hasilPembagian, setHasilPembagian] = useState([]);

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingTotalOrder, setLoadingTotalOrder] = useState(false);
  const [loadingDetailSupplier, setLoadingDetailSupplier] = useState(false);
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

  const SelectedOrderTable = () => {
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

  const LoadingTotalOrder = () => {
    if (loadingTotalOrder) {
      return <h1>LOADING TOTAL ORDER</h1>;
    }
  };

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

  const TotalTable = () => {
    if (loadingTotalOrder) {
      return <LoadingTotalOrder />;
    }
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

  const SelectedSupplierTable = () => {
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

  // Onclicks
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
    //todo:
    //itung jumlah supplier per barang -> array.filter(c => c === searchvalue).length;
    const jumlahPerBarang = selectedDetailSupplier.reduce(
      (a, { id_produk }) =>
        (a[id_produk.name] = a[id_produk.name] + 1 || 1) && a,
      {}
    );

    console.log(selectedDetailSupplier);
    console.log(listDetailTotal);
    console.log(jumlahPerBarang);

    //bagi qty barang dengan jumlah supplier per barang
    //dapet qty per supplier
    //buat data: supplier barang qtypersupplier
    const resultPembagian = selectedDetailSupplier.map((supplier) => {
      return {
        "Nama Supplier": supplier.id_supplier.name,
        "Nama Produk": supplier.id_produk.name,
        "Jatah Quantity":
          listDetailTotal.find(
            (detailTotal) =>
              detailTotal.id_produk.name == supplier.id_produk.name
          ).jumlah_barang / jumlahPerBarang[supplier.id_produk.name],
      };
    });

    console.log(resultPembagian);
    setHasilPembagian(resultPembagian);

    const ObjekHasil = {
      result: resultPembagian,
    };

    console.log("posting");
    await axios.post(
      "https://api-oos.jojonomic.com/26036/pemenuhan-pesanan",
      ObjekHasil
    );
    alert("Posted");
  };

  const ResultTable = () => {
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

  const ResultList = () => {
    if (hasilPembagian && hasilPembagian.length > 0) {
      return hasilPembagian.map((oneHasil, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{oneHasil["Nama Supplier"]}</td>
            <td>{oneHasil["Nama Produk"]}</td>
            <td>{oneHasil["Jatah Quantity"]}</td>
          </tr>
        );
      });
    }
  };

  return (
    <>
      BagiOrderPage
      <OrderTable />
      <SelectedOrderTable />
      <TotalTable />
      <SupplierTable />
      <SelectedSupplierTable />
      <ResultTable />
    </>
  );
}

export default BagiOrderPage;
