const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 服务静态文件

// 处理邮件发送请求
app.post('/send-email', async (req, res) => {
    try {
        const { apiKey, ...emailData } = req.body;
        
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();
        
        if (response.ok) {
            res.json({ success: true, message: '邮件发送成功！' });
        } else {
            res.status(response.status).json({ 
                success: false, 
                message: result.message || '发送失败'
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || '服务器错误'
        });
    }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`服务器运行在 http://${HOST}:${PORT}`);
}); 