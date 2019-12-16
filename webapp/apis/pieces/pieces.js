const path = require("path");
const Web3 = require("web3");

const piece_abi = require(path.resolve(
  "../dapp/build/contracts/MyContract.json"
));
const httpEndpoint = "http://localhost:8540";

let contractAddress = require("../../utils/parityRequests").contractAddress;

const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);

let MyContract = new web3.eth.Contract(piece_abi.abi, contractAddress);

module.exports = {
  renderAddPieces: function(req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
      res.redirect("/api/auth");
      res.end();
    } else {
      res.render("pecas.html");
    }
  },
  renderGetPieces: function(req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
      res.redirect("/api/auth");
      res.end();
    } else {
      res.render("listaPieces.html");
    }
  },
  renderEditPieces: function(req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
      res.redirect("/api/auth");
      res.end();
    } else {
      res.render("editPiece.html");
    }
  },
  getPieces: async function(req, res) {
    console.log(contractAddress);
    let userAddr = req.session.address;
    console.log("*** Getting pieces ***", userAddr);

    await MyContract.methods
      .getPieces()
      .call({ from: userAddr, gas: 3000000 })
      .then(function(prod) {
        console.log("prod", prod);
        if (prod === null) {
          return res.send({ error: false, msg: "no pieces yet" });
        }

        let pecas = [];
        for (i = 0; i < prod["0"].length; i++) {
          pecas.push({
            id: +prod["0"][i],
            produto: prod["1"][i],
            addr: prod["2"][i],
            preco: +prod["3"][i]
          });
        }

        console.log("pecas", pecas);

        res.send({
          error: false,
          msg: "pecas resgatados com sucesso",
          pecas
        });
        return true;
      })
      .catch(error => {
        console.log("*** piecesApi -> getPieces ***error:", error);
        res.send({ error: true, msg: error });
      });
  },
  getPiece: async function(req, res) {
    console.log(contractAddress);
    let userAddr = req.session.address;
    console.log("*** Getting piece ***", userAddr);
    console.log(req);

    await MyContract.methods
      .pieceInfo(req.query.id)
      .call({ from: userAddr, gas: 3000000 })
      .then(function(prod) {
        console.log("prod", prod);
        if (prod === null) {
          return res.send({ error: false, msg: "no pieces yet" });
        }

        let produto = {
          id: +prod["0"],
          produto: prod["1"],
          addr: prod["2"],
          preco: +prod["3"]
        };

        console.log("produto", produto);

        res.send({
          error: false,
          msg: "pecas resgatado com sucesso",
          produto
        });
        return true;
      })
      .catch(error => {
        console.log("*** piecesApi -> getPiece ***error:", error);
        res.send({ error: true, msg: error });
      });
  },
  addPieces: async function(req, res) {
    if (!req.session.username) {
      res.redirect("/");
      res.end();
    } else {
      console.log("*** PiecesApi -> AddPieces ***");
      console.log(req.body);

      let produto = req.body.produto;
      let preco = req.body.preco;
      let userAddr = req.session.address;
      let pass = req.session.password;

      try {
        let accountUnlocked = await web3.eth.personal.unlockAccount(
          userAddr,
          pass,
          null
        );
        if (accountUnlocked) {
          await MyContract.methods
            .addPiece(produto, preco)
            .send({ from: userAddr, gas: 3000000 })
            .then(function(result) {
              console.log(result);
              return res.send({
                error: false,
                msg: "Peça cadastrado com sucesso."
              });
            })
            .catch(function(err) {
              console.log(err);
              return res.send({
                error: true,
                msg: "Erro ao comunicar com o contrato."
              });
            });
        }
      } catch (err) {
        return res.send({
          error: true,
          msg:
            "Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde."
        });
      }
    }
  },
  updatePiece: async (req, res) => {
    if (!req.session.username) {
      res.redirect("/");
      res.end();
    } else {
      let pieceId = req.body.pieceId;
      let newDesc = req.body.newDesc;
      let newPrice = req.body.newPrice;
      let userAddr = req.session.address;
      let pass = req.session.password;

      console.log(
        "apis -> pieces -> updatePiece: ",
        userAddr,
        pieceId,
        newDesc,
        newPrice
      );

      try {
        let accountUnlocked = await web3.eth.personal.unlockAccount(
          userAddr,
          pass,
          null
        );
        console.log("Account unlocked?", accountUnlocked);
        if (accountUnlocked) {
          await MyContract.methods
            .updatePiece(pieceId, newDesc, newPrice)
            .send({ from: userAddr, gas: 3000000 })
            .then(receipt => {
              console.log(receipt);
              return res.send({
                error: false,
                msg: "Peça atualizado com sucesso."
              });
            })
            .catch(err => {
              console.log(err);
              return res.json({
                error: true,
                msg: "erro ao se comunar com o contrato"
              });
            });
        }
      } catch (error) {
        return res.send({
          error: true,
          msg:
            "Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde."
        });
      }
    }
  }
};
