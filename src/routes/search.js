const express = require("express");
const pool = require("../dist/connect");
const router = express.Router();

router.get("/", (req, res) => {
    pool.query(`SELECT matches.*, addresses.* FROM matches 
               LEFT JOIN addresses ON matches.address_match = addresses.id_address `, (err, results) => {
        if (err) {
            console.log(results);
            return res.status(500).send("Erro ao executar a consulta.");
        }
        
        return res.status(200).json(results);
    });
});

router.post("/id", (req, res) => {
    pool.query(`SELECT matches.*, addresses.*, sports.name AS sport_name
               FROM matches 
               LEFT JOIN addresses ON matches.address_match = addresses.id_address 
               LEFT JOIN sports ON matches.id_sport = sports.id_sport 
               WHERE matches.id_match = ?`,
        [req.body.idMatch], (err, results) => {
            if (err) {
                return res.status(500).send("Erro ao executar a consulta.");
            }
            return res.status(200).json(results);
        });
});

router.post("/", async (req, res) => {
    const city = req.body.city;

    try {
        const [results] = await pool.promise().query(
            `SELECT id_address 
             FROM addresses 
             WHERE city = ?`,
            [city]
        );

        if (results.length === 0) {
            return res.status(404).send("Endereço não encontrado.");
        }

        const idAddress = results.length > 1
            ? results.map(address => address.id_address)
            : [results[0].id_address];

        const queries = idAddress.map(addressMatch => {
            return pool.promise().query(
                `SELECT * 
                 FROM matches 
                 LEFT JOIN addresses ON addresses.id_address = matches.address_match 
                 WHERE addresses.id_address = ?;`,
                [addressMatch]
            );
        });

        const resultsSelectArray = await Promise.all(queries);
        const resultsSelect = resultsSelectArray.flatMap(result => result[0]);

        return res.status(200).json(resultsSelect);

    } catch (err) {
        return res.status(500).send("Erro ao executar a consulta.");
    }
});

router.post("/name-city", async (req, res) => {
    const city = req.body.city;
    const name = req.body.name;

    try {
        const [results] = await pool.promise().query(
            `SELECT id_address 
             FROM addresses 
             WHERE city LIKE ?`,
            [`%${city}%`]
        );

        // if (results.length === 0) {
        //     return res.status(404).send("Endereço não encontrado.");
        // }

        const idAddress = results.length > 1
            ? results.map(address => address.id_address)
            : [results[0].id_address];

        const queries = idAddress.map(addressMatch => {
            return pool.promise().query(
                `SELECT * 
                 FROM matches 
                 LEFT JOIN addresses ON addresses.id_address = matches.address_match 
                 WHERE addresses.id_address = ? OR matches.name LIKE ?;`,
                [addressMatch, `%${name}%`]
            );
        });

        const resultsSelectArray = await Promise.all(queries);
        const resultsSelect = resultsSelectArray.flatMap(result => result[0]);

        return res.status(200).json(resultsSelect);

    } catch (err) {
        return res.status(500).send("Erro ao executar a consulta.");
    }
});

router.post("/join", (req, res) => {
    const { idMatch, playersRegistered } = req.body;

    pool.query(
        `SELECT * FROM game_players WHERE user_id = ? AND game_id = ?`,
        [req.userId, idMatch],
        (err, results) => {
            if (err) return res.status(400).json("Erro ao verificar participação.");

            if (results.length > 0) {
                return res.status(400).json("Usuário já está registrado nessa partida.");
            }

            pool.query(
                `UPDATE matches SET players_registered = ? WHERE id_match = ?;`,
                [playersRegistered + 1, idMatch],
                (err, results) => {
                    if (err) return res.status(400).json("Não foi possível dar UPDATE.");

                    pool.query(
                        `INSERT INTO game_players (user_id, game_id) VALUES(?, ?)`,
                        [req.userId, idMatch],
                        (err, results) => {
                            if (err) return res.status(400).json("Não foi possível adicionar os dados na tabela.");

                            return res.status(201).json("Operações realizadas com sucesso.");
                        }
                    );
                }
            );
        }
    );
});





module.exports = router;
