# Set encoding to UTF8 for clean console output
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   NEXFLOW GITHUB PAGES AUTO DEPLOY TOOL     " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
$gitCheck = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCheck) {
    Write-Host "[경고] 시스템에 Git이 설치되어 있지 않습니다." -ForegroundColor Yellow
    Write-Host "Git 다운로드 페이지를 브라우저로 엽니다. 설치를 마친 뒤 터미널/스크립트를 재실행해주세요." -ForegroundColor Yellow
    Start-Process "https://git-scm.com/download/win"
    Read-Host "종료하려면 엔터 키를 누르세요..."
    exit
}

Write-Host "[OK] Git 설치 확인 완료!" -ForegroundColor Green
Write-Host ""

# Git Init
if (-not (Test-Path .git)) {
    Write-Host "Git 저장소를 로컬에 생성(init)합니다..."
    git init
    git branch -M main
}

# Add & Commit
Write-Host "프로젝트 파일을 스테이징에 추가하고 커밋합니다..."
git add .
git commit -m "Initial commit of Nexflow platform prototype"

Write-Host "로컬 커밋 완료!" -ForegroundColor Green
Write-Host ""

# Remote repository configuration
$hasRemote = git remote
if ($hasRemote -contains "origin") {
    $remoteUrl = git remote get-url origin
    Write-Host "이미 등록된 원격 저장소 주소: $remoteUrl" -ForegroundColor Cyan
    $change = Read-Host "원격 저장소 주소를 변경하시겠습니까? (y/n)"
    if ($change -eq 'y' -or $change -eq 'Y') {
        git remote remove origin
        $newUrl = Read-Host "새로운 GitHub Repository URL을 입력하세요 (예: https://github.com/username/repo-name.git)"
        git remote add origin $newUrl
    }
} else {
    $newUrl = Read-Host "GitHub Repository URL을 입력하세요 (예: https://github.com/username/repo-name.git)"
    git remote add origin $newUrl
}

Write-Host ""
Write-Host "GitHub 원격 저장소로 업로드(Push)를 시도합니다..." -ForegroundColor Cyan
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[성공] 코드가 GitHub에 정상적으로 올라갔습니다!" -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Write-Host "이제 GitHub Pages 배포를 설정하세요:" -ForegroundColor Cyan
    Write-Host "1. 생성하신 GitHub Repository 웹페이지로 이동합니다."
    Write-Host "2. 상단 메뉴 [Settings] -> 좌측 [Pages] 탭으로 이동합니다."
    Write-Host "3. Build and deployment -> Branch 항목을 'main'으로 설정하고 [Save]를 누릅니다."
    Write-Host "4. 잠시 후 상단에 생성되는 URL을 통해 접속할 수 있습니다!"
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[오류] GitHub Push에 실패했습니다. GitHub 로그인 상태(Credential)나 저장소 URL을 확인해주세요." -ForegroundColor Red
}

Write-Host ""
Read-Host "종료하려면 엔터 키를 누르세요..."
