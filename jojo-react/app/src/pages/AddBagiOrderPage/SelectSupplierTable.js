import SelectedOrderTable from "./SelectedOrderTable";
import Loading from "../../components/Loading";
import { TrashFill, Plus } from "react-bootstrap-icons";

const SelectSupplierTable = ({
  selectedHasilPembagian,
  setSelectedHasilPembagian,
  listDetailTotal,
  detailSupplier,
  loadingNewSupplier,
}) => {
  const AddSelectedSupplier = (index2, pembagian) => {
    const temp = selectedHasilPembagian.map((item, idx) => {
      if (idx === index2)
        return [
          ...item,
          {
            id_supplier: { id: false, name: false },
            id_produk: pembagian.id_produk,
            unit: pembagian.unit,
            jumlah: 0,
          },
        ];

      return item;
    });

    setSelectedHasilPembagian(temp);
  };
  const DeleteSelectedSupplier = (index, index2) => {
    const temp = [...selectedHasilPembagian];
    temp[index].slice(index2, 1);
    setSelectedHasilPembagian(temp);
  };

  const SupplierList = () => {
    if (listDetailTotal && listDetailTotal.length > 0) {
      return selectedHasilPembagian.map((hasilPembagian, index) => {
        return hasilPembagian.map((pembagian, index2) => (
          <tr key={index2} style={{ minHeight: "10rem" }}>
            <td>
              <button className="btn btn-primary w-50">
                <Plus onClick={() => AddSelectedSupplier(1, {})} />
              </button>
              <div style={{ display: "flex" }}>
                <select
                  style={{ minWidth: "7rem" }}
                  onChange={(e) => {
                    pembagian["id_supplier"] = JSON.parse(e.target.value);
                  }}
                >
                  <option value={JSON.stringify({ id: false, name: false })}>
                    -
                  </option>
                  {detailSupplier &&
                    detailSupplier.map((supplier) => {
                      if (supplier.id_produk.name === pembagian.id_produk.name)
                        return (
                          <option
                            value={JSON.stringify(supplier.id_supplier)}
                            key={supplier.id_supplier.id}
                          >
                            {supplier.id_supplier.name}
                          </option>
                        );
                    })}
                </select>
                <input
                  type="text"
                  placeholder={`Jumlah barang...` + index2}
                  onChange={(e) => (pembagian["jumlah"] = e.target.value)}
                />

                <button className="btn btn-danger">
                  <TrashFill
                    onClick={() => DeleteSelectedSupplier(index, index2)}
                  />
                </button>
              </div>
            </td>
          </tr>
        ));
      });
    }
  };

  if (listDetailTotal.length > 0)
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            <SupplierList />
            <Loading isLoading={loadingNewSupplier} />
          </tbody>
        </table>
      </>
    );
};

export default SelectSupplierTable;
