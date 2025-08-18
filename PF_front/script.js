// '직무 추천 바로가기' 버튼 요소를 가져옵니다.
const startButton = document.getElementById('start-recommendation');

// 버튼에 클릭 이벤트 리스너를 추가합니다.
startButton.addEventListener('click', () => {
    // 버튼을 클릭하면 'quiz.html' 페이지로 이동합니다.
    // 다음 페이지 파일 이름을 원하는 대로 수정할 수 있습니다.
    window.location.href = 'quiz.html'; 
});