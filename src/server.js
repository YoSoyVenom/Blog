const app = require("./app");
const PORT = 3200;
const pool = require("./config/db_config");

app.get("/db_prueba", async(req,res) =>{
    try {
        const results = await pool.query("SELECT * FROM users");
        if (results.rows.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(200).json({ message: "Without information" })
        }
    } catch (error) {
        res.json({ message: "Has been ocurred an error", error: error })
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});