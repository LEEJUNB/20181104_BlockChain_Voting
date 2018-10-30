pragma solidity ^0.4.23;

contract Voting{
	//1.배열로 나타낸 후보자 목록의 각후보들
	bytes32[] public candidateList; 

	mapping(bytes32 => uint8) public votesReceived; 	// 각 후보에 대해 득표수를 계속 추적하기 위한 것
	constructor(bytes32[] candidateNames) public { // public으로 생성자를 선언하여 외부에서 접근가능, 이 생성자는 단 한번만 초기화.  
		candidateList = candidateNames; // candidateNames로 할당
	}
	
	//2.투표함수 구현하기 
	function voteForCandidate(bytes32 candidate) public { 
		require(validCandidate(candidate)); 
		votesReceived[candidate] += 1; //3.투표수가 담기고 있는 mapping함수 votesReceived에 후보가 받은 투표 카운트가 담김.
	}
	//4.득표수 반환함수 주어진 후보가 얼마나 표를 얻었는지 득표수(uint8)를 반환
	function totalVotesFor(bytes32 candidate) view public returns(uint8) {
		require(validCandidate(candidate));
		return votesReceived[candidate]; //단순읽기호출용.
	}
	//5.존재 후보 체크 함수
	function validCandidate(bytes32 candidate) view public returns(bool) {
		for(uint i =0; i < candidateList.length; i++){
			if(candidateList[i] == candidate){
				return true;
			}
		}
		return false;
	}
}