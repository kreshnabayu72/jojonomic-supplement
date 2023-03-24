import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileSaver from "file-saver";
import XLSX from "sheetjs-style";

function DetailOrderPage() {
  const [list, setList] = useState();
  const [dataFaktur, setDataFaktur] = useState();
  const [dataBTB, setDataBTB] = useState();
  const [dataPO, setDataPO] = useState();

  const params = useParams();

  useEffect(() => {
    const fetchDetailOrder = async () => {
      const result = await axios.get(
        "https://gateway.jojonomic.com/v1/nocode/api/ims/detail-order"
      );
      const data = await result.data.filter(
        (detailOrder) => detailOrder.id_order.id === params.id
      );
      await setList(data);
    };
    fetchDetailOrder();
  }, []);

  useEffect(() => {
    if (list) {
      let btb = list.map((detailOrder, index) => {
        return {
          No: index + 1,
          plu: detailOrder.plu,
          Barang: detailOrder.nama_produk,
          unit: detailOrder.unit,
          QTY: "",
          harga: detailOrder.harga,
          jumlah: "",
        };
      });
      setDataBTB(btb);
      let faktur = list.map((detailOrder, index) => {
        return {
          No: index + 1,
          plu: detailOrder.plu,
          Barang: detailOrder.nama_produk,
          unit: detailOrder.unit,
          QTY: "",
          harga: detailOrder.harga,
          jumlah: detailOrder.total,
        };
      });
      setDataFaktur(faktur);

      let dataPO = list.map((detail, index) => {
        return {
          No: index + 1,
          Tanggal: new Date(detail.tanggal).toLocaleDateString(),
          Produk: detail.id_produk.name,
          PLU: detail.plu,
          Harga: detail.harga,
          Quantity: detail.jumlah_barang,
          Unit: detail.unit,
          Total: detail.total,
        };
      });
      setDataPO(dataPO);
    }
  }, [list]);

  const ExportExcel = (excelData, name) => {
    const fileType =
      "application/vnc.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const exportToExcel = async () => {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] }; //sheetnamesnya kalo diganti jadi kosong (?????)
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = await new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, `${list[0].id_order.name}-${name}.xlsx`);
    };
    exportToExcel();
  };

  const DetailOrderList = () => {
    if (list && list.length > 0)
      return list.map((detail, index) => {
        return (
          <tr>
            <td>{index + 1}</td>
            <td>{new Date(detail.tanggal).toLocaleDateString()}</td>
            <td>{detail.id_order.name}</td>
            <td>{detail.id_buyer.name}</td>
            <td>{detail.id_produk.name}</td>
            <td>{detail.plu}</td>
            <td>{detail.harga}</td>
            <td>{detail.jumlah_barang}</td>
            <td>{detail.unit}</td>
            <td>{detail.total}</td>
          </tr>
        );
      });
    else return <h1>Loading items...</h1>;
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>NomorPO</th>
            <th>Buyer</th>
            <th>Produk</th>
            <th>PLU</th>
            <th>Harga</th>
            <th>Jumlah Barang</th>
            <th>Unit</th>
            <th>Total Harga</th>
          </tr>
        </thead>
        <tbody>
          <DetailOrderList />
        </tbody>
      </table>
      <h1>Download:</h1>
      <button onClick={() => ExportExcel(dataBTB, "BTB")}>BTB</button>
      <button onClick={() => ExportExcel(dataFaktur, "Faktur")}>Faktur</button>
      <button onClick={() => ExportExcel(dataPO, "PO")}>DataPO</button>
    </>
  );
}

export default DetailOrderPage;
