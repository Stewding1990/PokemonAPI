import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://pokeapi.co/api/v2/pokemon/";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { pokemon: null, error: null });
})

app.post("/", async (req, res) => {
    const Pokemonname = req.body.pokemonName.toLowerCase();
    try{
        const result = await axios.get(`${API_URL}${Pokemonname}`);
        const pokemon = result.data;
        res.render("index" , {pokemon, error: null});
    } catch (error) {
        res.render("index", {pokemon: null, error: "Cannot find the Pokémon. Please check the name and try again." });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})