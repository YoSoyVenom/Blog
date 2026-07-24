const path = require("path");
const { findUserById } = require("../services/userService");

function loadHome(req, res) {
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "home.html" ));
}

async function loadUserData(req, res) {
    const id = req.user.id;

    const username = await findUserById(id);

    if (!username) {
        res.status(401).json({message: "INVALID_CREDENTIAL"});
    }

    res.status(200).json({
        username: username
    });
}

module.exports = {
    loadHome,
    loadUserData
}