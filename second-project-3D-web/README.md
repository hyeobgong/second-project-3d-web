# 3D 가방 쇼핑몰 - BagStore

3D 웹페이지 기술을 활용한 인터랙티브 가방 쇼핑몰 프로젝트입니다.

## 🎨 프로젝트 소개

Three.js를 이용하여 3D 가방 모델을 구현하고, 사용자가 마우스 드래그로 가방을 회전시킬 수 있는 인터랙티브한 쇼핑몰입니다.

## ✨ 주요 기능

- **3D 가방 모델**: Three.js로 구현된 입체적인 가방 디자인
- **인터랙티브 회전**: 마우스 드래그로 가방을 자유롭게 회전
- **터치 지원**: 모바일 기기에서 터치로 회전 가능
- **자동 회전**: 사용자 상호작용 없을 때 자동 회전
- **색상 선택**: 5가지 색상 옵션 (검정, 갈색, 은색, 올리브, 남색)
- **반응형 디자인**: 다양한 화면 크기에 대응
- **상품 슬라이더**: 인기 상품을 슬라이더로 표시

## 🛠️ 기술 스택

- **HTML5**: 마크업 구조
- **CSS3**: 스타일링 및 레이아웃
- **JavaScript (Vanilla)**: 상호작용 로직
- **Three.js**: 3D 그래픽 렌더링

## 📂 파일 구조

```
second-project-3D-web/
├── index.html      # 메인 HTML 파일
├── script.js       # JavaScript 로직 (3D 렌더링, 이벤트 처리)
├── styles.css      # 스타일 시트
├── .gitignore      # Git 무시 파일 목록
└── README.md       # 이 파일
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/hyeobgong/second-project-3d-web.git
cd second-project-3D-web
```

### 2. 브라우저에서 열기
```bash
# 간단하게 index.html 파일을 브라우저에서 열면 됩니다
# 또는 로컬 서버 사용 (권장)
python -m http.server 8000
# 그 후 http://localhost:8000 접속
```

## 🎮 사용 방법

### PC
- **마우스 드래그**: 가방을 드래그하여 회전시킵니다
- **색상 버튼**: 원하는 색상을 클릭하여 가방 색상을 변경합니다
- **슬라이더**: 좌우 화살표로 인기 상품을 탐색합니다

### 모바일
- **터치 드래그**: 손가락으로 드래그하여 가방을 회전시킵니다

## 📝 주요 코드 설명

### 3D 가방 생성
```javascript
function createBag() {
    bag = new THREE.Group();
    
    // 가방 본체
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1.8, 0.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: currentBagColor,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bag.add(body);
    
    // ... 추가 부품들 (손잡이, 포켓, 지퍼 등)
}
```

### 마우스 회전 제어
```javascript
function onMouseMove(event) {
    if (!isDragging) return;
    
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    
    bagRotation.y += (deltaX * Math.PI) / 500;
    bagRotation.x += (deltaY * Math.PI) / 500;
    
    previousMousePosition = { x: event.clientX, y: event.clientY };
}
```

## 📚 학습 내용

이 프로젝트를 통해 다음을 학습할 수 있습니다:
- Three.js를 이용한 3D 그래픽 렌더링
- 마우스/터치 이벤트 처리
- DOM 조작 및 동적 요소 생성
- CSS 그리드 레이아웃
- 색상 값 조작 (HEX 변환)

## 🎯 향후 개선 계획

- [ ] 추가 3D 모델 (신발, 시계 등)
- [ ] 장바구니 기능
- [ ] 결제 시스템
- [ ] 사용자 계정 및 로그인
- [ ] 상품 리뷰 및 평점
- [ ] 다국어 지원

## 📧 연락처

- GitHub: [@hyeobgong](https://github.com/hyeobgong)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

**마지막 업데이트**: 2026년 2월 15일
