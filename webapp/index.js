const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const pecas = require("./apis/pieces/pieces.js");
const stages = require("./apis/pieces/stages");
const history = require("./apis/pieces/history.js");

const formVeiculo = require("./apis/veiculos/formVeiculo.js");

// set default views folder
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// registra a sessão do usuário
app.use(
  session({
    secret: "mysecret",
    saveUninitialized: false,
    resave: false
  })
);

const authRoutes = require("./apis/routes/auth.js");

app.get("/", (req, res) => {
  res.redirect("/api/auth");
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

// * Pieces pages * //
app.get("/addPieces", pecas.renderAddPieces);
app.get("/getPieces", pecas.renderGetPieces);
app.get("/editPiece", pecas.renderEditPieces);

app.post("/addPieces", pecas.addPieces);
app.post("/updatePiece", pecas.updatePiece);
app.get("/listPieces", pecas.getPieces);
app.get("/getPiece", pecas.getPiece);

// * Estágios * //
app.get("/addStage", stages.renderAddStage);
app.get("/getStages", stages.renderGetStages);

app.post("/addStage", stages.addStage);
app.get("/listStages", stages.listStages);

// * History * //
app.get("/addHistory", history.renderAddHistory);
app.post("/addHistory", history.addHistory);

app.get("/getHistory", history.getHistory);
app.get("/listHistory", history.renderGetHistory);

app.get("/formVeiculo", formVeiculo.renderAddVeiculo);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});
