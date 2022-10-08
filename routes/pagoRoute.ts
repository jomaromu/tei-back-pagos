import { Router, Request, Response } from "express";
import { verificaToken } from "../auth/auth";
import { PagoClass } from "../class/pagoClass";

const pagoRoute = Router();

pagoRoute.post(
  "/crearPago",
  [verificaToken],
  (req: Request, resp: Response) => {
    const crearPago = new PagoClass();
    crearPago.crearPago(req, resp);
  }
);

pagoRoute.get(
  "/obtenerPagosPorPedido",
  [verificaToken],
  (req: Request, resp: Response) => {
    const obtenerPagosPorPedido = new PagoClass();
    obtenerPagosPorPedido.obtenerPagosPorPedido(req, resp);
  }
);

pagoRoute.put(
  "/editarMotivo",
  [verificaToken],
  (req: Request, resp: Response) => {
    const editarMotivo = new PagoClass();
    editarMotivo.editarMotivo(req, resp);
  }
);

export default pagoRoute;
