import { Response } from "express";
import { CallbackError } from "mongoose";
const mongoose = require("mongoose");
import moment from "moment";
moment.locale("es");

// Intefaces
import { PagosInterface } from "../interfaces/pagosInterface";

// Modelos
import PagosModel from "../models/pagosModel";

// Funciones externas
// import { eliminarArchivo, extraerArchivo, subirArchivo } from '../functions/archivos';
import Server from "./server";

export class PagoClass {
  constructor() {}

  crearPago(req: any, resp: Response): void {
    const creador = new mongoose.Types.ObjectId(req.body.creador);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const idEmpresa = req.body.foranea;
    const modalidad = new mongoose.Types.ObjectId(req.body.modalidad);
    const metodo = new mongoose.Types.ObjectId(req.body.metodo);
    const pedido = new mongoose.Types.ObjectId(req.body.pedido);
    const fecha: string = req.body.fecha;
    const monto: number = req.body.monto;
    // const estado: boolean = req.body.estado;

    const nuevoPago = new PagosModel({
      creador,
      foranea,
      modalidad,
      metodo,
      pedido,
      fecha,
      monto,
      // estado,
    });

    nuevoPago.save((err: CallbackError, pagoDB: PagosInterface) => {
      if (err) {
        return resp.json({
          ok: false,
          mensaje: "No se pudo crear el pago",
          err,
        });
      } else {
        const server = Server.instance;
        server.io.in(idEmpresa).emit("cargar-pagos", { ok: true });
        return resp.json({
          ok: true,
          pagoDB,
        });
      }
    });
  }

  obtenerPagosPorPedido(req: any, resp: Response): void {
    const pedido = new mongoose.Types.ObjectId(req.get("pedido"));
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));

    PagosModel.find({ pedido, foranea })
      .populate("creador")
      .populate("modalidad")
      .populate("metodo")
      .exec((err: CallbackError, pagosDB: Array<PagosInterface>) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: "Error al obtener los pagos",
            err,
          });
        } else {
          return resp.json({
            ok: true,
            pagosDB,
          });
        }
      });
  }

  editarMotivo(req: any, resp: Response): void {
    const _id = new mongoose.Types.ObjectId(req.body.pago);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const idEmpresa = req.body.foranea;
    const motivo: string = req.body.motivo;
    const estado: boolean = req.body.estado;

    const query = {
      motivo,
      estado,
    };

    PagosModel.findOneAndUpdate(
      { _id, foranea },
      query,
      { new: true },
      (err: any, pagoDB: any) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: "No se pudo editar motivo",
            err,
          });
        } else {
          const server = Server.instance;
          server.io.in(idEmpresa).emit("cargar-pagos", { ok: true });
          return resp.json({
            ok: true,
            pagoDB,
          });
        }
      }
    );
  }
}
