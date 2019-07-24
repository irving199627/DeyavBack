"use strict";
var express = require('express');
var app = express();
const nodemailer = require("nodemailer");

const admin = {
    email: 'irving09112013@gmail.com',
    // pass: 'xzakxpqnqitlyyfg'
    pass: 'mmhjxkifptexydhb'
}


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: admin.email,
        pass: admin.pass,
    },
    tls: {
        rejectUnauthorized: false
    }
})

// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

app.post('/', async(req, res) => {
    const email = await transporter.sendMail({
            from: body.email,
            to: 'irving20131109@gmail.com',
            subject: req.body.titulo,
            text: req.body.contenido
        }).then(() => res.status(200).json({
            "mensaje": "email sent",
            "asunto": req.body.titulo,
            "contenido": req.body.contenido
        }))
        .catch((error) => res.status(500).json({ "error": error }));
});


module.exports = app;