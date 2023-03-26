import Loading from "../../components/Loading";
import SelectSupplierTable from "./SelectSupplierTable";

const TotalOrderTable = ({
  listDetailTotal,
  BagiPesananHandler,
  selectedHasilPembagian,
  setSelectedHasilPembagian,
  detailSupplier,
  loadingNewSupplier,
}) => {
  const tempData = [...listDetailTotal];
  const TotalOrderList = () => {
    return listDetailTotal.map((detailTotal, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{detailTotal.id_produk.name}</td>
          <td>{detailTotal.jumlah_barang}</td>
          <td>{detailTotal.unit}</td>
        </tr>
      );
    });
  };

  if (listDetailTotal.length > 0) {
    return (
      <div>
        <div>
          <h1>TOTAL PESANAN UNTUK DIBAGI:</h1>
          <div className="row" style={{ margin: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Produk</th>
                  <th>Jumlah Barang</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                <TotalOrderList />
              </tbody>
            </table>
            <SelectSupplierTable
              selectedHasilPembagian={selectedHasilPembagian}
              setSelectedHasilPembagian={setSelectedHasilPembagian}
              listDetailTotal={listDetailTotal}
              detailSupplier={detailSupplier}
              loadingNewSupplier={loadingNewSupplier}
            />
          </div>
          <button onClick={BagiPesananHandler}>Bagi pesanan</button>
        </div>
      </div>
    );
  }
};

export default TotalOrderTable;
