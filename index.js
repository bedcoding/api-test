import express from 'express';
import pool from './database.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 게시글 목록 조회
app.get('/guestbook', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM guestbook ORDER BY articleno DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 게시글 추가
app.post('/guestbook', async (req, res) => {
    const { userid, subject, content } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO guestbook (userid, subject, content) VALUES ($1, $2, $3) RETURNING *', [userid, subject, content]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 게시글 수정
app.put('/guestbook/:articleno', async (req, res) => {
    const { articleno } = req.params;
    const { subject, content } = req.body;
    try {
        const { rows } = await pool.query('UPDATE guestbook SET subject = $1, content = $2 WHERE articleno = $3 RETURNING *', [subject, content, articleno]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 게시글 삭제
app.delete('/guestbook/:articleno', async (req, res) => {
    const { articleno } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM guestbook WHERE articleno = $1 RETURNING *', [articleno]);
        if (rows.length > 0) {
            res.json(rows[0]); // 삭제된 행을 반환
        } else {
            res.status(404).json({ message: 'No entry found with that ID.' }); // 삭제할 데이터가 없는 경우
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
