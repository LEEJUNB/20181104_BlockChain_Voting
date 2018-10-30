//후보자에 투표하고 득표수를 세는 기능을 구현할거임
//node.js 콘솔에서했던것과비슷함
//web3, ABI가 필요하니 만들어보자.
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

//parse의 괄호안에 들어갈것은 Node.js콘솔에 있는 ABI.
//이 ABI를 받기위해 노드콘솔로 돌아가자!
//받은 ABI는 parse(괄호)안에 넣자
abi = JSON.parse('[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

//web3 eth 스마트 계약 객체를 초기화한다.
VotingContract = web3.eth.contract(abi);

//스마트계약을배포한주소의인스턴스를확보한다.
//즉, VotingContract의 계약 주소를 확보한다.
//다시 node.js콘솔로 돌아가서
//이번엔 deployedContract의 주소를 확인한다.
//이 주소를 복사해서 .at(괄호) 괄호안에 붙여넣기한다.
contractInstance = VotingContract.at('0x158ded60e44199fc1ce27498cfaefb7c458191b8');

//3.이를 위해 모든 후보자에 대한 변수를 선언하고 반복문을 돌린다.
//4. 연관배열(associative array)을쓸거임. 이를통해 index.html에 있는 div ID를 조회할수있음
//5. html에있는 div ID를 후보자이름에 맵핑시키면 모든 후보에대해반복문을돌릴수있게된다.
candidates = {"Rama":"candidate-1","Nick":"candidate-2","Jose":"candidate-3"};

//12. index.html에 있는 voteForCandidate함수를구현하자.
function voteForCandidate(candidate) {
	candidateName = $("#candidate").val(); // candidate.val을 참조한다는말
	//web3 eth계정으로 전달하고 가스를 넣음, 함수가 실행됨
	contractInstance.voteForCandidate(candidateName, {from:web3.eth.accounts[0],gas:4700000}, function() {
		//투표를 받아서 해당 후보에 대한 득표수가 업데이트된것이 확인되면 프론트엔드는 마무리됨
		let div_id = candidates[candidateName];
		$("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
	});
}

//1. 페이지를 로드할때 투표한 모든 득표 현황을 반영하기 위한 것
//2. 즉,후보자리스트에반복을돌려서 각각에대해 totalVotesFor함수를 호출하는 것
$(document).ready(function() {

//6.즉 candiddataNames를 object.key에 연관시키는 것!
    candidateNames = Object.keys(candidates);
//7.이제 반복문을 돌리고
    for(var i =0;i<candidateNames.length;i++){
        let name = candidateNames[i];
        //8. 각 후보에 대해 totalVotesFor를 호출하고 현재값확인후
        //10. 페이지가 로드될 때 totalVotesFor를 
        let val = contractInstance.totalVotesFor.call(name).toNumber();
        //9.그것을 HTML에 반영함. 후보자정보에 div ID가 있기에 여기에할당한다.
        //11.표의 컬럼에 있는 각 후보자에 대해 호출하게 된다.
        $("#" + candidates[name]).html(val);
    }
});
