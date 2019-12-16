// mantem etapas em memoria para verificar
// se ha um determinado produto nela
var stages;

// dados para registrar o historico
var dataToServer = {};

window.addEventListener("load", function() {
  console.log("hello from addToHistory");

  // carrega pecas e etapas para os selects
  addToSelect();

  // resgata formulário select
  let form = document.getElementById("addToSelect");

  form.addEventListener("submit", compare);
});

// adicionar pecas e etapas ao select
function addToSelect() {
  // resgata pecas e adiciona no select
  $.get("/listPieces", function(res) {
    if (!res.error) {
      console.log("*** Public -> js -> addToHistory -> addToSelect: ***");
      if (res.msg === "no pieces yet") {
        return;
      }

      let pecas = res.pecas;

      pecas.forEach(function(produto) {
        $("select#pieceSelect").append(
          $("<option>", {
            value: produto.id,
            text: produto.produto
          })
        );
      });
    } else {
      alert(
        "Erro ao resgatar etapas do servidor. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });

  // resgata etapas e adiciona no select
  $.get("/listStages", function(res) {
    if (!res.error) {
      console.log(
        "*** Public -> js -> addToHistory.js -> addToSelect: ***",
        res.msg
      );

      stages = res.stages;
      console.table(stages);

      stages.forEach(function(stage) {
        $("select#stageSelect").append(
          $("<option>", {
            value: stage.stageID,
            text: stage.stageDesc
          })
        );
      });
    } else {
      alert(
        "Erro ao resgatar etapas do servidor. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });
}

// resgata e cria dados para enviar ao servidor
// compara se o produto percente a uma etapa
function compare(event) {
  console.log("*** Public -> js -> addToHistory -> compare: ***");

  // previne recarregamento de pagina
  event.preventDefault();

  $("#load").attr("disabled", "disabled");

  // resgata dados do formulário
  let produto = $("#pieceSelect option:selected").val();
  let etapa = $("#stageSelect option:selected").val();
  console.log("etapa: ", etapa);
  console.log("produto: ", produto);

  let isPIS = isPieceInStage(parseInt(produto, 10), etapa);

  // Se o produto estiver cadastrado na etapa escolhida
  // entao uma requisao ao servidor e enviada
  // para registrar no historico
  if (isPIS) {
    console.log("*** registrando histórico... ***");

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    const dateString = `${day}/${month + 1}/${year} - ${hours}:${min}:${sec}`;

    dataToServer.date = dateString;

    console.log(dataToServer);
    addToHistory(dataToServer);
  } else {
    alert("Este produto não está registrado nesta etapa");
    $("#load").attr("disabled", false);
  }
}

// verifica se produto percente a uma etapa
// retorna true ou false
function isPieceInStage(pieceId, stageId) {
  let pieces;

  for (let i = 0; i < stages.length; i++) {
    if (stages[i].stageID == stageId) {
      console.log(stages[i].pecas);
      pieces = stages[i].pecas;
      dataToServer.stage = stages[i].stageDesc;
    }
  }

  if (pieces) {
    for (let j = 0; j < pieces.length; j++) {
      if (pieces[j].pieceID == pieceId) {
        console.log(pieces[j]);
        dataToServer.pieceId = pieces[j].pieceID;
        return true;
      }
    }

    return false;
  }
}

// envia dados ao servidor
// para registrar um historico
function addToHistory(data) {
  $.post("/addHistory", data, function(res) {
    if (!res.error) {
      $("#load").attr("disabled", false);
      alert(res.msg);
    } else {
      $("#load").attr("disabled", false);
      alert(res.msg);
    }
  });
}
