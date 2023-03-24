import RemoveButton from "../../components/RemoveButton";
import Loading from "../../components/Loading";

const SelectedOrderTable = ({
  selectedOrder,
  setSelectedOrder,
  OrderTotalHandler,
  loadingTotalOrder,
}) => {
  const SelectedOrderList = () => {
    if (selectedOrder && selectedOrder.length > 0) {
      return selectedOrder.map((oneOrder, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{oneOrder.id}</td>
            <td>{oneOrder.nomorpo}</td>
            <td>{new Date(oneOrder.tanggal).toLocaleDateString()}</td>
            <td>
              <RemoveButton
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
        <Loading isLoading={loadingTotalOrder} />
      </>
    );
};

export default SelectedOrderTable;
