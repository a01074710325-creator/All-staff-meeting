// 1. 실시간 시계 연동
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// 2. YouTube 배경음악 제어
let player;
function onYouTubeIframeAPIReady() {
    const savedVideoId = localStorage.getItem('meetingBgmId') || 'jfKfPfyJRdk'; // 기본값: Lofi Girl
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: savedVideoId,
        playerVars: { 'autoplay': 0, 'controls': 0 },
    });
}

document.getElementById('play-btn').addEventListener('click', () => {
    if(player && player.playVideo) player.playVideo();
});

document.getElementById('pause-btn').addEventListener('click', () => {
    if(player && player.pauseVideo) player.pauseVideo();
});

// 3. 화면 데이터 로드 (로컬 스토리지 기반)
function loadSettings() {
    // QR 이미지 로드
    const savedQr = localStorage.getItem('meetingQr');
    const qrImg = document.getElementById('qr-image');
    if (savedQr) {
        qrImg.src = savedQr;
        qrImg.style.display = 'block';
    }

    // 회의 순서 로드
    const savedAgenda = localStorage.getItem('meetingAgenda');
    const agendaList = document.getElementById('agenda-list');
    agendaList.innerHTML = ''; // 초기화
    
    if (savedAgenda) {
        const items = savedAgenda.split(',').map(item => item.trim());
        items.forEach((item, index) => {
            if(item) {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${item}`;
                agendaList.appendChild(li);
            }
        });
    } else {
        agendaList.innerHTML = '<li>등록된 회의 순서가 없습니다.</li>';
    }
}

// 4. 관리자 모달 제어
const adminBtn = document.getElementById('admin-btn');
const adminModal = document.getElementById('admin-modal');
const closeAdmin = document.getElementById('close-admin');
const saveAdmin = document.getElementById('save-admin');

// 모달 열기 (간단한 비밀번호 확인 적용 가능, 현재는 생략)
adminBtn.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    document.getElementById('agenda-input').value = localStorage.getItem('meetingAgenda') || '';
    document.getElementById('youtube-id').value = localStorage.getItem('meetingBgmId') || '';
});

// 모달 닫기
closeAdmin.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

// 설정 저장
saveAdmin.addEventListener('click', () => {
    // 1. 회의 순서 저장
    const agenda = document.getElementById('agenda-input').value;
    localStorage.setItem('meetingAgenda', agenda);

    // 2. YouTube ID 저장
    const bgmId = document.getElementById('youtube-id').value;
    if(bgmId) {
        localStorage.setItem('meetingBgmId', bgmId);
    }

    // 3. QR 이미지 변환 및 저장 (Base64)
    const qrFile = document.getElementById('qr-upload').files[0];
    if (qrFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('meetingQr', e.target.result);
            loadSettings(); // 저장 완료 후 화면 새로고침
        };
        reader.readAsDataURL(qrFile);
    } else {
        loadSettings(); // 파일이 없으면 텍스트만 갱신
    }
    
    alert('저장되었습니다. 음악을 변경한 경우 새로고침(F5)이 필요할 수 있습니다.');
    adminModal.style.display = 'none';
});

// 초기 실행
window.onload = loadSettings;
