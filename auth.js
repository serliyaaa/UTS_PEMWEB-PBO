const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../config/db');

// Route untuk menampilkan halaman login
router.get('/login', (req, res) => {
    res.render('auth/login', { errorMessage: null, successMessage: req.query.successMessage || null });
});

// Route untuk menampilkan halaman registrasi
router.get('/register', (req, res) => {
    res.render('auth/register', { errorMessage: null, successMessage: null });
});

// Route untuk menangani form registrasi
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Logging data registrasi
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    const queryCheckUser = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(queryCheckUser, [username, email], (error, results) => {
        if (error) {
            return res.render('auth/register', { errorMessage: 'Terjadi kesalahan, coba lagi.', successMessage: null });
        }
        
        if (results.length > 0) {
            return res.render('auth/register', { errorMessage: 'Username atau email sudah terdaftar.', successMessage: null });
        }

        // Validasi password minimal length
        if (password.length < 6) {
            return res.render('auth/register', { errorMessage: 'Password harus minimal 6 karakter.', successMessage: null });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.render('auth/register', { errorMessage: 'Terjadi kesalahan saat hashing.', successMessage: null });
            }

            const queryInsertUser = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(queryInsertUser, [username, email, hash], (insertError) => {
                if (insertError) {
                    return res.render('auth/register', { errorMessage: 'Gagal menyimpan data pengguna.', successMessage: null });
                }
                res.redirect('/auth/login?successMessage=Registrasi berhasil, silakan login.');
            });
        });
    });
});

// Route untuk menangani form login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Simpan informasi pengguna ke session
    req.session.user = { username, email };
    console.log("Pengguna berhasil terdaftar, arahan ke halaman upload"); // Debugging
    res.redirect('/upload'); // Arahkan ke halaman upload file setelah registrasi
});
// Rute untuk menangani form login
router.post('/login', (req, res) => {
const { email, password } = req.body;

const queryFindUser = 'SELECT * FROM users WHERE email = ?';
db.query(queryFindUser, [email], (error, results) => {
if (error) {
return res.render('auth/login', { errorMessage: 'Terjadi kesalahan, coba lagi.', successMessage: null });
}

if (results.length === 0) {
return res.render('auth/login', { errorMessage: 'Pengguna tidak ditemukan.', successMessage: null });
}

const user = results[0];
bcrypt.compare(password, user.password, (err, isMatch) => {
if (err || !isMatch) {
    return res.render('auth/login', { errorMessage: 'Password salah.', successMessage: null });
}

// Simpan informasi pengguna ke session
req.session.user = { username: user.username, email: user.email };
console.log("Pengguna berhasil login, arahan ke halaman upload"); // Debugging
res.redirect('/upload'); // Arahkan ke halaman upload setelah login sukses
});
});
});

module.exports = router;