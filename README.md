# ikkison.github.io

- 손익현 개발 블로그
- [ikkison.github.io](https://ikkison.github.io)

---

## setup

### project structure

```shell
ikkison.github.io/
├─ _config.yml        # 블로그 설정 파일
├─ _posts/            # 글(Markdown) 저장
├─ _layouts/          # 페이지 레이아웃 (기본 HTML 구조)
│  └─ default.html
├─ _includes/         # 재사용 가능한 HTML 조각 (헤더, 푸터, 광고 등)
├─ _site/             # 빌드 후 생성되는 최종 HTML
├─ assets/            # CSS, JS, 이미지
└─ index.md           # 메인 페이지
```

### Ubuntu

```shell
# 1. 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# 2. Ruby, Node.js, build-essential 설치
sudo apt install ruby-full build-essential zlib1g-dev nodejs git -y

# 3. 환경 변수 설정
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 4. Bundler 및 Jekyll 설치
gem install bundler jekyll

# 5. 새 블로그 생성
jekyll new myblog
cd myblog

# 6. 서버 실행
bundle exec jekyll serve
```

### Windows

1. Ruby 설치
   - RubyInstaller
   - 다운로드 & 설치
2. 설치 시 MSYS2 옵션 체크
   - 환경 변수 확인
3. 설치 시 자동으로 PATH 등록됨
    - Bundler 및 Jekyll 설치
  
    ```shell
    gem install bundler jekyll
    ```

4. 블로그 생성 및 실행

    ```shell
    jekyll new myblog
    cd myblog
    bundle exec jekyll serve
    ```

    - 브라우저에서 http://localhost:4000 접속

### macOS

1. Xcode Command Line Tools 설치

    ```shell
    xcode-select --install
    ```

2. Homebrew 설치 (없다면)

    ```shell
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

3. Ruby 설치

    ```shell
    brew install ruby node 
    ```

4. 환경 변수 설정

    ```shell
    echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
    ```

5. Bundler 및 Jekyll 설치

    ```shell
    gem install bundler jekyll
    ```

6. 블로그 생성 및 실행

    ```shell
    jekyll new myblog
    cd myblog
    bundle exec jekyll 
    ```

    - 브라우저에서 http://localhost:4000 접속

--- 

## editor

- https://prose.io/
