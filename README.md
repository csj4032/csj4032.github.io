## 子曰, 學而時習之, 不亦說呼. 有朋自遠方來, 不亦樂呼. 人不知而不慍, 不亦君子呼.

### 이름 : MMIX

### 거주 : 서울

### 직업 : 웹 프로그래머

### 메일 : csj4032@gmail.com

### 책정리

#### 프로그래밍 언어

##### 자바
* [이펙티브 자바](https://github.com/csj4032/enjoy-book/blob/master/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D_%EC%96%B8%EC%96%B4/%EC%9E%90%EB%B0%94/%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C%EC%9E%90%EB%B0%94.md)
* [자바병렬프로그래밍](https://github.com/csj4032/enjoy-book/blob/master/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D_%EC%96%B8%EC%96%B4/%EC%9E%90%EB%B0%94/%EC%9E%90%EB%B0%94%EB%B3%91%EB%A0%AC%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D.md)

### ETC

#### Jekyll

##### 서버 구동

```sh
bundle exec jekyll server
```

#### 포트폴리오 PDF

`portfolio/index.html` 이 원본이고, PDF 는 로컬 Chrome 을 헤드리스로 띄워 렌더한다.
내용을 고친 뒤 아래를 실행하면 `assets/portfolio/csj4032-portfolio.pdf` 가 갱신된다.

```sh
node scripts/build-portfolio-pdf.mjs
```
