'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  itemsCarritoSchema,
  MAX_CANTIDAD,
  MAX_PRODUCTOS,
} from '@/lib/carrito-schema';

const CarritoContext = createContext(null);
const CLAVE = 'imperiosur-carrito';

export default function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(null);

  useEffect(() => {
    try {
      const guardado = itemsCarritoSchema.safeParse(
        JSON.parse(localStorage.getItem(CLAVE)),
      );
      setCarrito(guardado.success ? guardado.data : []);
    } catch {
      setCarrito([]);
    }
  }, []);

  useEffect(() => {
    if (carrito === null) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(carrito));
    } catch {
      // El carrito sigue disponible en esta pestaña si el almacenamiento está deshabilitado.
    }
  }, [carrito]);

  function agregar(producto, stock) {
    setCarrito((actual) => {
      if (!actual) return actual;
      const item = actual.find((renglon) => renglon.producto === producto);
      const limite = Math.min(stock, MAX_CANTIDAD);
      if (item)
        return item.cantidad >= limite
          ? actual
          : actual.map((renglon) =>
              renglon.producto === producto
                ? { ...renglon, cantidad: item.cantidad + 1 }
                : renglon,
            );
      return limite > 0 && actual.length < MAX_PRODUCTOS
        ? [...actual, { producto, cantidad: 1 }]
        : actual;
    });
  }

  function cambiarCantidad(producto, cantidad, stock) {
    if (
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > Math.min(stock, MAX_CANTIDAD)
    )
      return;
    setCarrito((actual) =>
      actual.map((item) =>
        item.producto === producto ? { ...item, cantidad } : item,
      ),
    );
  }

  function quitar(producto) {
    setCarrito((actual) => actual.filter((item) => item.producto !== producto));
  }

  function descontarCompra(comprados) {
    const cantidades = new Map(
      comprados.map(({ producto, cantidad }) => [producto, cantidad]),
    );
    setCarrito((actual) =>
      actual
        .map((item) => ({
          ...item,
          cantidad: item.cantidad - (cantidades.get(item.producto) ?? 0),
        }))
        .filter(({ cantidad }) => cantidad > 0),
    );
  }

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        totalUnidades:
          carrito?.reduce((total, item) => total + item.cantidad, 0) ?? 0,
        agregar,
        cambiarCantidad,
        quitar,
        descontarCompra,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
