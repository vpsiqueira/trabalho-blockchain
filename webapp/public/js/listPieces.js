window.addEventListener("load", function() {
  // função para carregar pecas
  getPieces();
});

function getPieces() {
  console.log("*** Getting Pieces ***");

  $.get("/listPieces", function(res) {
    if (!res.error) {
      console.log("*** Views -> js -> pecas.js -> getPieces: ***", res.msg);

      if (res.msg === "no pieces yet") {
        return;
      }

      let pecas = res.pecas;

      // adiciona pecas na tabela
      for (let i = 0; i < pecas.length; i++) {
        let newRow = $("<tr>");
        let cols = "";
        let desc = pecas[i].produto;
        let preco = pecas[i].preco;
        let owner = pecas[i].addr;

        cols += `<td> ${desc} </td>`;
        cols += `<td> ${preco} </td>`;
        cols += `<td> ${owner.substring(1, 10)} </td>`;
        cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/editPiece?id=${pecas[i].id}"><i class="fas fa-edit"></i></a>
                    </span>
                </td>`;

        newRow.append(cols);
        $("#pieces-table").append(newRow);
      }
    } else {
      alert(
        "Erro ao resgatar pecas do servidor. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });
}
