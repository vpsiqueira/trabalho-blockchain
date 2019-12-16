window.addEventListener("load", function() {
  getStages();
});

function getStages() {
  console.log("*** getting stages ***");

  $.get("/listStages", function(res) {
    if (!res.error) {
      console.log("*** Views -> js -> pecas.js -> getPieces: ***", res.msg);

      let stages = res.stages;
      console.table(stages);

      for (let i = 0; i < stages.length; i++) {
        let html = `
                    <div class="card">
                        <div class="card-header" id="heading${stages[i].stageID}">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${stages[i].stageID}" aria-expanded="false" aria-controls="collapse${stages[i].stageID}">
                                    ${stages[i].stageDesc}
                                </button>
                            </h2>
                        </div>
                
                        <div id="collapse${stages[i].stageID}" class="collapse" aria-labelledby="heading${stages.stageID}" data-parent="#accordionStages">
                            <div class="card-body">
                                <h6> Peças nesta etapa: </h6>
                                <table id="piecesList${stages[i].stageID}" class="table table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">id</th>
                                            <th scope="col">Peça</th>
                                            <th scope="col">Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;

        $("#accordionStages").append(html);
        appendPieces(stages[i].pecas, stages[i].stageID);
      }
    } else {
      alert(
        "Erro ao resgatar etapas do servidor. Por favor, tente novamente mais tarde. " +
          res.msg
      );
    }
  });
}

function appendPieces(pecas, stageID) {
  for (let i = 0; i < pecas.length; i++) {
    let newRow = $("<tr>");
    let cols = "";

    cols += `<td width="60"> ${pecas[i].pieceID} </td>`;
    cols += `<td> ${pecas[i].produto} </td>`;
    cols += `<td> ${pecas[i].preco} </td>`;

    newRow.append(cols);
    $(`#piecesList${stageID}`).append(newRow);
  }
}
