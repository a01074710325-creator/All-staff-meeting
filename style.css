:root {
    --primary-brown: #5d4037;
    --accent-orange: #d87d4a;
    --bg-overlay: rgba(255, 253, 240, 0.6);
    --soft-white: #fffdf9;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Nanum Gothic', sans-serif;
}

/* 배경: 동화책 느낌의 따뜻한 그림 (이미지 URL 교체) */
.dashboard {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(var(--bg-overlay), var(--bg-overlay)), 
                      url('http://googleusercontent.com/image_collection/image_retrieval/18407587681376030800');
    background-size: cover;
    background-position: center;
    position: relative;
    padding: 40px;
    display: flex;
    flex-direction: column;
}

/* 좌측 상단: 아날로그 시계 */
.clock-area { position: absolute; top: 40px; left: 40px; }
.analog-clock {
    width: 180px;
    height: 180px;
    border: 6px solid var(--primary-brown);
    border-radius: 50%;
    position: relative;
    background: white;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.analog-clock .hand {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform-origin: bottom;
    background: var(--primary-brown);
    border-radius: 4px;
}
.hour { width: 6px; height: 50px; z-index: 3; }
.minute { width: 4px; height: 75px; z-index: 2; }
.second { width: 2px; height: 80px; background: var(--accent-orange); z-index: 4; }
.center-dot {
    position: absolute;
    top: 50%; left: 50%;
    width: 12px; height: 12px;
    background: var(--primary-brown);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
}
.number { position: absolute; font-weight: bold; color: var(--primary-brown); font-size: 1.2rem; }
.n12 { top: 10px; left: 50%; transform: translateX(-50%); }
.n3 { right: 10px; top: 50%; transform: translateY(-50%); }
.n6 { bottom: 10px; left: 50%; transform: translateX(-50%); }
.n9 { left: 10px; top: 50%; transform: translateY(-50%); }

/* 우측 상단: QR 영역 (확대됨) */
.qr-area { position: absolute; top: 40px; right: 40px; }
.qr-container {
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    text-align: center;
    border: 1px solid #eee;
}
.qr-label {
    font-family: 'Nanum Myeongjo', serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: var(--primary-brown);
    margin-bottom: 15px;
}
#qr-image {
    width: 200px; /* 크기 증가 */
    height: 200px;
    object-fit: contain;
}

/* 중앙 메인 콘텐츠 */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#meeting-title {
    font-family: 'Nanum Myeongjo', serif;
    font-size: 4rem;
    color: var(--primary-brown);
    margin-bottom: 50px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}
.agenda-wrapper {
    background: rgba(255, 255, 255, 0.7);
    padding: 40px 60px;
    border-radius: 30px;
    min-width: 600px;
    max-width: 800px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
}
#agenda-list {
    list-style: none;
    font-size: 1.8rem;
    color: #444;
}
#agenda-list li {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ccc;
    display: flex;
    align-items: center;
}
#agenda-list li::before {
    content: "🌸";
    margin-right: 15px;
    font-size: 1.4rem;
}

/* 하단 뮤직 및 설정 버튼 */
.music-area { position: absolute; bottom: 40px; right: 40px; }
.music-btn {
    background: var(--primary-brown);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 40px;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: 0.3s;
}
.music-btn:hover { background: var(--accent-orange); }

.admin-trigger { position: absolute; bottom: 40px; left: 40px; }
.admin-trigger button {
    background: none; border: none; font-size: 1.5rem; color: var(--primary-brown);
    cursor: pointer; opacity: 0.3;
}
.admin-trigger button:hover { opacity: 1; }

/* 모달 스타일 */
.modal {
    display: none; position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.5); z-index: 100; justify-content: center; align-items: center;
}
.modal-content {
    background: white; padding: 40px; border-radius: 20px; width: 500px;
}
.input-group { margin-bottom: 15px; }
.input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.input-group input, .input-group textarea {
    width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;
}
.modal-btns { display: flex; gap: 10px; margin-top: 20px; }
.save-btn { flex: 1; background: var(--primary-brown); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; }
.cancel-btn { flex: 1; background: #eee; border: none; padding: 12px; border-radius: 8px; cursor: pointer; }
