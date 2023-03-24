import AddOrRemoveButton from "../../components/AddOrRemoveButton";

const OrderTable = ({
  loadingOrder,
  order,
  selectedOrder,
  setSelectedOrder,
}) => {
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
              {new Date(oneOrder.created_at).toLocaleDateString("en-gb")}{" "}
              {new Date(oneOrder.created_at).toLocaleTimeString("en-gb")}
            </td>
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
            <th>Tanggal Order</th>
            <th>Waktu Upload</th>
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

export default OrderTable;
