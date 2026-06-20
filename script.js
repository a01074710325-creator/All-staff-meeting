// DOM 로드 완료 후 안전하게 스크립트 실행
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupAdminEvents();
});

// 1. 아날로그 시계 업데이트
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

// 2. YouTube API (이 부분은 외부에서 접근 가능해야 하므로 전역 영역에 유지)
let player;
function onYouTubeIframeAPIReady() {
    const savedYtId = localStorage.getItem('meetingYtId') || 'jfKfPfyJRdk';
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

    if (toggleBtn) {
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
}

// 3. 초기 화면 데이터 세팅 함수
function loadDashboardData() {
    const title = localStorage.getItem('meetingTitle') || "교직원 회의";
    const agenda = localStorage.getItem('meetingAgenda') || "1. 개회 선언\n2. 학교장 인사말씀\n3. 부서별 공지사항\n4. 토의 및 협의\n5. 폐회";
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

    // 배경 이미지 로드
    const savedBg = localStorage.getItem('meetingBgImage');
    const dashboardEl = document.getElementById('dashboard-bg');
    if (savedBg) {
        dashboardEl.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${savedBg}')`;
    } else {
        const defaultBg = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974&auto=format&fit=crop';
        dashboardEl.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${defaultBg}')`;
    }
}

// 4. 관리자 모달 이벤트 바인딩 (수정된 핵심 로직)
function setupAdminEvents() {
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin');
    const closeAdminBtn = document.getElementById('close-admin');
    const saveAdminBtn = document.getElementById('save-admin');
    const bgUploadInput = document.getElementById('admin-bg-upload');

    // 모달 열기
    if (openAdminBtn) {
        openAdminBtn.addEventListener('click', () => {
            document.getElementById('admin-title-input').value = localStorage.getItem('meetingTitle') || "교직원 회의";
            document.getElementById('admin-agenda-input').value = localStorage.getItem('meetingAgenda') || "";
            document.getElementById('admin-qr-input').value = localStorage.getItem('meetingQrUrl') || "";
            document.getElementById('admin-yt-input').value = localStorage.getItem('meetingYtId') || "jfKfPfyJRdk";
            adminModal.style.display = "flex";
        });
    }

    // 모달 닫기
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.style.display = "none";
        });
    }

    // 데이터 저장
    if (saveAdminBtn) {
        saveAdminBtn.addEventListener('click', () => {
            localStorage.setItem('meetingTitle', document.getElementById('admin-title-input').value);
            localStorage.setItem('meetingAgenda', document.getElementById('admin-agenda-input').value);
            localStorage.setItem('meetingQrUrl', document.getElementById('admin-qr-input').value);
            localStorage.setItem('meetingYtId', document.getElementById('admin-yt-input').value);

            const file = bgUploadInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        localStorage.setItem('meetingBgImage', e.target.result);
                        executeSaveCompletion();
                    } catch (error) {
                        alert("⚠️ 이미지 용량이 너무 커서 저장에 실패했습니다.\n1MB 이하의 가벼운 이미지로 다시 시도해 주세요.");
                    }
                };
                reader.readAsDataURL(file);
            } else {
                executeSaveCompletion();
            }
        });
    }
}

// 5. 저장 완료 시 화면 갱신
function executeSaveCompletion() {
    alert("✅ 성공적으로 저장되었습니다! 대시보드를 새로고침합니다.");
    location.reload();
}
