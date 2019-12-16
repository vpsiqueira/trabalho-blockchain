window.addEventListener("load", function() {
  // restaga formulário de cadastro de etapas
  let form = document.getElementById("addStage");

  // adiciona uma função para
  // enviar dados ao servidor quando
  // formulário for submetido
  form.addEventListener("submit", addStage);

  getPieces();
});

function addStage(event) {
  event.preventDefault();
  event.preventDefault();
  console.log("*** Adding to Stage ***");

  // bloqueia botão
  $("#load").attr("disabled", "disabled");

  // pega o valor dos checkboxes selecionados
  // e adiciona no array piecesIds
  let piecesIds = [];
  $.each($("input[name='produto']:checked"), function() {
    let id = $(this).val();
    piecesIds.push(parseInt(id, 10));
  });

  // verifica se há checkboxes selecionados
  if (piecesIds.length === 0) {
    alert("Nenhum produto selecionado");
    $("#load").attr("disabled", false);
    return;
  }

  // resgata a descrição da etapa
  let StageDesc = $("#desc").val();

  // reset os checkboxes
  $("input[type=checkbox]").prop("checked", false);
  console.log(piecesIds, StageDesc);

  // dados para enviar ao servidor
  const data = { piecesIds, StageDesc };

  $.post("/addStage", data, function(res) {
    console.log(res);
    if (!res.error) {
      alert(res.msg);
      $("#desc").val("");
      $("#load").attr("disabled", false);
    } else {
      alert(res.msg);
      $("#load").attr("disabled", false);
    }
  });
}

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

        cols += `<td width="60"> 
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="produto" value="${pecas[i].id}" id="addToStageCheck">
                    </div>
                </td>`;
        cols += `<td> ${pecas[i].produto} </td>`;
        cols += `<td> ${pecas[i].preco} </td>`;

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
