import Loading from "../../components/Loading";
import { TrashFill, Plus } from "react-bootstrap-icons";
import { useEffect, useState } from "react";

const TotalOrderTable = ({
  listDetailTotal,
  setListDetailTotal,
  selectedSupplier,
  setSelectedSupplier,
  BagiPesananHandler,
  detailSupplier,
  loadingNewSupplier,
}) => {
  useEffect(() => {
    const supplier = listDetailTotal.map((detail) => {
      return [
        {
          id_supplier: { id: false, name: false },
          id_produk: detail.id_produk,
          unit: detail.unit,
          jumlah: 0,
        },
      ];
    });
    if (!selectedSupplier || selectedSupplier.length < 1)
      setSelectedSupplier(supplier);
  }, [listDetailTotal]);

  const AddSupplier = (detailIndex) => {
    console.log("ADDD?");
    setSelectedSupplier((prevState) => {
      prevState[detailIndex].push({
        id_supplier: { id: false, name: false },
        id_produk: "detail.id_produk",
        unit: "detail.unit",
        jumlah: 0,
      });
      return prevState;
    });

    console.log("SELECTEDSUPAFTERADD", selectedSupplier);
  };

  const DeleteSelectedSupplier = (supplierIndex, detailIndex) => {
    const temp = listDetailTotal.map((detail, index) => {
      if (index === detailIndex) {
        detail.supplier.splice(supplierIndex, 1);
      }
      return detail;
    });

    setListDetailTotal(temp);
  };

  const SupplierList = ({
    supplierList,
    supplier,
    supplierIndex,
    detailIndex,
  }) => {
    return (
      <td style={{ minHeight: "10rem" }}>
        <div>
          <div style={{ display: "flex" }}>
            <select
              style={{ minWidth: "7rem" }}
              value={JSON.stringify(supplier["id_supplier"])}
              onChange={(e) => {
                supplier["id_supplier"] = e.target.value;
                setListDetailTotal(listDetailTotal);
              }}
            >
              <option value={{ id: false, name: false }}>-</option>
              {detailSupplier &&
                detailSupplier.map((supplier) => {
                  return (
                    <option
                      value={supplier.id_supplier}
                      key={supplier.id_supplier.id}
                    >
                      {supplier.id_supplier.name}
                    </option>
                  );
                })}
            </select>
            <input
              type="number"
              placeholder={`Jumlah barang... ${supplierIndex}`}
              onChange={(e) => {
                setSelectedSupplier((prevState) => {
                  prevState[detailIndex][supplierIndex].jumlah = e.target.value;
                  return prevState;
                });
              }}
              value={supplier.jumlah}
            />
            {supplierList?.length > 1 && (
              <button
                className="btn btn-danger"
                onClick={() =>
                  DeleteSelectedSupplier(supplier, supplierIndex, detailIndex)
                }
              >
                <TrashFill />
              </button>
            )}

            <button
              className="btn btn-primary "
              onClick={() => {
                AddSupplier(detailIndex);
              }}
            >
              <Plus />
            </button>
          </div>
        </div>
      </td>
    );
  };

  const TotalOrderList = () => {
    if (listDetailTotal)
      return listDetailTotal.map((detailTotal, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{detailTotal?.id_produk.name}</td>
            <td>{detailTotal?.jumlah_barang}</td>
            <td>{detailTotal?.unit}</td>
            {selectedSupplier[index]?.map((supplier, supplierIndex) => {
              return (
                <SupplierList
                  key={supplierIndex}
                  supplierList={selectedSupplier}
                  supplier={supplier}
                  supplierIndex={supplierIndex}
                  detailIndex={index}
                />
              );
            })}
          </tr>
        );
      });
  };

  if (listDetailTotal?.length > 0) {
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
          </div>
          <button onClick={BagiPesananHandler}>Bagi pesanan</button>
        </div>
      </div>
    );
  }
};

export default TotalOrderTable;
