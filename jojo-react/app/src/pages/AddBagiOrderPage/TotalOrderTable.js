import Loading from "../../components/Loading";
import { TrashFill, Plus } from "react-bootstrap-icons";
import { useEffect, useState } from "react";

const TotalOrderTable = ({
  listDetailTotal,
  setListDetailTotal,
  BagiPesananHandler,
  detailSupplier,
  loadingNewSupplier,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState([]);

  useEffect(() => {
    const temp = [...listDetailTotal].map((total) => {
      return [
        {
          id_supplier: { id: false, name: false },
          id_produk: total.id_produk,
          unit: total.unit,
          jumlah: 0,
        },
      ];
    });
    setSelectedSupplier(temp);
  }, [listDetailTotal]);

  const AddSelectedSupplier = (detailIndex) => {
    const temp = [...selectedSupplier];

    listDetailTotal.map((detail, index) => {
      if (index === detailIndex) {
        temp[index].push({
          id_supplier: { id: false, name: false },
          id_produk: detail.id_produk,
          unit: detail.unit,
          jumlah: 0,
        });
      }
    });

    setSelectedSupplier(temp);
  };

  const DeleteSelectedSupplier = (supplierIndex, productIndex) => {
    const temp = [...selectedSupplier];
    temp[productIndex].splice(supplierIndex, 1);
    setSelectedSupplier(temp);
  };

  const SupplierList = ({
    productSupplier,
    supplier,
    supplierIndex,
    productIndex,
  }) => {
    return (
      <td style={{ minHeight: "10rem" }}>
        <div>
          <div style={{ display: "flex" }}>
            <select
              style={{ minWidth: "7rem" }}
              value={JSON.stringify(supplier["id_supplier"])}
              onChange={(e) => {
                let temp = [...selectedSupplier];
                temp[productIndex][supplierIndex].id_supplier = JSON.parse(
                  e.target.value
                );
                setSelectedSupplier(temp);
              }}
            >
              <option value={JSON.stringify({ id: false, name: false })}>
                -
              </option>
              {detailSupplier &&
                detailSupplier.map((oneSupplier) => {
                  if (oneSupplier.id_produk.name === supplier.id_produk.name)
                    return (
                      <option
                        value={JSON.stringify(oneSupplier.id_supplier)}
                        key={oneSupplier.id_supplier.id}
                      >
                        {oneSupplier.id_supplier.name}
                      </option>
                    );
                })}
            </select>
            <input
              key={`IN${supplierIndex}${productIndex}`}
              name={`inputtext ${supplierIndex} ${productIndex}`}
              type="number"
              placeholder={`Jumlah barang... ${supplierIndex}`}
              onChange={(e) => {
                let temp = [...selectedSupplier];
                temp[productIndex][supplierIndex].jumlah =
                  parseInt(e.target.value) || 0;
                setSelectedSupplier(temp);
              }}
              value={parseInt(supplier.jumlah) || 0}
            />
            {selectedSupplier[productIndex]?.length > 1 && (
              <button
                className="btn btn-danger"
                onClick={() =>
                  DeleteSelectedSupplier(supplierIndex, productIndex)
                }
              >
                <TrashFill />
              </button>
            )}

            <button
              className="btn btn-primary "
              onClick={() => {
                AddSelectedSupplier(productIndex);
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
          <tr key={"tr" + index}>
            <td>{index + 1}</td>
            <td>{detailTotal?.id_produk.name}</td>
            <td>{detailTotal?.jumlah_barang}</td>
            <td>{detailTotal?.unit}</td>
          </tr>
        );
      });
  };
  const SelectSupplierList = () => {
    if (selectedSupplier)
      return selectedSupplier.map((suppliers, productIndex) => {
        return (
          <tr key={"tr" + productIndex}>
            {suppliers?.map((supplier, supplierIndex) => {
              return (
                <SupplierList
                  key={"supplierList" + supplierIndex}
                  productSupplier={selectedSupplier[productIndex]}
                  supplier={supplier}
                  supplierIndex={supplierIndex}
                  productIndex={productIndex}
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
          <div style={{ margin: "auto", display: "flex" }}>
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
            <table>
              <thead>
                <tr>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                <SelectSupplierList />
              </tbody>
            </table>
          </div>
          <button
            onClick={() =>
              BagiPesananHandler(listDetailTotal, selectedSupplier)
            }
          >
            Bagi pesanan
          </button>
        </div>
      </div>
    );
  }
};

export default TotalOrderTable;
