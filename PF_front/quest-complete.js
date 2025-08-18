document.addEventListener('DOMContentLoaded', () => {

    const hearts = document.querySelectorAll('.heart');
    let currentRating = 0;

    // 하트 평점 로직
    hearts.forEach(heart => {
        // 마우스를 올렸을 때
        heart.addEventListener('mouseover', () => {
            resetHearts();
            const value = parseInt(heart.dataset.value);
            for (let i = 0; i < value; i++) {
                hearts[i].classList.add('filled');
            }
        });

        // 마우스를 뗐을 때
        heart.addEventListener('mouseout', () => {
            resetHearts();
            // 현재 선택된 평점까지만 다시 채우기
            for (let i = 0; i < currentRating; i++) {
                hearts[i].classList.add('filled');
            }
        });

        // 하트를 클릭했을 때
        heart.addEventListener('click', () => {
            currentRating = parseInt(heart.dataset.value);
            console.log(`평점: ${currentRating}점`);
        });
    });
    
    function resetHearts() {
        hearts.forEach(h => h.classList.remove('filled'));
    }


    // 버튼 클릭 이벤트
    const retryButton = document.getElementById('retry-char');
    const finishButton = document.getElementById('finish-exp');

    // '다른 캐릭터 체험하기' 버튼
    retryButton.addEventListener('click', () => {
        // 캐릭터 선택 페이지로 이동
        window.location.href = 'characters.html';
    });

    // '체험 끝내기' 버튼
    finishButton.addEventListener('click', () => {
        if (currentRating === 0) {
            alert('재미도를 선택해주세요! (하트를 클릭)');
            return;
        }

        // 여기서 서버에 평점(currentRating)과 사용자 정보를 보내고
        // 최종 추천 결과를 받아오는 로직을 실행합니다.
        // 지금은 시뮬레이션으로 alert를 띄우고 결과 페이지로 이동합니다.
        alert(`${currentRating}점을 선택하셨습니다. 최종 추천 결과 페이지로 이동합니다.`);

        // 최종 결과 페이지로 이동
        window.location.href = 'results.html';
    });
});