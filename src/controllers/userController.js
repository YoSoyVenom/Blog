const express = require("express");
const getAllUsers = require("userModel");

async function userController() {
    try {
        const results = await getAllUsers();
        res.json({ message: "Usuarios encontrados con éxito", usuarios: results.rows});
    } catch (error) {
        res.json({message: "Ocurrió un error", error: error});
    };
};