const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ========================================
// Mostrar todas los productos
// ========================================
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let condicionBusqueda = { disponible: true };

    Producto.find(condicionBusqueda)
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

// ========================================
// Mostrar un producto por ID
// ========================================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró el producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ========================================
// Buscar productos
// ========================================
app.get('/producto/buscar/:termino', (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });
});

// ========================================
// Crear nuevo producto
// ========================================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        disponible: body.disponible
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    })

});

// ========================================
// Actualiza producto
// ========================================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });

});

// ========================================
// Deshabilita el producto
// ========================================
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

module.exports = app;