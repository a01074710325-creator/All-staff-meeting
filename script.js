// 1. 실시간 아날로그 시계 로직 (부드럽게 연동)
function updateClock() {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hour = now.getHours();

    const secDeg = (sec / 60) * 360;
    const minDeg = ((min + sec/60) / 60) * 360;
    const hourDeg = ((hour % 12 + min/60) / 12) * 360;

    document.getElementById('sec-hand').style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    document.getElementById('min-hand').style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
}
setInterval(updateClock, 1000);
updateClock();

// 2. YouTube IFrame API 배경음악 컨트롤러
let player;
function onYouTubeIframeAPIReady() {
    const savedYtId = localStorage.getItem('meetingYtId') || 'jfKfPfyJRdk'; // 기본값: Lofi Girl
    player = new YT.Player('youtube-player', {
        height: '0', width: '0',
        videoId: savedYtId,
        playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': savedYtId },
        events: { 'onReady': onPlayerReady }
    });
}

function onPlayerReady(event) {
    const toggleBtn = document.getElementById('music-toggle');
    const statusText = document.getElementById('music-status');
    let isPlaying = false;

    toggleBtn.addEventListener('click', () => {
        if (!isPlaying) {
            player.playVideo();
            statusText.textContent = "Music OFF";
            toggleBtn.style.background = "#d87d4a"; // 활성화 시 오렌지톤으로 변경
        } else {
            player.pauseVideo();
            statusText.textContent = "Music ON";
            toggleBtn.style.background = "#5d4037";
        }
        isPlaying = !isPlaying;
    });
}

// 3. 데이터 로드 및 UI 바인딩 (배경화면 처리 포함)
function loadDashboardData() {
    // 회의 제목 및 QR 로드
    const title = localStorage.getItem('meetingTitle') || "교직원 회의";
    const agenda = localStorage.getItem('meetingAgenda') || "1. 개회 선언\n2. 학교장 인사말씀\n3. 부서별 공지사항\n4. 토의 및 협의\n5. 폐회";
    const qrUrl = localStorage.getItem('meetingQrUrl') || "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=WelcomeTeacher";

    document.getElementById('meeting-title').textContent = title;
    document.getElementById('qr-image').src = qrUrl;

    // 회의 식순 리스트 렌더링
    const list = document.getElementById('agenda-list');
    list.innerHTML = "";
    agenda.split('\n').forEach(item => {
        if (item.trim()) {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        }
    });

    // 업로드된 배경화면 적용 로직
    const savedBg = localStorage.getItem('meetingBgImage');
    const dashboardEl = document.getElementById('dashboard-bg');
    if (savedBg) {
        // 업로드된 커스텀 배경 적용
        dashboardEl.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${savedBg}')`;
    } else {
        // 업로드 이미지 없을 때 기본으로 노출할 따뜻한 일러스트 테마
        const defaultBg = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974&auto=format&fit=crop';
        dashboardEl.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${defaultBg}')`;
    }
}

// 4. 관리자 설정 모달 제어 및 파일 처리
const adminModal = document.getElementById('admin-modal');
const openAdminBtn = document.getElementById('open-admin');
const closeAdminBtn = document.getElementById('close-admin');
const saveAdminBtn = document.getElementById('save-admin');
const bgUploadInput = document.getElementById('admin-bg-upload');

openAdminBtn.onclick = () => {
    // 모달을 열 때 기존 저장 값 가져오기
    document.getElementById('admin-title-input').value = localStorage.getItem('meetingTitle') || "교직원 회의";
    document.getElementById('admin-agenda-input').value = localStorage.getItem('meetingAgenda') || "";
    document.getElementById('admin-qr-input').value = localStorage.getItem('meetingQrUrl') || "";
    document.getElementById('admin-yt-input').value = localStorage.getItem('meetingYtId') || "jfKfPfyJRdk";
    adminModal.style.display = "flex";
};

closeAdminBtn.onclick = () => { adminModal.style.display = "none"; };

// 저장하기 버튼 클릭 프로세스
saveAdminBtn.onclick = () => {
    localStorage.setItem('meetingTitle', document.getElementById('admin-title-input').value);
    localStorage.setItem('meetingAgenda', document.getElementById('admin-agenda-input').value);
    localStorage.setItem('meetingQrUrl', document.getElementById('admin-qr-input').value);
    localStorage.setItem('meetingYtId', document.getElementById('admin-yt-input').value);

    // 이미지 파일 업로드 여부 확인 후 Base64로 인코딩하여 저장
    const file = bgUploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                localStorage.setItem('meetingBgImage', e.target.result);
                completeSave();
            } catch (error) {
                alert("이미지 용량이 너무 큽니다! 더 작은 크기(1MB 이하 추천)의 이미지를 선택해주세요.");
            }
        };
        reader.readAsDataURL(file);
    } else {
        completeSave();
    }
};

function completeSave() {
    alert("성공적으로 저장되었습니다! 대시보드를 새로고침합니다.");
    location.reload();
}

// 초기화 구동
window.onload = loadDashboardData;
