// ==================== Three.js 3D 가방 쇼케이스 ====================

let scene, camera, renderer, bag;
let currentBagColor = 0x1a1a1a;

// 마우스 회전 제어 변수
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let bagRotation = { x: 0, y: 0 };
let autoRotate = true;

function initThreeJS() {
    // Scene 설정
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera 설정
    const canvas = document.getElementById('bagCanvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer 설정
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // 3D 가방 생성
    createBag();

    // 애니메이션 루프
    animate();

    // 마우스 이벤트 핸들러
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    // 윈도우 리사이즈 핸들러
    window.addEventListener('resize', onWindowResize);
}

function createBag() {
    // 가방 그룹
    bag = new THREE.Group();

    // 가방 본체 (큐브 기반)
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1.8, 0.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: currentBagColor,
        shininess: 100,
        emissive: 0x000000
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0;
    bag.add(body);

    // 가방 손잡이 (곡선)
    const handleGeometry = new THREE.TorusGeometry(0.6, 0.15, 16, 100, Math.PI);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: currentBagColor,
        shininess: 100
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.castShadow = true;
    handle.receiveShadow = true;
    handle.position.y = 1.3;
    handle.position.z = 0;
    handle.rotation.x = Math.PI / 2;
    bag.add(handle);

    // 가방 앞면 포켓
    const pocketGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.05);
    const pocketMaterial = new THREE.MeshPhongMaterial({
        color: adjustColor(currentBagColor, -0.2),
        shininess: 80
    });
    const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
    pocket.castShadow = true;
    pocket.position.y = -0.2;
    pocket.position.z = 0.43;
    bag.add(pocket);

    // 가방 밑면 테두리
    const bottomGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8);
    const bottomMaterial = new THREE.MeshPhongMaterial({
        color: adjustColor(currentBagColor, -0.3),
        shininess: 100
    });
    const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottom.castShadow = true;
    bottom.position.y = -0.95;
    bag.add(bottom);

    // 지퍼 데코레이션
    const zipperGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.02);
    const zipperMaterial = new THREE.MeshPhongMaterial({
        color: 0xc0c0c0,
        shininess: 120
    });
    const zipper = new THREE.Mesh(zipperGeometry, zipperMaterial);
    zipper.position.z = 0.42;
    bag.add(zipper);

    scene.add(bag);
}

function updateBagColor(newColor) {
    currentBagColor = newColor;
    
    // 기존 가방 제거
    scene.remove(bag);
    
    // 새로운 색상으로 가방 생성
    createBag();
}

function adjustColor(color, factor) {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;

    const adjusted = new THREE.Color(r / 255, g / 255, b / 255);
    if (factor < 0) {
        adjusted.multiplyScalar(1 + factor);
    } else {
        adjusted.addScalar(factor);
    }

    return adjusted.getHex();
}

function animate() {
    requestAnimationFrame(animate);

    // 가방 회전
    if (bag) {
        // 자동 회전 (사용자가 드래그 중이 아닐 때)
        if (!isDragging && autoRotate) {
            bagRotation.y += 0.01;
            bagRotation.x += 0.0005;
        }

        bag.rotation.y = bagRotation.y;
        bag.rotation.x = bagRotation.x;
    }

    renderer.render(scene, camera);
}

// 마우스 이벤트 핸들러
function onMouseDown(event) {
    isDragging = true;
    autoRotate = false;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // 마우스 이동에 따라 회전각 업데이트
    bagRotation.y += (deltaX * Math.PI) / 500;
    bagRotation.x += (deltaY * Math.PI) / 500;

    // 회전 각도 제한
    bagRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, bagRotation.x));

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isDragging = false;
    autoRotate = true;
}

function onMouseLeave() {
    isDragging = false;
    autoRotate = true;
}

// 터치 이벤트 핸들러
function onTouchStart(event) {
    isDragging = true;
    autoRotate = false;
    const touch = event.touches[0];
    previousMousePosition = { x: touch.clientX, y: touch.clientY };
}

function onTouchMove(event) {
    if (!isDragging) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - previousMousePosition.x;
    const deltaY = touch.clientY - previousMousePosition.y;

    bagRotation.y += (deltaX * Math.PI) / 500;
    bagRotation.x += (deltaY * Math.PI) / 500;

    bagRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, bagRotation.x));

    previousMousePosition = { x: touch.clientX, y: touch.clientY };
}

function onTouchEnd() {
    isDragging = false;
    autoRotate = true;
}

function onWindowResize() {
    const canvas = document.getElementById('bagCanvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// ==================== 색상 선택 기능 ====================

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Active 상태 업데이트
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // 색상 업데이트
        const colorHex = this.getAttribute('data-color');
        const colorInt = parseInt(colorHex.replace('#', ''), 16);
        updateBagColor(colorInt);
    });
});

// ==================== 인기상품 데이터 ====================

const popularProducts = [
    { name: '프리미엄 토트백', price: '85,000', icon: '👜', rating: '★★★★★ (234)' },
    { name: '미니 크로스백', price: '45,000', icon: '👝', rating: '★★★★☆ (156)' },
    { name: '캠퍼스 백팩', price: '65,000', icon: '🎒', rating: '★★★★★ (342)' },
    { name: '프리미엄 레더 백팩', price: '189,000', icon: '👜', rating: '★★★★★ (528)' },
    { name: '여행용 더플백', price: '125,000', icon: '🎒', rating: '★★★★☆ (89)' },
    { name: '클러치백', price: '35,000', icon: '👝', rating: '★★★★★ (203)' },
    { name: '우편배달백', price: '55,000', icon: '👜', rating: '★★★★☆ (167)' },
    { name: '백팩 미니', price: '39,000', icon: '🎒', rating: '★★★★★ (412)' },
    { name: '숄더백', price: '75,000', icon: '👜', rating: '★★★★☆ (278)' },
    { name: '핸드백', price: '95,000', icon: '👝', rating: '★★★★★ (521)' },
];

// ==================== 슬라이더 기능 ====================

let currentSlide = 0;
const itemsPerView = 6;

function renderProducts() {
    const track = document.getElementById('productsTrack');
    track.innerHTML = '';

    popularProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₩ ${product.price}</div>
                <div class="product-rating">${product.rating}</div>
            </div>
        `;
        track.appendChild(card);
    });
}

function updateSliderPosition() {
    const track = document.getElementById('productsTrack');
    const itemWidth = track.children[0]?.offsetWidth || 0;
    const gap = 16; // CSS gap 값
    const offset = -(currentSlide * (itemWidth + gap));
    track.style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
    if (currentSlide < popularProducts.length - itemsPerView) {
        currentSlide++;
        updateSliderPosition();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSliderPosition();
    }
}

// 슬라이더 버튼 이벤트
document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// 더보기 버튼
document.querySelector('.view-more-btn').addEventListener('click', () => {
    alert('총 ' + popularProducts.length + '개의 상품이 있습니다.');
});

// 장바구니 추가 버튼
document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    const bagName = document.getElementById('bag-name').textContent;
    const color = document.querySelector('.color-btn.active').getAttribute('title');
    alert(`"${bagName}" (${color})\n좋아하는 상품을 장바구니에 추가했습니다! 🎉`);
});

// ==================== 초기화 ====================

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // 약간의 지연 후 Three.js 초기화
    setTimeout(() => {
        initThreeJS();
    }, 100);

    // 윈도우 리사이즈 시 슬라이더 업데이트
    window.addEventListener('resize', () => {
        currentSlide = 0;
        updateSliderPosition();
    });

    // 초기 슬라이더 위치 설정
    setTimeout(() => {
        updateSliderPosition();
    }, 50);
});
