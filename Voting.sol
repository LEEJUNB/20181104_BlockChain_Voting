pragma solidity ^0.4.23;

contract Voting{
	//1.배열로 나타낸 후보자 목록의 각후보들
	bytes32[] public candidateList; // 솔리디티는 아직 배열,스트링지원 않기에 bytes32씀

	mapping(bytes32 => uint8) public votesReceived; 	//bytes32(후보자이름) => uint8(정수값)를 사용한 이유는 각 후보에 대해 득표수를 계속 추적하기 위한 것
	constructor(bytes32[] candidateNames) public { // public으로 생성자를 선언하여 외부에서 접근가능, 이 생성자는 단 한번만 초기화. 같은 생성자를 여러번 만들면 서로 다른 인스턴스가 블록체인 상에 여러 개가 생길뿐. 
		candidateList = candidateNames; // candidateNames로 할당
	}
	
	//2.투표함수 구현하기         bytes32 candidate => 후보자 이름 넘기기
	function voteForCandidate(bytes32 candidate) public { 
		require(validCandidate(candidate)); // 6.최하단의 존재후보체크하는 함수를 추가하여, 이 조건을 충족시키면 밑의 코드로 진행한다.
		votesReceived[candidate] += 1; //3.투표수가 담기고 있는 mapping함수 votesReceived에 후보가 받은 투표 카운트가 담김. 컨트랙트 초기화 시점을 보면 기본적으로 0이 담긴다. 매번누군가가 투표할떄마다 1씩오른다.
	}
	//4.득표수 반환함수 주어진 후보가 얼마나 표를 얻었는지 득표수(uint8)를 반환
	function totalVotesFor(bytes32 candidate) view public returns(uint8) {
		require(validCandidate(candidate)); // 7.여기에 6번에있는 것을 적용해서 전체투표에 적용
		return votesReceived[candidate]; //단순읽기호출용. 고로 함수에 view를 써서 읽기 전용 함수로 표시
	}
	//5.존재하는 후보인지 체크하는 함수, 이런 함수폼의 장점은 솔리디티에서 조건 검사용으로 계속 사용가능
	function validCandidate(bytes32 candidate) view public returns(bool) {
		for(uint i =0; i < candidateList.length; i++){
			if(candidateList[i] == candidate){
				return true;
			}
		}
		return false;
	}
}