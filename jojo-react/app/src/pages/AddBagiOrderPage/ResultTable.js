import Loading from "../../components/Loading";

const ResultTable = ({ hasilPembagian, loadingHasilPembagian }) => {
  const ResultList = () => {
    console.log(hasilPembagian);
    if (hasilPembagian) {
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
    } else {
      return (
        <tr>
          <td>WAIT(?)</td>
        </tr>
      );
    }
  };

  console.log("hasilpemb", hasilPembagian);

  if (hasilPembagian && hasilPembagian.length > 0)
    return (
      <>
        <Loading isLoading={loadingHasilPembagian} />
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
          {/* <tbody>
            {hasilPembagian.map((oneHasil, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{oneHasil["id_supplier"]["name"]}</td>
                  <td>{oneHasil["id_produk"]["name"]}</td>
                  <td>{oneHasil["jumlah"]}</td>
                </tr>
              );
            })}
          </tbody> */}
        </table>
      </>
    );
};

export default ResultTable;
