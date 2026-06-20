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

// 2. YouTube ID 추출 함수 (URL 연동 지원)
function extractVideoID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url; // URL 형식이 아니면 입력값 자체를 반환
}

// 3. YouTube API
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
    const iconText = document.getElementById('music-icon');
    let isPlaying = false;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (!isPlaying) {
                player.playVideo();
                statusText.textContent = "Music OFF";
                iconText.textContent = "⏸️";
                toggleBtn.style.background = "#d87d4a";
            } else {
                player.pauseVideo();
                statusText.textContent = "Music ON";
                iconText.textContent = "🎵";
                toggleBtn.style.background = "#5d4037";
            }
            isPlaying = !isPlaying;
        });
    }
}

// 4. 저장된 데이터 불러오기
function loadDashboardData() {
    const title = localStorage.getItem('meetingTitle') || "교직원 회의";
    const agenda = localStorage.getItem('meetingAgenda') || "1. 개회 선언\n2. 학교장 인사말씀\n3. 부서별 공지사항\n4. 토의 및 협의";
    const qrImage = localStorage.getItem('meetingQrImage'); // 새로 추가된 부분

    document.getElementById('meeting-title').textContent = title;
    
    // QR 이미지 로드 (업로드된 이미지가 있으면 적용, 없으면 기본 API 생성 QR 적용)
    if (qrImage) {
        document.getElementById('qr-image').src = qrImage;
    } else {
        document.getElementById('qr-image').src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Welcome";
    }

    const list = document.getElementById('agenda-list');
    list.innerHTML = "";
    agenda.split('\n').forEach(item => {
        if (item.trim()) {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        }
    });

    const savedBg = localStorage.getItem('meetingBgImage');
    const dashboardEl = document.getElementById('dashboard-bg');
    if (savedBg) {
        dashboardEl.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${savedBg}')`;
    } else {
        const defaultBg = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974&auto=format&fit=crop';
        dashboardEl.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${defaultBg}')`;
    }
}

// 5. 관리자 모달 및 데이터 저장 프로세스
function setupAdminEvents() {
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin');
    const closeAdminBtn = document.getElementById('close-admin');
    const saveAdminBtn = document.getElementById('save-admin');
    
    const bgUploadInput = document.getElementById('admin-bg-upload');
    const qrUploadInput = document.getElementById('admin-qr-upload');

    // 모달 열 때 기존 텍스트 데이터 매핑
    if (openAdminBtn) {
        openAdminBtn.addEventListener('click', () => {
            document.getElementById('admin-title-input').value = localStorage.getItem('meetingTitle') || "교직원 회의";
            document.getElementById('admin-agenda-input').value = localStorage.getItem('meetingAgenda') || "";
            document.getElementById('admin-yt-input').value = localStorage.getItem('meetingYtUrl') || ""; // URL 보존
            adminModal.style.display = "flex";
        });
    }

    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => adminModal.style.display = "none");
    }

    // 비동기 이미지 파일 저장 함수 (Promise 기반)
    function saveFileToStorage(file, storageKey) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    localStorage.setItem(storageKey, e.target.result);
                } catch (error) {
                    console.error("저장 공간 초과:", error);
                    alert(`저장 용량이 초과되었습니다. 이미지 크기를 줄여주세요. (${storageKey})`);
                }
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }

    if (saveAdminBtn) {
        saveAdminBtn.addEventListener('click', async () => {
            // 텍스트 데이터 저장
            localStorage.setItem('meetingTitle', document.getElementById('admin-title-input').value);
            localStorage.setItem('meetingAgenda', document.getElementById('admin-agenda-input').value);
            
            // 유튜브 URL 연동 및 ID 변환 저장
            const ytInputUrl = document.getElementById('admin-yt-input').value;
            if(ytInputUrl) {
                localStorage.setItem('meetingYtUrl', ytInputUrl); // 입력한 URL 형태 유지용
                localStorage.setItem('meetingYtId', extractVideoID(ytInputUrl)); // 실제 API 구동용 ID
            }

            // 이미지 파일 업로드 처리 (순차적 비동기 처리)
            const bgFile = bgUploadInput.files[0];
            const qrFile = qrUploadInput.files[0];

            if (bgFile) await saveFileToStorage(bgFile, 'meetingBgImage');
            if (qrFile) await saveFileToStorage(qrFile, 'meetingQrImage');

            alert("✅ 모든 설정이 저장되었습니다. 대시보드를 새로고침합니다.");
            location.reload();
        });
    }
}
