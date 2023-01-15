import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileSaver from "file-saver";
import XLSX from "sheetjs-style";

function DetailOrderPage() {
  const [list, setList] = useState();
  const [dataFaktur, setDataFaktur] = useState();
  const [dataBTB, setDataBTB] = useState();

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
          plu: "BLOM",
          Barang: detailOrder.nama_produk,
          unit: detailOrder.unit,
          QTY: detailOrder.jumlah_barang,
          "QTY Di Terima": "",
          harga: detailOrder.harga,
          jumlah: "",
        };
      });
      setDataBTB(btb);
    }
  }, [list]);

  const ExportExcel = (excelData) => {
    const fileType =
      "application/vnc.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const exportToExcel = async () => {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = await new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, `${list[0].id_order.name}.xlsx`);
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
      DetailOrderPage
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>NomorPO</th>
            <th>Buyer</th>
            <th>Produk</th>
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
      <button onClick={() => ExportExcel(dataBTB)}>EXCEL?</button>
    </>
  );
}

export default DetailOrderPage;
