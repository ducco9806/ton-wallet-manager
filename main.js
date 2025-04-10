import { mnemonicToWalletKey } from '@ton/crypto';
import { TonClient, WalletContractV4, Address } from '@ton/ton';
import { fromNano, beginCell } from '@ton/core';
import { config } from './config';
async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: config.toncenterApiKey,
    });
    const keyPair = await mnemonicToWalletKey(config.mnemonic.split(''));
    const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    const walletAddress = wallet.address;
    console.log('Ví chính:', walletAddress.toString());
    const tonBalance = await client.getBalance(walletAddress);
    console.log('Số dư TON:', fromNano(tonBalance), 'TON');
    const jettonMaster = Address.parse(config.jettonMaster);
    const res = await client.callGetMethod(jettonMaster, 'get_wallet_address', [
        {
            type: 'slice',
            cell: beginCell().storeAddress(walletAddress).endCell(),
        },
    ]);
    const jettonWalletAddress = res.stack.readAddress();
    console.log('Jetton Wallet (USDT):', jettonWalletAddress.toString());
    const data = await client.callGetMethod(jettonWalletAddress, 'get_wallet_data');
    const rawBalance = data.stack.readBigNumber();
    console.log('Số dư USDT:', Number(rawBalance) / 1e6, 'TON');
}
main().catch(console.error);
