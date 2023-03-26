import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BetterUploadPage() {
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [XMLString, setXMLString] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const [orderExist, setOrderExist] = useState(false);

  const nav = useNavigate();

  const reader = new FileReader();
  reader.onload = async (e) => {
    setXMLString(e.target.result);
  };

  useEffect(() => {
    if (file) {
      reader.readAsText(file);
      setDataIsLoaded(true);
    } else {
      setDataIsLoaded(false);
    }
  }, [file]);

  useEffect(() => {
    if (XMLString) {
      ParseXML();
    }
  }, [XMLString]);

  useEffect(() => {
    const fetchExistingOrder = async () => {
      setLoadingExisting(true);
      const result = await axios.get(
        `https://gateway.jojonomic.com/v1/nocode/api/ims/order/getOne?nomorPO=${data.po.po_head.po_no}`
      );
      setLoadingExisting(false);
      setOrderExist(result.data.exist);
      return result.data;
    };
    if (data) {
      fetchExistingOrder();
    }
  }, [data]);

  const ParseXML = async () => {
    const parser = new XMLParser();
    let jObj = await parser.parse(XMLString);

    if (!jObj.po || !jObj.po.po_detail) {
      alert("Format file xml berbeda");
      setFile(null);
      nav(0);
      return;
    }

    jObj.po["po_head"]["po_date"] = new Date(
      jObj.po["po_head"]["po_date"]
    ).getTime();

    setData({ po: jObj.po });
  };

  const FileHandler = (e) => {
    const file = e.target.files[0];

    if (file.type !== "text/xml") {
      alert("File bukan tipe XML!");
      setFile(null);
      return;
    }
    setFile(e.target.files[0]);
  };

  const FileUpload = () => {
    return (
      <>
        {file ? (
          <></>
        ) : (
          <>
            <h1>Upload File XML:</h1>
            <input type="file" accept=".xml" onChange={(e) => FileHandler(e)} />
          </>
        )}
      </>
    );
  };

  const DuplicateWarning = () => {
    if (orderExist)
      return (
        <p className="warning">
          ! WARNING: Order dengan Nomor PO {data.po.po_head.po_no} Sudah Ada di
          Database
        </p>
      );
    else if (!loadingExisting) {
      return <p className="success">Tidak terdeteksi masalah</p>;
    }
  };

  const DataTable = () => {
    if (data)
      return (
        <>
          <h1>Preview Data: </h1>
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
          <DuplicateWarning />
          <LoadingExisting />
          <button onClick={() => SubmitHandler()}>Submit</button>
        </>
      );
  };

  const DetailOrderList = () => {
    if (data) {
      return data.po.po_detail.map((detail, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{new Date(data.po.po_head.po_date).toLocaleDateString()}</td>
            <td>{data.po.po_head.po_no}</td>
            <td>{data.po.po_footer.store}</td>
            <td>{detail.description}</td>
            <td>{detail.plu}</td>
            <td>{detail.price}</td>
            <td>{detail.qty}</td>
            <td>{detail.unit + "/" + detail.conversion}</td>
            <td>{detail.total}</td>
          </tr>
        );
      });
    }
  };

  const SubmitHandler = async () => {
    if (data) {
      setLoading(true);
      await axios.post(
        "https://gateway.jojonomic.com/v1/nocode/api/ims/upload",
        data
      );
      alert("Submitted Data!");
      setLoading(false);
      nav("/");
    } else {
      alert("Data not loaded, cant submit!");
      console.log("data not loaded");
    }
  };

  const Loading = () => {
    if (loading) {
      return <h1>Loading...</h1>;
    }
  };

  const LoadingExisting = () => {
    if (loadingExisting) {
      return <h1>Memeriksa database...</h1>;
    }
  };

  return (
    <div>
      <Loading />
      <FileUpload />

      <DataTable />
    </div>
  );
}

export default BetterUploadPage;
