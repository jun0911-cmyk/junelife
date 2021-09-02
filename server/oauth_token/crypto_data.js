const crypto = require('crypto');

module.exports.encoding = function(user_id) {
    // 암호화 랜덤 바이트 길이 설정 (16byte)
    const iv = crypto.randomBytes(Number(process.env.IV_LENGTH));
    // 암호화 생성
    const cipher = crypto.createCipheriv(
        // 암호화 알고리즘 설정
        'aes-256-cbc',
        // 암호화 key로 Buffer설정
        Buffer.from(process.env.ENCODING_KEY),
        // 바이트설정
        iv,
    );
    // 만들어진 모델안에 암호화할 id 설정
    const encoding = cipher.update(user_id);
    // 암호화 값 return
    return (
        iv.toString('hex') + ':' + Buffer.concat([encoding, cipher.final()]).toString('hex')
    );
}

module.exports.decoding = function(crypto_id) {
    try {
        // : 단위로 split
        const descText = crypto_id.split(':');
        // 뭔지 모름
        const iv = Buffer.from(descText.shift(), 'hex');
        // 뭔지 모름
        const encodingData = Buffer.from(descText.join(':'), 'hex');
        // 복호화 생성
        const decipher = crypto.createDecipheriv(
            // 암호화 했던 알고리즘
            'aes-256-cbc',
            // 키 설정
            Buffer.from(process.env.ENCODING_KEY),
            // Byte 설정
            iv,
        );
        // 복호화된 모델안에 split
        const decoding = decipher.update(encodingData);
        return Buffer.concat([decoding, decipher.final()]).toString();
    } catch (e) {
        return null;
    }
}