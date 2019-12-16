pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract MyContract {

    // evento para notificar o cliente que a conta foi atualizada
    event userRegisted(address _addr, string newEmail);
    // evento para notificar o cliente que o produto foi registrado
    event pieceRegistered(uint id);
    // evento para notificar o cliente de que a Etapa foi registrada
    event StageRegistered(uint[]);
    // evento para notificar o cliente de que um histórico foi registrado
    event historyRegistered(string _msg);
    // evento para notificar o cliente de que um produto foi atualizado
    event pieceUpdated(uint _pieceId, string _msg);
    
    event veiculoRegistered(uint _veiculoId);


    // estrutura para manter dados do usuário
    struct User {
        string email;
    }

    // estrutura para registar o estagio de um produto
    struct Stage {
        uint id;
        uint[] pieces;
        string desc;
        address owner;
    }

    // estrutura para manter dados do produto
    struct Piece {
        uint id;
        string desc;
        uint price;
        address owner;
    }

    // estrutura para manter dados de um histórico
    struct History {
        uint pieceId;
        string[] stageDesc;
        string[] dates;
        address pieceOwner;
    }

    // estrutura para manter os dados de um veículo
    struct Veiculo
    {
        uint id;
        string placa;
        string renavam;
        string chassi;
        string cor;
        string modelo;
        uint anoFabricacao;
        uint potencia;
        address pieceOwner;
    }

    // mapeia um id a um produto
    mapping (uint => Piece) pieces;
    uint[] public piecesIds;

    // mapeia um id a uma etapa
    mapping(uint => Stage) stages;
    uint[] public stagesIds;

    mapping (uint => History) histories;
    uint[] public historiesIds;
    uint[] public piecesInHistory;

    //mapeia um id a um veículo
    mapping (uint => Veiculo) veiculos;
    uint[] public veiculosIds;

    // mapeia endereço do usuário a sua estrutura
    mapping (address => User) users;

    // state variables
    uint256 private lastId = 0;
    uint256 private stagesId = 0;
    uint256 private historyId = 0;
    
    uint256 private veiculoId = 0;

    // função para cadastrar conta do usuário
    function setUser(address _addr, string memory _email) public {
        User storage user = users[_addr];
        user.email = _email;

        // notifica o cliente através do evento
        emit userRegisted(_addr, "Conta registrada com sucesso!");
    }

    // função para resgatar dados do usuário
    function getUser(address _addr) public view returns(string memory) {
        User memory user = users[_addr];
        return (user.email);
    }

    // função para cadastrar um veiculo
    function addVeiculo(Veiculo memory _veiculo) public {
        //fazer as validações de campos obrigatórios 

        _veiculo.id = veiculoId;

        veiculos[veiculoId] = _veiculo;
        veiculosIds.push(veiculoId);

        veiculoId++;
        emit veiculoRegistered(veiculoId - 1);
    }

    // função para cadastrar um produto
    function addPiece(string memory _desc, uint _price) public {
        require(bytes(_desc).length >= 1, "Invalid name");
        require(_price > 0, "Price must be higher than zero");

        pieces[lastId] = Piece(lastId, _desc, _price, msg.sender);
        piecesIds.push(lastId);
        lastId++;
        emit pieceRegistered(lastId);
    }

    function updatePiece(uint _pieceId, string memory _newDesc, uint _newPrice) public {
        require(bytes(_newDesc).length >= 1, "Invalid name");
        require(_newPrice > 0, "New price must be higher than zero");

        Piece storage prod = pieces[_pieceId];

        require(prod.owner == msg.sender, "Only the owner can update the piece");
        prod.desc = _newDesc;
        prod.price = _newPrice;

        emit pieceUpdated(_pieceId, "Peça atualizado com successo");
    }

    // função para resgatar info de um produto
    function pieceInfo(uint _id) public view
        returns(
            uint,
            string memory,
            address,
            uint
        ) {
            require(_id <= lastId, "Piece does not exist");

            Piece memory piece = pieces[_id];
            
            return (
                piece.id,
                piece.desc,
                pieces[_id].owner,
                piece.price
            );
    }

    // função que retorna todos os pecas de um usuário
    function getPieces() public view returns(uint[] memory, string[] memory, address[] memory, uint[] memory) {

        uint[] memory ids = piecesIds;

        uint[] memory idsPieces = new uint[](ids.length);
        string[] memory names = new string[](ids.length);
        address[] memory owners = new address[](ids.length);
        uint[] memory prices = new uint[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsPieces[i], names[i], owners[i], prices[i]) = pieceInfo(i);
        }

        return (idsPieces, names, owners, prices);
    }

    function isPieceInHistory(uint _id) public view returns (bool) {
        for (uint i = 0; i < piecesInHistory.length; i++) {
            if (piecesInHistory[i] == _id)
                return true;
        }
        return false;
    }

    // função para adicionar o histórico de um produto
    function addNewHistory(uint _pieceId, string[] memory _stageDesc, string[] memory _dates) public {
        require(_pieceId >= 0, "invalid pieceId");

        if (!isPieceInHistory(_pieceId)) {
            histories[historyId] = History(_pieceId, _stageDesc, _dates, msg.sender);
            historiesIds.push(historyId);
            piecesInHistory.push(_pieceId);
            historyId++;
            emit historyRegistered("History saved!");
        } else {
            bool added = addToHistory(_pieceId, _stageDesc, _dates);
            if (added) {
                emit historyRegistered("History saved!");
            }
        }
    }

    function addToHistory(uint _pieceId, string[] memory _stageDesc, string[] memory _dates) public returns (bool) {
        uint size = historiesIds.length;
        for (uint i = 0; i < size; i++) {
            if (histories[i].pieceId == _pieceId) {
                History storage his = histories[i];
                his.stageDesc.push(_stageDesc[0]);
                his.dates.push(_dates[0]);
                return true;
            }
        }
        return false;
    }

    function HistoryInfo(uint _id) public view returns (uint, string[] memory, string[] memory, address) {
        require(_id <= historyId, "History does not exist");

        History memory his = histories[_id];
        return (
            his.pieceId,
            his.stageDesc,
            his.dates,
            his.pieceOwner
        );
    }

    function getHistories() public view returns (string[] memory, string[][] memory, string[][] memory, address[] memory) {
        uint[] memory ids = historiesIds;

        uint[] memory prodsIds = new uint[](ids.length);
        string[] memory piecesNames = new string[](ids.length);
        string[][] memory stageDesc = new string[][](ids.length);
        string[][] memory dates = new string[][](ids.length);
        address[] memory addrs = new address[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (prodsIds[i], stageDesc[i], dates[i], addrs[i]) = HistoryInfo(i);
            (, piecesNames[i], ,) = pieceInfo(prodsIds[i]);
        }

        return (piecesNames, stageDesc, dates, addrs);
    }

    // função para adicionar pecas à um estágio
    function addToStage(uint[] memory _piecesIds, string memory _stageDesc) public {
        require(bytes(_stageDesc).length >= 1, "Name invalid");
        require(_piecesIds.length > 0, "Price must be higher than zero");

        stages[stagesId] = Stage(stagesId, _piecesIds, _stageDesc, msg.sender);
        stagesIds.push(stagesId);
        stagesId++;

        emit StageRegistered(_piecesIds);
    }

    // função para resgatar info de um estágio
    function stageInfo(uint _id) public view returns (uint, uint[] memory, string memory, address) {
        require(_id <= stagesId, "Piece stage does not exist");

        Stage memory stage = stages[_id];
        return (stage.id, stage.pieces, stage.desc, stage.owner);
    }

    // função que retorna todos os pecas de um usuário
    function getStages() public view returns (uint[] memory, uint[][] memory, string[] memory, address[] memory) {

        uint[] memory ids = stagesIds;
        uint[] memory idsStages = new uint[](ids.length);
        uint[][] memory prods = new uint[][](ids.length);
        string[] memory prods_desc = new string[](ids.length);
        address[] memory owners = new address[](ids.length);

        for(uint i = 0; i < ids.length; i++) {
            (idsStages[i], prods[i], prods_desc[i], owners[i]) = stageInfo(i);
        }

        return (ids, prods, prods_desc, owners);
    }

}