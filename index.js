import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;
const API_URL = "https://pokeapi.co/api/v2/pokemon/";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { pokemon: null, error: null });
})

// Handle random Pokémon requests
app.get("/random", async (req, res) => {
    try {
        // Generate a random number between 1 and 898 (number of Pokémon in PokeAPI)
        const randomId = Math.floor(Math.random() * 898) + 1;
        const result = await axios.get(`${API_URL}${randomId}`);
        const pokemon = result.data;
        res.render("index", { pokemon, error: null });
    } catch (error) {
        res.render("index", { pokemon: null, error: "Cannot find the Pokémon. Please try again." });
    }
});

app.post("/", async (req, res) => {
    const Pokemonname = req.body.pokemonName.toLowerCase();
    try {
        const result = await axios.get(`${API_URL}${Pokemonname}`);
        const pokemon = result.data;
        res.render("index", { pokemon, error: null });
    } catch (error) {
        let errorMessage = "An unknown error occurred.";
        if (error.response) {
            if (error.response.status === 404) {
                errorMessage = "Cannot find the Pokémon. Please check the name and try again.";
            } else if (error.response.status === 500) {
                errorMessage = "The server encountered an error. Please try again later.";
            }
        } else if (error.request) {
            errorMessage = "No response from the server. Please check your internet connection.";
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        res.render("index", { pokemon: null, error: errorMessage });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})