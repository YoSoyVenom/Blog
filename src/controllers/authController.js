const path = require("path");
const { findUserById } = require("../services/userService");

function loadHome(req, res) {
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "home.html" ));
}

async function loadUserData(req, res) {
    const id = req.user.id;

    const user = await findUserById(id);

    if (!user) {
        return res.status(401).json({message: "INVALID_CREDENTIAL"});
    }

    return res.status(200).json({
        username: user.username
    });
}

module.exports = {
    loadHome,
    loadUserData
}