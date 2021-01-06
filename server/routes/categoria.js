const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ========================================
// Mostrar todas las categorias
// ========================================
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments((err, cuantos) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos
                });
            });
        });
});

// ========================================
// Mostrar una categoria por ID
// ========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ========================================
// Crear nueva categoria
// ========================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    })

});

// ========================================
// Actualiza categoria
// ========================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

// ========================================
// Borra la categoria
// ========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });

});


module.exports = app;