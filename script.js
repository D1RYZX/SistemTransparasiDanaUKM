// Simulasi data pengguna untuk sistem login
const users = [
    {
        email: 'ketua.u2m@stikom-bali.ac.id',
        password: 'ukm123',
        name: 'Ketua UKM U2M',
        role: 'UKM',
        roleType: 'ukm',
        avatarText: 'KU',
        ukm: 'U2M',
        ukminfo: 'Unit Usaha Mahasiswa'
    },
    {
        email: 'pembina.u2m@stikom-bali.ac.id',
        password: 'pembina123',
        name: 'Pembina UKM U2M',
        role: 'Pembina UKM',
        roleType: 'pembina',
        avatarText: 'PU',
        ukm: 'U2M',
        ukminfo: 'Unit Usaha Mahasiswa'
    },
    {
        email: 'admin.keuangan@stikom-bali.ac.id',
        password: 'admin123',
        name: 'Admin Keuangan',
        role: 'Admin Keuangan',
        roleType: 'admin',
        avatarText: 'AD'
    }
];

// Fungsi untuk menampilkan status message
function showStatus(message, type = 'error') {
    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status-${type}`;
        statusEl.style.display = 'block';
        
        // Auto hide setelah 3 detik untuk success, 5 detik untuk error
        const hideTime = type === 'success' ? 2000 : 5000;
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, hideTime);
    }
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    // Login page functionality
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Login form submission dengan loading state
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.login-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            submitBtn.disabled = true;
            
            // Proses login
            const role = document.getElementById('role').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!role || !email || !password) {
                showStatus('Harap lengkapi semua field!', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Validasi email STIKOM Bali
            if (!email.endsWith('@stikom-bali.ac.id')) {
                showStatus('Harap gunakan email @stikom-bali.ac.id!', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Cari user berdasarkan email dan password
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Cek apakah role yang dipilih sesuai dengan role user
                if ((role === 'ukm' && user.roleType === 'ukm') ||
                    (role === 'pembina' && user.roleType === 'pembina') ||
                    (role === 'admin' && user.roleType === 'admin')) {
                    
                    // Simpan data user ke localStorage
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('loginTime', new Date().toISOString());
                    
                    // Tampilkan status sukses
                    showStatus(`Login berhasil! Mengarahkan ke dashboard ${user.role}...`, 'success');
                    
                    // Redirect berdasarkan role setelah delay pendek
                    setTimeout(() => {
                        switch(user.roleType) {
                            case 'ukm':
                                window.location.href = 'dashboard-ukm.html';
                                break;
                            case 'pembina':
                                window.location.href = 'dashboard-pembina.html';
                                break;
                            case 'admin':
                                window.location.href = 'dashboard-admin.html';
                                break;
                        }
                    }, 1500);
                } else {
                    showStatus('Role yang dipilih tidak sesuai dengan akun ini! Silakan pilih role yang sesuai.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } else {
                showStatus('Email atau password salah! Silakan coba lagi.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Load user data for dashboard pages
    const userInfoElements = document.querySelectorAll('.user-info, .sidebar-header');
    if (userInfoElements.length > 0) {
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData) {
            // Jika tidak ada data user, redirect ke login
            showStatus('Silakan login terlebih dahulu', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        // Cek session timeout (8 jam)
        const loginTime = localStorage.getItem('loginTime');
        if (loginTime) {
            const loginDate = new Date(loginTime);
            const currentDate = new Date();
            const diffHours = (currentDate - loginDate) / (1000 * 60 * 60);
            
            if (diffHours > 8) {
                localStorage.removeItem('user');
                localStorage.removeItem('loginTime');
                showStatus('Sesi telah berakhir. Silakan login kembali.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }
        }
        
        // Update user info di dashboard
        document.querySelectorAll('.user-name').forEach(el => {
            if (el) {
                if (userData.roleType === 'pembina') {
                    el.textContent = `Pembina UKM ${userData.ukm}`;
                } else if (userData.roleType === 'ukm') {
                    el.textContent = `Ketua UKM ${userData.ukm}`;
                } else {
                    el.textContent = userData.name;
                }
            }
        });
        
        document.querySelectorAll('.user-role').forEach(el => {
            if (el) el.textContent = userData.role;
        });
        
        document.querySelectorAll('.role-badge').forEach(el => {
            if (el) {
                if (userData.roleType === 'pembina' || userData.roleType === 'ukm') {
                    el.textContent = `${userData.role} ${userData.ukm}`;
                } else {
                    el.textContent = userData.role;
                }
            }
        });
        
        document.querySelectorAll('.user-avatar').forEach(el => {
            if (el) {
                el.textContent = userData.avatarText;
                // Tambahkan warna berdasarkan role
                if (userData.roleType === 'admin') {
                    el.style.background = 'linear-gradient(135deg, #495057 0%, #343a40 100%)';
                } else if (userData.roleType === 'pembina') {
                    el.style.background = 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
                } else if (userData.roleType === 'ukm') {
                    el.style.background = 'linear-gradient(135deg, #495057 0%, #6c757d 100%)';
                }
            }
        });
        
        // Update UKM info berdasarkan user
        if (userData.ukm) {
            document.querySelectorAll('.ukm-name').forEach(el => {
                if (el) el.textContent = userData.ukm;
            });
            
            document.querySelectorAll('.ukm-info').forEach(el => {
                if (el) {
                    el.textContent = userData.ukminfo || '';
                }
            });
        }
        
        // Set active navigation link
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        
        navLinks.forEach(link => {
            if (link) {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active');
                }
            }
        });
        
        // Update dashboard cards berdasarkan UKM
        updateDashboardData(userData);
    }
    
    // Logout functionality tanpa konfirmasi popup
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Tampilkan loading
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
                btn.disabled = true;
                
                // Logout tanpa konfirmasi
                setTimeout(() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('loginTime');
                    showStatus('Logout berhasil. Mengarahkan ke halaman login...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }, 500);
            });
        }
    });
    
    // Set current date in dashboard
    const dateElements = document.querySelectorAll('.current-date');
    if (dateElements.length > 0) {
        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('id-ID', options);
        
        dateElements.forEach(el => {
            if (el) el.textContent = formattedDate;
        });
    }
    
    // Mobile menu toggle functionality
    if (!document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.display = 'none'; // Sembunyikan di desktop
        document.body.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
                this.innerHTML = sidebar.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const sidebar = document.querySelector('.sidebar');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (sidebar && menuToggle && window.innerWidth <= 992) {
                if (!sidebar.contains(event.target) && !menuToggle.contains(event.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    }
    
    // Adjust sidebar on window resize
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (sidebar && menuToggle) {
            if (window.innerWidth > 992) {
                sidebar.classList.remove('active');
                menuToggle.style.display = 'none';
            } else {
                menuToggle.style.display = 'flex';
            }
        }
    });
    
    // Initialize mobile menu toggle visibility
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        if (window.innerWidth <= 992) {
            menuToggle.style.display = 'flex';
        }
    }
});

// Function to update dashboard data based on user
function updateDashboardData(userData) {
    const cards = document.querySelectorAll('.card-value');
    
    if (cards.length >= 3) {
        // Data dummy berdasarkan UKM
        const ukmData = {
            'U2M': {
                totalDana: 'Rp 18.500.000',
                danaTerpakai: 'Rp 12.750.000',
                sisaDana: 'Rp 5.750.000',
                pendingLPJ: '2',
                transaksiDiajukan: '24',
                peringatan: '1'
            },
            'Multimedia': {
                totalDana: 'Rp 12.300.000',
                danaTerpakai: 'Rp 8.450.000',
                sisaDana: 'Rp 3.850.000',
                pendingLPJ: '1',
                transaksiDiajukan: '18',
                peringatan: '0'
            }
        };
        
        const data = ukmData[userData.ukm] || ukmData['U2M'];
        
        // Update card values
        if (userData.roleType === 'pembina' || userData.roleType === 'ukm') {
            if (cards[0]) cards[0].textContent = data.totalDana;
            if (cards[1]) cards[1].textContent = data.danaTerpakai;
            if (cards[2]) cards[2].textContent = data.sisaDana;
            if (cards[3]) cards[3].textContent = data.pendingLPJ;
        } else if (userData.roleType === 'admin') {
            // Data untuk admin dashboard
            if (cards[0]) cards[0].textContent = '15'; // Total UKM
            if (cards[1]) cards[1].textContent = '24'; // Transaksi menunggu
            if (cards[2]) cards[2].textContent = 'Rp 187.5 Jt'; // Dana tersalurkan
            if (cards[3]) cards[3].textContent = '7'; // Peringatan sistem
        }
    }
}

// Function to update dashboard financial cards (compatibility)
function updateFinancialCards() {
    updateDashboardData(JSON.parse(localStorage.getItem('user') || '{}'));
}

// Initialize when page loads
window.addEventListener('load', function() {
    updateFinancialCards();
    
    // Auto-hide success messages after 3 seconds
    setTimeout(() => {
        const successMessages = document.querySelectorAll('.status-success');
        successMessages.forEach(msg => {
            if (msg.style.display !== 'none') {
                msg.style.display = 'none';
            }
        });
    }, 3000);
});

// Utility functions
function formatCurrency(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + L untuk logout
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.querySelector('.logout-btn')?.click();
    }
    
    // Escape untuk close modal
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Tambahkan fungsi ini di bagian akhir file script.js
function formatCurrencyAmount(amount) {
    // Mengubah string seperti "Rp 18.500.000" menjadi "Rp 18.500.000"
    // Pastikan format sudah benar
    return amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

// Panggil fungsi ini setelah load user data
function updateFinancialData() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.roleType === 'pembina') {
        // Update nominal dana di dashboard
        const totalDanaElements = document.querySelectorAll('.card-value-pembina');
        if (totalDanaElements.length > 0) {
            // Hanya update elemen pertama (Total Dana UKM)
            const formattedAmount = formatCurrencyAmount('Rp 18.500.000');
            if (totalDanaElements[0].textContent.includes('Rp')) {
                totalDanaElements[0].textContent = formattedAmount;
            }
        }
    }
}

// Panggil saat halaman dimuat
window.addEventListener('load', function() {
    updateFinancialData();
});

// ===== ADMIN SPECIFIC FUNCTIONS =====

// Initialize Admin Dashboard
function initAdminDashboard() {
    console.log('Admin Dashboard Initialized');
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize date pickers
    initDatePickers();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize export functionality
    initExportFunctions();
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Simulate API call
        const response = await fetchDashboardData();
        
        // Update dashboard statistics
        updateDashboardStats(response.stats);
        
        // Update recent activities
        updateRecentActivities(response.activities);
        
        // Update pending tasks
        updatePendingTasks(response.tasks);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Gagal memuat data dashboard', 'error');
    }
}

// Fetch Dashboard Data (Simulated)
async function fetchDashboardData() {
    // Simulate API delay
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                stats: {
                    totalUKM: 18,
                    pendingSubmissions: 24,
                    totalFunds: 245700000,
                    warnings: 7
                },
                activities: [
                    {
                        type: 'verification',
                        description: 'Transaksi UKM U2M diverifikasi',
                        timestamp: '2024-01-30T14:30:00',
                        status: 'success'
                    },
                    {
                        type: 'proposal',
                        description: 'Proposal UKM Robotika dikembalikan',
                        timestamp: '2024-01-30T11:20:00',
                        status: 'warning'
                    },
                    {
                        type: 'upload',
                        description: 'LPJ UKM Fotografi diupload',
                        timestamp: '2024-01-29T16:45:00',
                        status: 'info'
                    },
                    {
                        type: 'rejection',
                        description: 'Transaksi UKM Teater ditolak',
                        timestamp: '2024-01-29T14:15:00',
                        status: 'error'
                    }
                ],
                tasks: [
                    {
                        priority: 'high',
                        description: 'Verifikasi transaksi workshop U2M',
                        ukm: 'U2M',
                        deadline: '2024-01-31'
                    },
                    {
                        priority: 'high',
                        description: 'Review proposal UKM Robotika',
                        ukm: 'Robotika',
                        deadline: '2024-02-01'
                    },
                    {
                        priority: 'medium',
                        description: 'Validasi LPJ UKM Multimedia',
                        ukm: 'Multimedia',
                        deadline: '2024-02-03'
                    },
                    {
                        priority: 'low',
                        description: 'Update data anggaran UKM Teater',
                        ukm: 'Teater',
                        deadline: '2024-02-05'
                    }
                ]
            });
        }, 1000);
    });
}

// Update Dashboard Statistics
function updateDashboardStats(stats) {
    const statsElements = {
        totalUKM: document.querySelector('.card:nth-child(1) .card-value'),
        pendingSubmissions: document.querySelector('.card:nth-child(2) .card-value'),
        totalFunds: document.querySelector('.card:nth-child(3) .card-value'),
        warnings: document.querySelector('.card:nth-child(4) .card-value')
    };
    
    if (statsElements.totalUKM) statsElements.totalUKM.textContent = stats.totalUKM;
    if (statsElements.pendingSubmissions) statsElements.pendingSubmissions.textContent = stats.pendingSubmissions;
    if (statsElements.totalFunds) statsElements.totalFunds.textContent = formatCurrency(stats.totalFunds);
    if (statsElements.warnings) statsElements.warnings.textContent = stats.warnings;
}

// Update Recent Activities
function updateRecentActivities(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing activities
    activityList.innerHTML = '';
    
    // Add new activities
    activities.forEach(activity => {
        const activityItem = createActivityElement(activity);
        activityList.appendChild(activityItem);
    });
}

// Create Activity Element
function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    const iconClass = getActivityIconClass(activity.status);
    const formattedTime = formatRelativeTime(new Date(activity.timestamp));
    
    div.innerHTML = `
        <div class="activity-icon ${iconClass}">
            <i class="fas ${getActivityIcon(activity.type)}"></i>
        </div>
        <div class="activity-content">
            <p>${activity.description}</p>
            <small>${formattedTime}</small>
        </div>
    `;
    
    return div;
}

// Update Pending Tasks
function updatePendingTasks(tasks) {
    const tasksTable = document.querySelector('.table-container tbody');
    if (!tasksTable) return;
    
    // Clear existing tasks
    tasksTable.innerHTML = '';
    
    // Add new tasks
    tasks.forEach((task, index) => {
        const row = createTaskRow(task, index);
        tasksTable.appendChild(row);
    });
}

// Create Task Row
function createTaskRow(task, index) {
    const row = document.createElement('tr');
    
    const priorityClass = getPriorityClass(task.priority);
    const formattedDate = formatDate(new Date(task.deadline));
    
    row.innerHTML = `
        <td><span class="priority-badge ${task.priority}">${task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}</span></td>
        <td>${task.description}</td>
        <td>${task.ukm}</td>
        <td>${formattedDate}</td>
        <td><button class="btn btn-sm btn-primary" onclick="processTask(${index})">Proses</button></td>
    `;
    
    return row;
}

// Initialize Date Pickers
function initDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
}

// Initialize Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchUKM');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchUKM, 300));
    }
}

// Search UKM Function
function searchUKM(event) {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('.table-container tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Initialize Export Functions
function initExportFunctions() {
    const exportButtons = document.querySelectorAll('[onclick*="export"], [onclick*="Export"]');
    exportButtons.forEach(button => {
        button.addEventListener('click', handleExport);
    });
}

// Handle Export
function handleExport(event) {
    const button = event.target.closest('button');
    const exportType = button.textContent.includes('Excel') ? 'excel' : 'pdf';
    
    showLoading(button);
    
    // Simulate export process
    setTimeout(() => {
        hideLoading(button);
        showNotification(`Data berhasil diexport dalam format ${exportType.toUpperCase()}`, 'success');
    }, 1500);
}

// Format Currency
function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return 'Rp ' + (amount / 1000000000).toFixed(1) + ' M';
    } else if (amount >= 1000000) {
        return 'Rp ' + (amount / 1000000).toFixed(1) + ' Jt';
    } else if (amount >= 1000) {
        return 'Rp ' + (amount / 1000).toFixed(0) + ' Rb';
    }
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Format Relative Time
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) return `${diffDay} hari yang lalu`;
    if (diffHour > 0) return `${diffHour} jam yang lalu`;
    if (diffMin > 0) return `${diffMin} menit yang lalu`;
    return 'Baru saja';
}

// Format Date
function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Get Activity Icon Class
function getActivityIconClass(status) {
    switch (status) {
        case 'success': return 'success';
        case 'warning': return 'warning';
        case 'error': return 'danger';
        default: return 'primary';
    }
}

// Get Activity Icon
function getActivityIcon(type) {
    switch (type) {
        case 'verification': return 'fa-check';
        case 'proposal': return 'fa-file-contract';
        case 'upload': return 'fa-upload';
        case 'rejection': return 'fa-times';
        default: return 'fa-info-circle';
    }
}

// Get Priority Class
function getPriorityClass(priority) {
    return priority;
}

// Show Loading State
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    button.disabled = true;
    button.dataset.originalText = originalText;
}

// Hide Loading State
function hideLoading(button) {
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Process Task
function processTask(taskIndex) {
    showNotification(`Memproses tugas #${taskIndex + 1}`, 'info');
    
    // Simulate processing
    setTimeout(() => {
        showNotification(`Tugas #${taskIndex + 1} berhasil diproses`, 'success');
    }, 1000);
}

// Add UKM
function addUKM() {
    showModal('Tambah UKM Baru', `
        <form id="addUKMForm">
            <div class="form-group">
                <label>Nama UKM</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>Bidang Kegiatan</label>
                <select required>
                    <option value="">Pilih Bidang</option>
                    <option value="kewirausahaan">Kewirausahaan</option>
                    <option value="teknologi">Teknologi</option>
                    <option value="seni">Seni</option>
                    <option value="olahraga">Olahraga</option>
                </select>
            </div>
            <div class="form-group">
                <label>Ketua UKM</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>Pembina</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>Anggaran Tahunan</label>
                <input type="number" required>
            </div>
        </form>
    `, 'Tambah', 'Batal');
}

// Show Modal
function showModal(title, content, confirmText = 'OK', cancelText = 'Batal') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">${cancelText}</button>
                <button class="btn btn-primary" onclick="confirmModal()">${confirmText}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
}

// Close Modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Confirm Modal
function confirmModal() {
    // Handle form submission or confirmation
    showNotification('Aksi berhasil dilakukan', 'success');
    closeModal();
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification-error {
            border-left: 4px solid #f44336;
        }
        
        .notification-info {
            border-left: 4px solid #2196F3;
        }
        
        .notification button {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
});