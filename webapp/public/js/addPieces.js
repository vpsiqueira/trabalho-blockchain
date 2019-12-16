window.addEventListener("load", function() {
  // restaga formulário de pecas
  let form = document.getElementById("addPieces");

  // adiciona uma função para
  // fazer o login quando o
  // formulário for submetido
  form.addEventListener("submit", addPiece);
});

function addPiece() {
  // previne a página de ser recarregada
  event.preventDefault();

  $("#load").attr("disabled", "disabled");

  // resgata os dados do formulário
  let produto = $("#produto").val();
  let preco = $("#preco").val();

  // envia a requisição para o servidor
  $.post("/addPieces", { produto: produto, preco: preco }, function(res) {
    console.log(res);
    // verifica resposta do servidor
    if (!res.error) {
      console.log("*** Views -> js -> pecas.js -> addPiece: ***", res.msg);
      // limpa dados do formulário
      $("#produto").val("");
      $("#preco").val("");

      // remove atributo disabled do botao
      $("#load").attr("disabled", false);

      alert("Sua peça foi cadastrada com sucesso");
    } else {
      alert(
        "Erro ao cadastrar peça. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });
}
