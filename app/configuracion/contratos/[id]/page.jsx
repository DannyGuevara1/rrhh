"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Button,
} from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const columns = [
  { uid: "nombre", name: "Nombre" },
  { uid: "descripcion", name: "Descripción" },
];

const INITIAL_VISIBLE_COLUMNS = ["nombre", "descripcion"];

export default function App({ params }) {
  const idTipoContrato = params.id; // Obtener el idTipoContrato desde los parámetros
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [beneficios, setBeneficios] = React.useState([]);
  const [tipoContratoBeneficios, setTipoContratoBeneficios] = React.useState(new Set([]));

  useEffect(() => {
    // Fetch benefits from the API
    fetch("http://localhost:8080/api/v1/beneficio/all")
      .then((response) => response.json())
      .then((data) => setBeneficios(data.beneficios))
      .catch((error) => console.error("Error fetching benefits:", error));

    // Fetch tipoContrato and its benefits from the API
    fetch(`http://localhost:8080/api/v1/tipoContrato/get/${idTipoContrato}`)
      .then((response) => response.json())
      .then((data) => {
        const beneficiosIds = data.tipoContrato.beneficios.map(beneficio => beneficio.idBeneficio.toString());
        setSelectedKeys(new Set(beneficiosIds));
        setTipoContratoBeneficios(new Set(beneficiosIds));
      })
      .catch((error) => console.error("Error fetching tipoContrato:", error));
  }, [idTipoContrato]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredBeneficios = [...beneficios];

    if (hasSearchFilter) {
      filteredBeneficios = filteredBeneficios.filter((beneficio) =>
        beneficio.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredBeneficios;
  }, [beneficios, filterValue]);

  const pages = Math.max(Math.ceil(filteredItems.length / rowsPerPage), 1);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((beneficio, columnKey) => {
    const cellValue = beneficio[columnKey];
    return cellValue;
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1); // Reset to first page on rows per page change
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Manejar la selección y deselección de beneficios
  const handleSelectionChange = async (keys) => {
    const added = [...keys].filter((key) => !selectedKeys.has(key));
    const removed = [...selectedKeys].filter((key) => !keys.has(key));

    for (let idBeneficio of added) {
      try {
        await fetch(`http://localhost:8080/api/v1/tipoContrato/${idTipoContrato}/addBeneficio/${idBeneficio}`, {
          method: 'POST',
        });
      } catch (error) {
        console.error("Error adding benefit:", error);
      }
    }

    for (let idBeneficio of removed) {
      try {
        await fetch(`http://localhost:8080/api/v1/tipoContrato/${idTipoContrato}/deleteBeneficio/${idBeneficio}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error("Error removing benefit:", error);
      }
    }

    setSelectedKeys(keys);
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre de beneficio..."
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {beneficios.length} beneficios</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onRowsPerPageChange, beneficios.length, onSearchChange, hasSearchFilter, rowsPerPage]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size === 0
            ? "No items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={page <= 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={page >= pages} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, selectedKeys, filteredItems.length]);

  return (
    <Table
      aria-label="Tabla de beneficios"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={{ column: "nombre", direction: "ascending" }}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={handleSelectionChange}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align="start"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No se encontraron beneficios"} items={items}>
        {(item) => (
          <TableRow key={item.id_beneficio}>
            {(columnKey) => <TableCell key={`${item.id_beneficio}-${columnKey}`}>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
