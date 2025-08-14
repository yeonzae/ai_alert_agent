## 🎨 디자인 콘셉트

* **톤 & 무드**: 세련된 미니멀 (Glassmorphism + Pastel Accents)
* **배경**: 반투명 White(60%) + Backdrop Blur(20px) → 라이트모드 중심
* **포인트 컬러**

  * Price Trigger: **Pastel Blue**
  * News Trigger: **Pastel Teal**
  * Economic Indicator: **Pastel Orange**
  * Action: **Pastel Green**
  * Risk: **Pastel Red**
* **폰트**

  * **Serif**: Playfair Display (단계 타이틀, 전략명)
  * **Sans Serif**: Inter (입력 폼, 설명 텍스트, 버튼)
* **아이콘 스타일**: Outline + Pastel Fill

---

## 📐 레이아웃 구조

### 1. Header (Top Flow Mini-map)

* **구성**: Trigger → Filter → Action → Risk
* **표시 방식**: 작은 아이콘 + Serif 단계명, 현재 단계는 Pastel Accent 배경
* **폰트**: Serif (Playfair Display, 16pt, SemiBold)
* **라인**: 1px Semi-transparent White

---

### 2. Main Form Area (Card Stepper)

* **카드 크기**: 640px width, 80% height, Center Align
* **카드 스타일**:

  * Glassmorphism: rgba(255,255,255,0.6), blur(20px), 1px white border
  * Corner Radius: 24px
  * Shadow: Soft (0, 8px, 24px, rgba(0,0,0,0.08))
* **입력 필드**:

  * Label: Serif (Playfair, 14pt, Medium)
  * Input: Sans Serif (Inter, 14pt, Regular), Rounded 8px, Border 1px rgba(0,0,0,0.08)
* **컬러 구분**:

  * Price Trigger: Accent Border + Icon in Pastel Blue
  * News: Pastel Teal Tag
  * Economic Indicator: Pastel Orange Tag
* **UI 패턴**: Step 1·2에서 Price/News/Indicator 조건 모두 보이되, News·Indicator는 우측에 작은 Badge로 표시

---

### 3. Right Preview Panel

* **위치**: 카드 오른쪽 320px 영역
* **구성**:

  * Strategy Title (Serif, 20pt, Bold)
  * Condition Summary List (Sans Serif, 14pt)
  * Notification Channels (Icon row)
  * Mini Sparkline Chart
* **스타일**: Glass Panel, blur(16px), radius 16px

---

### 4. Footer Navigation

* **구성**: Prev / Next 버튼, 마지막 단계에서 Save & Activate 버튼
* **버튼 스타일**: Rounded 12px, Pastel Gradient Fill, Sans Serif Bold

---

## 🖥 API 연동 흐름 대응 UI 표시

* Step 1에서 **"Detecting Available Data Sources..."** 로딩 애니메이션 → 가격/뉴스/경제지표 API 연결 상태 아이콘
* Step 3에서 Telegram Connect 시 API Key 입력 → 즉시 검증 (BE→Telegram API)
* Step 4에서 저장 시 `/agents` POST 요청 후 성공 알림 Toast

---

## 📝 와이어프레임 (Mermaid Layout)

```mermaid
flowchart LR
    subgraph HEADER[Flow Mini-map: Trigger → Filter → Action → Risk]
    end

    subgraph MAIN[Main Content]
        direction LR
        FORM[Active Card Stepper (Glassmorphism, Serif Title, Color Accent)]
        PREVIEW[Strategy Preview Card (Glass Panel)]
    end

    subgraph FOOTER[Footer Navigation]
        BTN1[Prev] --> BTN2[Next / Save & Activate]
    end

    HEADER --> MAIN
    MAIN --> FOOTER
```