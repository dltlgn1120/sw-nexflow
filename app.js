// NEXFLOW - Real-time Project Collaboration Platform Prototype JS
const DEFAULT_MEMBERS = [
    { email: 'user@nexflow.com', name: '김관리 PM', role: 'Product Manager', status: 'active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
    { email: 'designer@nexflow.com', name: '이디자인 UI/UX', role: 'UX/UI Designer', status: 'active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=60' },
    { email: 'dev1@nexflow.com', name: '박개발 FE', role: 'Developer', status: 'active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=60' },
    { email: 'dev2@nexflow.com', name: '최개발 BE', role: 'Developer', status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
    { email: 'qa@nexflow.com', name: '정품질 QA', role: 'QA Engineer', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60' }
];

const DEFAULT_TASKS = [
    { id: 'task-1', title: '요구사항 상세 정의서(PRD) 도출 및 확정', desc: '이해관계자와의 미팅을 바탕으로 회원가입, 프로젝트 생성, 알림 및 대시보드 통계 기능 범위를 정리합니다.', assigneeEmail: 'user@nexflow.com', status: 'done', dueDate: '2026-07-14' },
    { id: 'task-2', title: '사용자 중심 UX/UI 와이어프레임 설계', desc: '모바일 및 웹 관리자 화면의 레이아웃 흐름도를 그립니다. 인터랙션 시뮬레이션을 위한 프로토타입 작성.', assigneeEmail: 'designer@nexflow.com', status: 'done', dueDate: '2026-07-31' },
    { id: 'task-3', title: '모바일 앱 메인 로그인 및 가입 인터페이스 개발', desc: '소셜 로그인(Google, Apple) 및 이메일 기반 회원가입 퍼블리싱 및 클라이언트 폼 유효성 검사 적용.', assigneeEmail: 'dev1@nexflow.com', status: 'doing', dueDate: '2026-08-15' },
    { id: 'task-4', title: '웹 대시보드 통계 시각화 모듈 구축', desc: '프로젝트 완료율 및 담당자별 업무 로드 통계를 표현할 컴포넌트를 설계하고 CSS 바/원형 차트를 연동합니다.', assigneeEmail: 'dev1@nexflow.com', status: 'doing', dueDate: '2026-08-25' },
    { id: 'task-5', title: '실시간 푸시 알림 및 이벤트 수신 모듈 개발', desc: '소켓 통신 기반 백엔드 알림 전달 시스템을 설계하고 마감일 하루 전 자동으로 마일스톤 푸시를 예약합니다.', assigneeEmail: 'dev2@nexflow.com', status: 'todo', dueDate: '2026-09-10' },
    { id: 'task-6', title: 'QA 통합 테스트 및 시나리오 검증', desc: '기능 및 비기능(2초 이내 응답속도, 10,000명 동시접속 부하테스트 등) 검증 및 최종 배포 전 버그 픽스 수행.', assigneeEmail: 'qa@nexflow.com', status: 'todo', dueDate: '2026-10-10' }
];

const DEFAULT_NOTIFICATIONS = [
    { id: 'noti-1', msg: '이디자인 UI/UX님이 "UX/UI 와이어프레임 설계" 업무를 완료로 변경했습니다.', time: '10분 전', unread: true },
    { id: 'noti-2', msg: '박개발 FE님이 "메인 로그인 인터페이스 개발" 업무의 담당자로 지정되었습니다.', time: '2시간 전', unread: true },
    { id: 'noti-3', msg: '김관리 PM님이 새로운 프로젝트 "NEXFLOW 앱 런칭"을 생성했습니다.', time: '1일 전', unread: false }
];

const DEFAULT_CHATS = [
    { sender: '이디자인 UI/UX', text: '안녕하세요! 와이어프레임 디자인 완료했습니다. 확인 부탁드려요.', time: '오후 3:10', self: false },
    { sender: '김관리 PM', text: '네, 이디자인님. 확인 후 대시보드 연동 작업 박개발님께 인계하겠습니다.', time: '오후 3:12', self: true },
    { sender: '박개발 FE', text: '수고하셨습니다! 대시보드 뷰 개발 시 적극 참고할게요.', time: '오후 3:15', self: false }
];

class NexflowApp {
    constructor() {
        this.state = {
            currentUser: null,
            members: [],
            tasks: [],
            notifications: [],
            chats: [],
            phoneTab: 'main',
            webTab: 'dashboard',
            phoneFilter: 'all'
        };
        
        this.init();
    }

    init() {
        this.loadState();
        this.registerGlobalEvents();
        this.startClock();
        this.renderAll();
    }

    // Load state from localStorage or set defaults
    loadState() {
        const storedUser = localStorage.getItem('nf_current_user');
        const storedMembers = localStorage.getItem('nf_members');
        const storedTasks = localStorage.getItem('nf_tasks');
        const storedNoti = localStorage.getItem('nf_notifications');
        const storedChats = localStorage.getItem('nf_chats');

        if (storedUser) {
            this.state.currentUser = JSON.parse(storedUser);
        } else {
            // Default: Auto login guest for premium UX demonstration
            this.state.currentUser = DEFAULT_MEMBERS[0]; 
            localStorage.setItem('nf_current_user', JSON.stringify(this.state.currentUser));
        }

        this.state.members = storedMembers ? JSON.parse(storedMembers) : [...DEFAULT_MEMBERS];
        this.state.tasks = storedTasks ? JSON.parse(storedTasks) : [...DEFAULT_TASKS];
        this.state.notifications = storedNoti ? JSON.parse(storedNoti) : [...DEFAULT_NOTIFICATIONS];
        this.state.chats = storedChats ? JSON.parse(storedChats) : [...DEFAULT_CHATS];

        this.saveState();
    }

    saveState() {
        localStorage.setItem('nf_members', JSON.stringify(this.state.members));
        localStorage.setItem('nf_tasks', JSON.stringify(this.state.tasks));
        localStorage.setItem('nf_notifications', JSON.stringify(this.state.notifications));
        localStorage.setItem('nf_chats', JSON.stringify(this.state.chats));
        if (this.state.currentUser) {
            localStorage.setItem('nf_current_user', JSON.stringify(this.state.currentUser));
        } else {
            localStorage.removeItem('nf_current_user');
        }
    }

    resetDemo() {
        localStorage.clear();
        this.loadState();
        this.state.phoneTab = 'main';
        this.state.webTab = 'dashboard';
        this.state.phoneFilter = 'all';
        this.renderAll();
        this.triggerPushNotification('데모 데이터가 초기화되었습니다.');
        this.addActivityLog('System', '데모 환경을 리셋했습니다.');
    }

    registerGlobalEvents() {
        // Clock tick
        setInterval(() => this.updateClock(), 60000);

        // Forms and Modals
        document.getElementById('phone-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login(document.getElementById('phone-email-input').value);
        });

        document.getElementById('phone-signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.signup(
                document.getElementById('phone-reg-name').value,
                document.getElementById('phone-reg-email').value,
                document.getElementById('phone-reg-pw').value
            );
        });

        document.getElementById('phone-chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendChatMessage();
        });

        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        document.getElementById('reset-demo-btn').addEventListener('click', () => {
            this.resetDemo();
        });

        // Navigation signup/login toggle
        document.getElementById('go-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchPhoneView('signup');
        });

        document.getElementById('go-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchPhoneView('login');
        });
    }

    // --- Time system ---
    startClock() {
        this.updateClock();
    }

    updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        const timeStr = `${ampm} ${hours}:${minutes}`;
        const clockDisplay = document.getElementById('clock-display');
        const phoneClock = document.getElementById('phone-clock');

        if (clockDisplay) clockDisplay.innerText = timeStr;
        if (phoneClock) phoneClock.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // --- Authentication ---
    login(email) {
        const found = this.state.members.find(m => m.email === email);
        if (found) {
            this.state.currentUser = found;
            this.saveState();
            this.triggerPushNotification(`${found.name}님으로 로그인하였습니다.`);
            this.addActivityLog(found.name, '로그인 하였습니다.');
            this.state.phoneTab = 'main';
            this.renderAll();
        } else {
            // New guest auto-registration to keep demo premium and user-friendly
            const name = email.split('@')[0];
            const newMember = {
                email: email,
                name: `${name} 게스트`,
                role: 'Developer',
                status: 'active',
                avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*100000)}?w=80&auto=format&fit=crop&q=60`
            };
            this.state.members.push(newMember);
            this.state.currentUser = newMember;
            this.saveState();
            this.triggerPushNotification(`${newMember.name} 계정이 생성 및 로그인되었습니다.`);
            this.addActivityLog(newMember.name, '가입 및 로그인 하였습니다.');
            this.state.phoneTab = 'main';
            this.renderAll();
        }
    }

    quickLogin(provider) {
        const randomNum = Math.floor(Math.random() * 1000);
        const name = `${provider} 유저${randomNum}`;
        const email = `social_${provider.toLowerCase()}_${randomNum}@nexflow.com`;
        
        const newMember = {
            email: email,
            name: name,
            role: 'Developer',
            status: 'active',
            avatar: provider === 'Google' 
                ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60'
                : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=60'
        };
        
        this.state.members.push(newMember);
        this.state.currentUser = newMember;
        this.saveState();
        this.triggerPushNotification(`${provider} 계정(${name})으로 간편 로그인했습니다.`);
        this.addActivityLog(name, `${provider} 소셜 로그인을 완료했습니다.`);
        this.state.phoneTab = 'main';
        this.renderAll();
    }

    signup(name, email, pw) {
        if (this.state.members.find(m => m.email === email)) {
            this.triggerPushNotification('이미 가입된 이메일 주소입니다.');
            return;
        }
        const newMember = {
            email: email,
            name: name,
            role: 'Developer',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=60'
        };
        this.state.members.push(newMember);
        this.state.currentUser = newMember;
        this.saveState();
        this.triggerPushNotification('회원가입이 완료되었습니다.');
        this.addActivityLog(name, '신규 회원가입 후 자동 로그인했습니다.');
        this.state.phoneTab = 'main';
        this.renderAll();
    }

    logout() {
        const name = this.state.currentUser ? this.state.currentUser.name : '사용자';
        this.addActivityLog(name, '로그아웃 하였습니다.');
        this.state.currentUser = null;
        this.saveState();
        this.state.phoneTab = 'login';
        this.renderAll();
    }

    // --- Tab Navigation ---
    switchPhoneTab(tabName, element) {
        if (!this.state.currentUser) {
            this.state.phoneTab = 'login';
            this.renderAll();
            return;
        }
        
        this.state.phoneTab = tabName;
        
        // Handle Active states visually
        if (element) {
            const tabs = document.querySelectorAll('.phone-tab-bar .tab-item');
            tabs.forEach(t => t.classList.remove('active'));
            element.classList.add('active');
        }
        
        this.renderPhoneViews();
    }

    switchPhoneView(viewName) {
        const views = ['login', 'signup', 'main', 'tasks', 'chat', 'notifications', 'settings'];
        views.forEach(v => {
            const el = document.getElementById(`phone-${v}-view`);
            if (el) el.classList.remove('active');
        });
        
        const activeEl = document.getElementById(`phone-${viewName}-view`);
        if (activeEl) activeEl.classList.add('active');

        // Hide navigation bar on Auth views
        const nav = document.getElementById('phone-navigation-bar');
        if (nav) {
            if (viewName === 'login' || viewName === 'signup') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'flex';
            }
        }
    }

    switchWebTab(tabName, element) {
        this.state.webTab = tabName;
        
        if (element) {
            const tabs = document.querySelectorAll('.web-nav-tabs .web-tab-btn');
            tabs.forEach(t => t.classList.remove('active'));
            element.classList.add('active');
        }

        const panes = ['dashboard', 'kanban', 'members'];
        panes.forEach(p => {
            const el = document.getElementById(`web-pane-${p}`);
            if (el) el.classList.remove('active');
        });

        const activePane = document.getElementById(`web-pane-${tabName}`);
        if (activePane) activePane.classList.add('active');

        this.renderWebViews();
    }

    filterPhoneTasks(status, element) {
        this.state.phoneFilter = status;
        if (element) {
            const chips = document.querySelectorAll('.phone-filter-bar .filter-chip');
            chips.forEach(c => c.classList.remove('active'));
            element.classList.add('active');
        }
        this.renderPhoneTaskList();
    }

    // --- Tasks Modal logic ---
    openPhoneTaskModal(taskId = null) {
        const modal = document.getElementById('task-modal');
        const titleInput = document.getElementById('task-title-input');
        const descInput = document.getElementById('task-desc-input');
        const assigneeInput = document.getElementById('task-assignee-input');
        const statusInput = document.getElementById('task-status-input');
        const dueInput = document.getElementById('task-due-input');
        const editIdInput = document.getElementById('task-edit-id');
        const submitBtn = document.getElementById('task-submit-btn');
        const modalTitle = document.getElementById('task-modal-title');

        // Render assignee select options
        assigneeInput.innerHTML = this.state.members.map(m => `
            <option value="${m.email}">${m.name} (${m.role})</option>
        `).join('');

        if (taskId) {
            // Edit mode
            const task = this.state.tasks.find(t => t.id === taskId);
            if (!task) return;
            
            modalTitle.innerText = '업무 수정';
            editIdInput.value = task.id;
            titleInput.value = task.title;
            descInput.value = task.desc;
            assigneeInput.value = task.assigneeEmail;
            statusInput.value = task.status;
            dueInput.value = task.dueDate;
            submitBtn.innerText = '수정 완료';
        } else {
            // Create mode
            modalTitle.innerText = '업무 생성';
            editIdInput.value = '';
            titleInput.value = '';
            descInput.value = '';
            assigneeInput.value = this.state.currentUser ? this.state.currentUser.email : this.state.members[0].email;
            statusInput.value = 'todo';
            
            // Set default due date to 7 days from now
            const defaultDue = new Date();
            defaultDue.setDate(defaultDue.getDate() + 7);
            dueInput.value = defaultDue.toISOString().split('T')[0];
            submitBtn.innerText = '생성하기';
        }

        modal.classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('task-modal').classList.remove('active');
    }

    saveTask() {
        const editId = document.getElementById('task-edit-id').value;
        const title = document.getElementById('task-title-input').value;
        const desc = document.getElementById('task-desc-input').value;
        const assigneeEmail = document.getElementById('task-assignee-input').value;
        const status = document.getElementById('task-status-input').value;
        const dueDate = document.getElementById('task-due-input').value;

        const assignee = this.state.members.find(m => m.email === assigneeEmail);
        const assigneeName = assignee ? assignee.name : '미지정';

        if (editId) {
            // Edit
            const index = this.state.tasks.findIndex(t => t.id === editId);
            if (index !== -1) {
                const oldTask = this.state.tasks[index];
                this.state.tasks[index] = { id: editId, title, desc, assigneeEmail, status, dueDate };
                
                // Trigger notification if status changed
                if (oldTask.status !== status) {
                    const statusText = status === 'todo' ? '대기 중' : status === 'doing' ? '진행 중' : '완료';
                    this.sendSystemNotification(`"${title}" 업무 상태가 [${statusText}]으로 변경되었습니다.`, assigneeEmail);
                }
                this.addActivityLog(this.state.currentUser.name, `"${title}" 업무를 수정했습니다.`);
                this.triggerPushNotification(`업무 "${title}"가 수정되었습니다.`);
            }
        } else {
            // Create
            const newId = `task-${Date.now()}`;
            const newTask = { id: newId, title, desc, assigneeEmail, status, dueDate };
            this.state.tasks.push(newTask);
            
            this.sendSystemNotification(`신규 업무 "${title}"가 등록되어 ${assigneeName}님에게 할당되었습니다.`, assigneeEmail);
            this.addActivityLog(this.state.currentUser.name, `신규 업무 "${title}"를 추가했습니다.`);
            this.triggerPushNotification(`새 업무가 할당되었습니다: "${title}"`);
        }

        this.saveState();
        this.closeTaskModal();
        this.renderAll();
    }

    deleteTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm(`"${task.title}" 업무를 삭제하시겠습니까?`)) {
            this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
            this.addActivityLog(this.state.currentUser.name, `"${task.title}" 업무를 삭제했습니다.`);
            this.triggerPushNotification(`업무 "${task.title}"가 삭제되었습니다.`);
            this.saveState();
            this.renderAll();
        }
    }

    // --- Drag and Drop Kanban (HTML5) ---
    allowDrop(ev) {
        ev.preventDefault();
        const colId = ev.currentTarget.id;
        const container = document.querySelector(`#${colId} .column-cards-container`);
        if (container) {
            container.classList.add('drag-over');
        }
    }

    drag(ev, taskId) {
        ev.dataTransfer.setData('text/plain', taskId);
        
        // Remove drag-over highlights everywhere just in case
        document.querySelectorAll('.column-cards-container').forEach(c => {
            c.classList.remove('drag-over');
        });
    }

    drop(ev, targetStatus) {
        ev.preventDefault();
        
        // Remove highlights
        document.querySelectorAll('.column-cards-container').forEach(c => {
            c.classList.remove('drag-over');
        });

        const taskId = ev.dataTransfer.getData('text/plain');
        const task = this.state.tasks.find(t => t.id === taskId);
        
        if (task && task.status !== targetStatus) {
            const oldStatus = task.status;
            task.status = targetStatus;
            
            const statusMap = { 'todo': '대기 중', 'doing': '진행 중', 'done': '완료됨' };
            const msg = `"${task.title}" 업무 상태가 [${statusMap[oldStatus]}]에서 [${statusMap[targetStatus]}]으로 변경되었습니다.`;
            
            this.sendSystemNotification(msg, task.assigneeEmail);
            this.addActivityLog(this.state.currentUser.name, `"${task.title}" 업무를 [${statusMap[targetStatus]}] 상태로 이동했습니다.`);
            this.triggerPushNotification(`업무 이동: "${task.title}" -> ${statusMap[targetStatus]}`);
            
            this.saveState();
            this.renderAll();
        }
    }

    // --- Collaboration & Real-time Chat ---
    sendChatMessage() {
        const input = document.getElementById('phone-chat-input');
        const text = input.value.trim();
        if (!text) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${ampm} ${hours}:${minutes}`;

        const senderName = this.state.currentUser ? this.state.currentUser.name : '게스트';

        const newMsg = {
            sender: senderName,
            text: text,
            time: timeStr,
            self: true
        };

        this.state.chats.push(newMsg);
        input.value = '';
        this.saveState();
        this.renderPhoneChatView();
        this.renderPhoneMainView(); // preview card update

        // Real-time reply simulation (Bot reply after 1.2s to wow the user)
        setTimeout(() => {
            this.simulateTeamReply(text);
        }, 1200);
    }

    simulateTeamReply(userMessage) {
        const teamMessages = [
            "그렇군요! 제가 바로 API 엔드포인트 수정해보겠습니다.",
            "좋은 의견입니다. 대시보드 통계 계산 수식도 업데이트해야겠네요.",
            "확인했습니다. 이 부분 칸반 보드에도 업데이트해 놓을게요!",
            "회의 시작 전에 다들 한 번씩 업무 마감일 체크 부탁드립니다.",
            "넵, QA 테스트 케이스 시나리오에 해당 케이스도 추가했습니다."
        ];
        
        // Select random response
        let replyText = teamMessages[Math.floor(Math.random() * teamMessages.length)];
        
        // Context aware simple answers
        if (userMessage.includes('디자인') || userMessage.includes('시안') || userMessage.includes('UI')) {
            replyText = "디자인 시안은 피그마 피드에 업로드 해두었으니 참고해 주세요!";
        } else if (userMessage.includes('QA') || userMessage.includes('버그') || userMessage.includes('테스트')) {
            replyText = "현재 1차 통합 테스트 중 발견된 마이너 버그 2개 외엔 특이사항 없습니다.";
        } else if (userMessage.includes('마감') || userMessage.includes('일정') || userMessage.includes('언제')) {
            replyText = "마감 시간 임박한 업무들은 대시보드 리마인더 탭에서 확인하실 수 있습니다.";
        }

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${ampm} ${hours}:${minutes}`;

        // Pick random team member excluding the current user
        const pool = this.state.members.filter(m => m.email !== (this.state.currentUser ? this.state.currentUser.email : ''));
        const replier = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : { name: '이디자인 UI/UX' };

        const replyMsg = {
            sender: replier.name,
            text: replyText,
            time: timeStr,
            self: false
        };

        this.state.chats.push(replyMsg);
        this.saveState();
        this.renderPhoneChatView();
        this.renderPhoneMainView();
        
        this.triggerPushNotification(`[채팅] ${replier.name}: "${replyText.substring(0, 15)}..."`);
    }

    // --- Notification triggering & alerts ---
    sendSystemNotification(message, targetUserEmail) {
        const now = new Date();
        const newNoti = {
            id: `noti-${Date.now()}`,
            msg: message,
            time: '방금 전',
            unread: true
        };
        
        this.state.notifications.unshift(newNoti);
        this.saveState();
    }

    triggerPushNotification(message) {
        const area = document.getElementById('phone-notification-area');
        if (!area) return;

        // Clear existing
        area.innerHTML = '';

        const banner = document.createElement('div');
        banner.className = 'phone-noti-banner';
        banner.innerHTML = `
            <div class="phone-noti-banner-icon"><i class="fa-solid fa-bell"></i></div>
            <div class="phone-noti-banner-content">
                <h5>NEXFLOW 알림</h5>
                <p>${message}</p>
            </div>
        `;

        area.appendChild(banner);

        // Slide down
        setTimeout(() => {
            banner.classList.add('active');
        }, 100);

        // Slide up and remove
        setTimeout(() => {
            banner.classList.remove('active');
            setTimeout(() => {
                banner.remove();
            }, 400);
        }, 4000);
    }

    triggerDemoReminder() {
        // Simulates deadline check action
        const upcomingTasks = this.state.tasks.filter(t => t.status !== 'done');
        if (upcomingTasks.length > 0) {
            const task = upcomingTasks[Math.floor(Math.random() * upcomingTasks.length)];
            const alertMsg = `⚠️ 긴급: "${task.title}" 업무 마감일(${task.dueDate})이 다가오고 있습니다.`;
            this.sendSystemNotification(alertMsg, task.assigneeEmail);
            this.addActivityLog('Remind-Bot', `"${task.title}" 마감일 임박 경고 알림을 발송했습니다.`);
            this.triggerPushNotification(alertMsg);
            this.renderAll();
        } else {
            this.triggerPushNotification('마감 임박한 업무가 없습니다.');
        }
    }

    clearAllNotifications() {
        this.state.notifications = [];
        this.saveState();
        this.renderAll();
        this.triggerPushNotification('모든 알림을 삭제했습니다.');
    }

    addActivityLog(actor, action) {
        const feed = document.getElementById('web-activity-feed');
        if (!feed) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        // Keep activity logs in memory for session
        if (!this.activityLogs) this.activityLogs = [];
        
        this.activityLogs.unshift({ actor, action, time: timeStr });
        this.renderActivityFeed();
    }

    inviteMember() {
        const emailInput = document.getElementById('invite-member-email');
        const roleInput = document.getElementById('invite-member-role');
        const email = emailInput.value.trim();
        const role = roleInput.value;

        if (!email) return;

        if (this.state.members.find(m => m.email === email)) {
            alert('이미 등록되거나 초대 수락 대기 중인 이메일입니다.');
            return;
        }

        const name = email.split('@')[0];
        const newMember = {
            email: email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            role: role,
            status: 'pending',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60'
        };

        this.state.members.push(newMember);
        this.saveState();
        emailInput.value = '';
        
        this.triggerPushNotification(`${newMember.name}님에게 프로젝트 초대 발송 완료!`);
        this.addActivityLog(this.state.currentUser.name, `${newMember.name}님을 [${role}] 역할로 초대했습니다.`);
        
        this.renderAll();
    }

    removeMember(email) {
        if (email === 'user@nexflow.com') {
            alert('기본 관리자는 내보낼 수 없습니다.');
            return;
        }

        const member = this.state.members.find(m => m.email === email);
        if (!member) return;

        if (confirm(`"${member.name}"님을 프로젝트에서 제외하시겠습니까?`)) {
            this.state.members = this.state.members.filter(m => m.email !== email);
            
            // Clean up assigned tasks - set to PM
            this.state.tasks.forEach(t => {
                if (t.assigneeEmail === email) {
                    t.assigneeEmail = 'user@nexflow.com';
                }
            });

            this.addActivityLog(this.state.currentUser.name, `${member.name}님을 내보냈습니다.`);
            this.triggerPushNotification(`팀원 "${member.name}"이 프로젝트에서 제외되었습니다.`);
            
            this.saveState();
            this.renderAll();
        }
    }

    // --- Rendering Pipelines ---
    renderAll() {
        this.renderPhoneViews();
        this.renderWebViews();
    }

    renderPhoneViews() {
        // First determine active view
        if (!this.state.currentUser) {
            this.switchPhoneView('login');
            return;
        }

        // Apply header values
        const nameDisplays = document.querySelectorAll('.username-display');
        nameDisplays.forEach(el => el.innerText = this.state.currentUser.name);

        const roleDisplay = document.querySelector('.user-role');
        if (roleDisplay) {
            const found = this.state.members.find(m => m.email === this.state.currentUser.email);
            roleDisplay.innerText = found ? found.role : 'Member';
        }

        const headerProfile = document.getElementById('user-profile-header');
        if (headerProfile) {
            headerProfile.querySelector('.header-username').innerText = this.state.currentUser.name;
            headerProfile.querySelector('.header-avatar').src = this.state.currentUser.avatar;
        }

        // Switch to the current active tab view
        this.switchPhoneView(this.state.phoneTab);

        // Tab subview renders
        if (this.state.phoneTab === 'main') {
            this.renderPhoneMainView();
        } else if (this.state.phoneTab === 'tasks') {
            this.renderPhoneTaskList();
        } else if (this.state.phoneTab === 'chat') {
            this.renderPhoneChatView();
        } else if (this.state.phoneTab === 'notifications') {
            this.renderPhoneNotificationsView();
        }
    }

    renderPhoneMainView() {
        // 1. Stats calc
        const total = this.state.tasks.length;
        const done = this.state.tasks.filter(t => t.status === 'done').length;
        const doing = this.state.tasks.filter(t => t.status === 'doing').length;
        const todo = this.state.tasks.filter(t => t.status === 'todo').length;

        const percent = total > 0 ? Math.round((done / total) * 100) : 0;

        document.getElementById('phone-progress-percent').innerText = `${percent}%`;
        document.getElementById('phone-progress-bar').style.width = `${percent}%`;
        document.getElementById('phone-todo-count').innerText = todo;
        document.getElementById('phone-doing-count').innerText = doing;
        document.getElementById('phone-done-count').innerText = done;

        // 2. My Tasks Preview (assigned to current user and NOT done)
        const myTasks = this.state.tasks.filter(t => t.assigneeEmail === this.state.currentUser.email && t.status !== 'done');
        const previewContainer = document.getElementById('phone-tasks-preview-list');
        
        if (myTasks.length === 0) {
            previewContainer.innerHTML = `<div class="empty-state-mobile">진행 대기 중인 할당된 업무가 없습니다.</div>`;
        } else {
            previewContainer.innerHTML = myTasks.slice(0, 3).map(t => `
                <div class="phone-task-card" onclick="app.openPhoneTaskModal('${t.id}')">
                    <div class="phone-task-header">
                        <span class="phone-task-title">${t.title}</span>
                        <span class="phone-tag ${t.status}">${t.status === 'doing' ? '진행' : '대기'}</span>
                    </div>
                    <div class="phone-task-footer">
                        <span class="phone-task-due"><i class="fa-regular fa-calendar"></i> ${t.dueDate}</span>
                    </div>
                </div>
            `).join('');
        }

        // 3. Chat preview card
        const lastMsg = this.state.chats[this.state.chats.length - 1];
        const previewMsg = document.getElementById('chat-preview-msg');
        const previewTime = document.getElementById('chat-preview-time');
        
        if (lastMsg) {
            previewMsg.innerText = `${lastMsg.sender}: ${lastMsg.text}`;
            previewTime.innerText = lastMsg.time;
        } else {
            previewMsg.innerText = "마지막 피드가 없습니다.";
            previewTime.innerText = "방금 전";
        }

        // 4. Notifications badge count
        const unreadCount = this.state.notifications.filter(n => n.unread).length;
        const badge = document.getElementById('phone-noti-count');
        if (badge) {
            badge.innerText = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    renderPhoneTaskList() {
        const container = document.getElementById('phone-task-list-container');
        let filtered = this.state.tasks;

        if (this.state.phoneFilter !== 'all') {
            filtered = this.state.tasks.filter(t => t.status === this.state.phoneFilter);
        }

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state-mobile">조회할 업무가 없습니다.</div>`;
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        container.innerHTML = filtered.map(t => {
            const assignee = this.state.members.find(m => m.email === t.assigneeEmail) || { name: '미지정', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60' };
            const isOverdue = t.status !== 'done' && t.dueDate < today;
            
            return `
                <div class="phone-task-card ${t.status === 'done' ? 'done-task' : ''}" onclick="app.openPhoneTaskModal('${t.id}')">
                    <div class="phone-task-header">
                        <span class="phone-task-title">${t.title}</span>
                        <span class="phone-tag ${t.status}">${t.status === 'todo' ? '대기' : t.status === 'doing' ? '진행' : '완료'}</span>
                    </div>
                    <p class="phone-task-body">${t.desc || '업무 상세 설명이 정의되지 않았습니다.'}</p>
                    <div class="phone-task-footer">
                        <span class="phone-task-due ${isOverdue ? 'overdue' : ''}">
                            <i class="fa-regular fa-calendar"></i> ${t.dueDate} ${isOverdue ? '(지연)' : ''}
                        </span>
                        <div class="phone-task-assignee">
                            <img src="${assignee.avatar}" alt="Avatar" class="assignee-avatar">
                            <span>${assignee.name.split(' ')[0]}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPhoneChatView() {
        const chatBox = document.getElementById('phone-chat-box');
        if (!chatBox) return;

        chatBox.innerHTML = this.state.chats.map(c => {
            const isSelf = this.state.currentUser && c.sender === this.state.currentUser.name;
            return `
                <div class="chat-bubble ${isSelf ? 'sent' : 'received'}">
                    <div class="chat-bubble-sender">${c.sender}</div>
                    <div class="chat-bubble-text">${c.text}</div>
                    <div class="chat-bubble-time">${c.time}</div>
                </div>
            `;
        }).join('');

        // scroll bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    renderPhoneNotificationsView() {
        const container = document.getElementById('phone-noti-list-container');
        if (!container) return;

        if (this.state.notifications.length === 0) {
            container.innerHTML = `<div class="empty-state-mobile">수신된 알림이 없습니다.</div>`;
            return;
        }

        container.innerHTML = this.state.notifications.map(n => `
            <div class="phone-noti-card ${n.unread ? 'unread' : ''}" onclick="app.markNotificationRead('${n.id}')">
                <p class="phone-noti-msg">${n.msg}</p>
                <span class="phone-noti-time">${n.time}</span>
            </div>
        `).join('');

        // Mark all as read when opening notifications tab after viewing
        setTimeout(() => {
            this.state.notifications.forEach(n => n.unread = false);
            this.saveState();
            const badge = document.getElementById('phone-noti-count');
            if (badge) badge.style.display = 'none';
        }, 1500);
    }

    markNotificationRead(id) {
        const noti = this.state.notifications.find(n => n.id === id);
        if (noti) {
            noti.unread = false;
            this.saveState();
            this.renderPhoneNotificationsView();
        }
    }

    renderWebViews() {
        if (this.state.webTab === 'dashboard') {
            this.renderWebDashboardSummary();
        } else if (this.state.webTab === 'kanban') {
            this.renderWebKanban();
        } else if (this.state.webTab === 'members') {
            this.renderWebMembers();
        }
    }

    renderWebDashboardSummary() {
        // Summary metrics
        const total = this.state.tasks.length;
        const done = this.state.tasks.filter(t => t.status === 'done').length;
        
        document.getElementById('web-total-tasks-count').innerText = total;
        document.getElementById('web-done-tasks-count').innerText = done;
        document.getElementById('web-members-count').innerText = `${this.state.members.length}명`;

        // 1. Radial gauge chart
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        document.getElementById('web-radial-percentage').innerText = `${percent}%`;
        
        const circleFill = document.getElementById('web-chart-radial-fill');
        if (circleFill) {
            // Stroke dasharray format: "filled_value, empty_value"
            circleFill.setAttribute('stroke-dasharray', `${percent}, 100`);
        }

        // 2. Bar chart: Tasks per Assignee
        const barContainer = document.getElementById('assignee-bar-chart');
        
        // Calculate data
        const stats = {};
        this.state.members.forEach(m => {
            stats[m.email] = { name: m.name.split(' ')[0], count: 0 };
        });

        this.state.tasks.forEach(t => {
            if (stats[t.assigneeEmail]) {
                stats[t.assigneeEmail].count++;
            }
        });

        // Find max count for scaling (height = percent)
        let maxCount = 1;
        Object.values(stats).forEach(s => {
            if (s.count > maxCount) maxCount = s.count;
        });

        barContainer.innerHTML = Object.values(stats).map(s => {
            const hPercent = Math.max(10, Math.round((s.count / maxCount) * 100)); // minimum 10% height for visual
            return `
                <div class="bar-chart-col">
                    <div class="bar-track">
                        <div class="bar-fill" style="height: ${s.count === 0 ? '0' : hPercent}%"></div>
                    </div>
                    <span class="bar-label" title="${s.name}">${s.name} (${s.count})</span>
                </div>
            `;
        }).join('');

        // 3. Activity feed initialization
        if (!this.activityLogs) {
            this.activityLogs = [
                { actor: '이디자인 UI/UX', action: '"사용자 중심 와이어프레임 설계" 완료 처리', time: '10분 전' },
                { actor: '박개발 FE', action: '"대시보드 통계 시각화 모듈" 진행 중 상태로 이동', time: '15분 전' },
                { actor: '김관리 PM', action: '팀원 "정품질 QA"님 초대 발송 완료', time: '2시간 전' },
                { actor: 'system', action: '실시간 가상 소켓 서버 연결 활성화', time: '3시간 전' }
            ];
        }
        this.renderActivityFeed();
    }

    renderActivityFeed() {
        const container = document.getElementById('web-activity-feed');
        if (!container) return;

        container.innerHTML = this.activityLogs.slice(0, 8).map(log => `
            <div class="feed-item">
                <div class="feed-icon"><i class="fa-solid fa-bolt"></i></div>
                <div class="feed-body">
                    <strong>${log.actor}</strong>님이 ${log.action}
                    <span class="feed-time">${log.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderWebKanban() {
        const cols = ['todo', 'doing', 'done'];
        const today = new Date().toISOString().split('T')[0];

        cols.forEach(col => {
            const container = document.getElementById(`container-${col}`);
            const countBadge = document.getElementById(`count-${col}`);
            
            const filtered = this.state.tasks.filter(t => t.status === col);
            countBadge.innerText = filtered.length;

            if (filtered.length === 0) {
                container.innerHTML = `<div class="empty-state-kanban">업무가 없습니다.</div>`;
                return;
            }

            container.innerHTML = filtered.map(t => {
                const assignee = this.state.members.find(m => m.email === t.assigneeEmail) || { name: '미지정', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60' };
                const isOverdue = t.status !== 'done' && t.dueDate < today;

                return `
                    <div class="kanban-card" draggable="true" ondragstart="app.drag(event, '${t.id}')" onclick="app.openPhoneTaskModal('${t.id}')">
                        <div class="kanban-card-title">${t.title}</div>
                        <p class="kanban-card-desc">${t.desc ? t.desc.substring(0, 60) + (t.desc.length > 60 ? '...' : '') : '업무 요약 설명이 없습니다.'}</p>
                        <div class="kanban-card-footer">
                            <div class="card-assignee">
                                <img src="${assignee.avatar}" alt="Avatar">
                                <span>${assignee.name}</span>
                            </div>
                            <span class="card-due ${isOverdue ? 'overdue' : ''}">
                                <i class="fa-regular fa-clock"></i> ${t.dueDate}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
        });
    }

    renderWebMembers() {
        const tableBody = document.getElementById('web-members-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = this.state.members.map(m => `
            <tr>
                <td>
                    <div class="member-profile-cell">
                        <img src="${m.avatar}" alt="${m.name}" class="member-table-avatar">
                        <span class="member-name">${m.name}</span>
                    </div>
                </td>
                <td>${m.email}</td>
                <td><span class="role-badge">${m.role}</span></td>
                <td>
                    <span class="status-badge ${m.status}">
                        <span class="dot"></span>
                        ${m.status === 'active' ? '참여 중' : '초대 대기'}
                    </span>
                </td>
                <td>
                    ${m.email !== 'user@nexflow.com' 
                        ? `<button class="action-link-danger" onclick="app.removeMember('${m.email}')">내보내기</button>`
                        : `<span style="font-size:0.75rem; color:var(--text-muted);">제외 불가</span>`
                    }
                </td>
            </tr>
        `).join('');
    }
}

// Global instance allocation
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new NexflowApp();
    window.app = app; // globally bind for inline HTML onclick handlers
});
