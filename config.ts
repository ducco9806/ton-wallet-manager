import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    mnemonic: process.env.MNEMONIC || '',
    jettonMaster: process.env.JETTON_MASTER || '',
    toncenterApiKey: process.env.TONCENTER_API_KEY || '',
};

if (!config.mnemonic || !config.jettonMaster || !config.toncenterApiKey) {
    throw new Error('Thiếu biến môi trường cần thiết trong .env');
}