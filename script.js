// 1. 아날로그 시계 실시간 연동
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

// 2. 유튜브 플레이어 설정
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
            toggleBtn.style.background = "#d87d4a";
        } else {
            player.pauseVideo();
            statusText.textContent = "Music ON";
            toggleBtn.style.background = "#5d4037";
        }
        isPlaying = !isPlaying;
    });
}

// 3. 관리자 기능 및 데이터 바인딩
const adminModal = document.getElementById('admin-modal');
const openAdminBtn = document.getElementById('open-admin');
const closeAdminBtn = document.getElementById('close-admin');
const saveAdminBtn = document.getElementById('save-admin');

// 로컬 스토리지 데이터 로드
function loadData() {
    const title = localStorage.getItem('meetingTitle') || "교직원 회의";
    const agenda = localStorage.getItem('meetingAgenda') || "1. 개회 선언\n2. 학교장 인사말씀\n3. 부서별 공지사항\n4. 기타 토의\n5. 폐회";
    const qrUrl = localStorage.getItem('meetingQrUrl') || "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=WelcomeTeacher";

    document.getElementById('meeting-title').textContent = title;
    document.getElementById('qr-image').src = qrUrl;

    const list = document.getElementById('agenda-list');
    list.innerHTML = "";
    agenda.split('\n').forEach(item => {
        if (item.trim()) {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        }
    });
}

// 모달 제어
openAdminBtn.onclick = () => {
    document.getElementById('admin-title-input').value = localStorage.getItem('meetingTitle') || "교직원 회의";
    document.getElementById('admin-agenda-input').value = localStorage.getItem('meetingAgenda') || "";
    document.getElementById('admin-qr-input').value = localStorage.getItem('meetingQrUrl') || "";
    document.getElementById('admin-yt-input').value = localStorage.getItem('meetingYtId') || "jfKfPfyJRdk";
    adminModal.style.display = "flex";
};

closeAdminBtn.onclick = () => adminModal.style.display = "none";

saveAdminBtn.onclick = () => {
    localStorage.setItem('meetingTitle', document.getElementById('admin-title-input').value);
    localStorage.setItem('meetingAgenda', document.getElementById('admin-agenda-input').value);
    localStorage.setItem('meetingQrUrl', document.getElementById('admin-qr-input').value);
    localStorage.setItem('meetingYtId', document.getElementById('admin-yt-input').value);
    
    alert("저장되었습니다! 화면을 새로고침합니다.");
    location.reload();
};

window.onload = loadData;
