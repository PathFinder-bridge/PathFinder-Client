document.addEventListener('DOMContentLoaded', () => {
    // 버튼 요소들을 가져옵니다.
    const runButton = document.getElementById('run-code');
    const resetButton = document.getElementById('reset-code');
    const completeButton = document.getElementById('complete-quest');

    // 코드 실행 버튼 클릭 이벤트
    runButton.addEventListener('click', () => {
        alert('⚙️ 코드를 실행하여 서버 시뮬레이터를 작동합니다!');
    });

    // 초기화 버튼 클릭 이벤트
    resetButton.addEventListener('click', () => {
        alert('🔄 코드 블록을 초기 상태로 되돌립니다.');
    });

    // 퀘스트 완료하기 버튼 클릭 이벤트
    completeButton.addEventListener('click', () => {
        alert('🎉 축하합니다! 백엔드 개발자 퀘스트를 완료했습니다!');
        // 예: 다음 페이지로 이동하거나, 완료 팝업을 띄웁니다.
        // window.location.href = 'quest-complete.html';
    });
});