let pieceId, pieceName, piecePrice;

window.addEventListener("load", () => {
  console.log("*** editing piece page loaded ");

  let url_string = window.location.href;
  let url = new URL(url_string);
  pieceId = parseInt(url.searchParams.get("id"), 10);
  console.log("Piece ID: ", pieceId);

  // restaga formulário de pecas
  let form = document.getElementById("editPiece");

  // adiciona uma função para
  // fazer o login quando o
  // formulário for submetido
  form.addEventListener("submit", updatePiece);

  getPiece(pieceId);
});

function getPiece(id) {
  console.log("*** Getting Pieces ***");

  $.get("/getPiece", { id: id }, function(res) {
    if (!res.error) {
      console.log("*** Views -> js -> pecas.js -> getPiece: ***", res.msg);

      if (res.msg === "no pieces yet") {
        return;
      }

      let produto = res.produto;

      $("#produto").val(produto.produto);
      $("#preco").val(produto.preco);
    } else {
      alert(
        "Erro ao resgatar pecas do servidor. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });
}

function updatePiece(event) {
  event.preventDefault();
  console.log("*** Editing piece: ", pieceId);

  $("#load").attr("disabled", "disabled");

  // resgata os dados do formulário
  let newDesc = $("#produto").val();
  let newPrice = $("#preco").val();

  // envia a requisição para o servidor
  $.post("/updatePiece", { pieceId, newDesc, newPrice }, function(res) {
    console.log(res);
    // verifica resposta do servidor
    if (!res.error) {
      console.log("*** Views -> js -> pecas.js -> addPiece: ***", res.msg);
      // limpa dados do formulário
      $("#produto").val("");
      $("#preco").val("");

      // remove atributo disabled do botao
      $("#load").attr("disabled", false);

      alert("Sua peça foi atualizado com sucesso");
      window.location.href = "/getPieces";
    } else {
      alert(
        "Erro ao atualizar peça. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });
}
