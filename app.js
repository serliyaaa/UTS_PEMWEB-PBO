const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer'); // Tambahkan ini
const path = require('path');
const db = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Tempat menyimpan file yang diupload

// Middleware untuk parsing body dari request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: 'w@8R5^3h$T7b$N7f3X*2gP&9sQw6zZ@1',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);

// Rute untuk halaman utama
app.get('/', (req, res) => {
    res.render('index');
});

// Rute untuk halaman about
app.get('/about', (req, res) => {
    res.render('about');
});

// Rute untuk halaman contact
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Rute untuk halaman profil pengguna
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/auth/login');
    }
});

// Rute untuk halaman upload
app.get('/upload', (req, res) => {
    if (req.session.user) {
        res.render('upload'); // Pastikan file upload.ejs ada
    } else {
        res.redirect('/auth/login'); // Redirect ke halaman login jika belum login
    }
});

// Rute untuk menangani upload file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); // Redirect jika user belum login
    }

    const { name, description } = req.body; // Ambil nama dan keterangan dari form
    console.log('File berhasil diupload:', req.file); // Log informasi file
    console.log('Nama:', name); // Log nama
    console.log('Keterangan:', description); // Log keterangan

    // Simpan informasi di database jika diperlukan
    // Contoh: simpan nama, keterangan, dan file.path ke database

    res.send('File berhasil diupload!'); // Tanggapan setelah upload berhasil
});

// Menjalankan server di port 3000
app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});
