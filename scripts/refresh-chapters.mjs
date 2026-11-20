// Node 22+. No dependencies or API key required for the default public RPC.
import { readFile, writeFile, rename } from 'node:fs/promises';
const destination = new URL('../assets/data/chapters.json', import.meta.url);
const snapshot = JSON.parse(await readFile(destination, 'utf8'));
const endpoint = process.env.ETHEREUM_RPC_URL || 'https://ethereum-rpc.publicnode.com';
async function rpc(method, params) {
    const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) throw new Error('RPC HTTP error');
    const body = await response.json();
    if (body.error || body.result === undefined) throw new Error('RPC error');
    return body.result;
}
function httpsUrl(uri) {
    if (uri.startsWith('ar://')) uri = `https://arweave.net/${uri.slice(5)}`;
    if (uri.startsWith('ipfs://')) uri = `https://ipfs.io/ipfs/${uri.slice(7).replace(/^ipfs\//, '')}`;
    const url = new URL(uri);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid HTTPS URL');
    return url.href;
}
function decodeString(hex) {
    if (!/^0x(?:[0-9a-fA-F]{2})+$/.test(hex)) throw new Error('Invalid ABI response');
    const bytes = Buffer.from(hex.slice(2), 'hex');
    const offset = Number(BigInt(`0x${bytes.subarray(0, 32).toString('hex')}`));
    if (!Number.isSafeInteger(offset) || offset < 32 || offset + 32 > bytes.length) throw new Error('Invalid ABI offset');
    const length = Number(BigInt(`0x${bytes.subarray(offset, offset + 32).toString('hex')}`));
    if (!Number.isSafeInteger(length) || length <= 0 || offset + 32 + length > bytes.length) throw new Error('Invalid ABI length');
    return bytes.subarray(offset + 32, offset + 32 + length).toString('utf8');
}
let currentChapter = 'RPC connection';
try {
    if (await rpc('eth_chainId', []) !== '0x1') throw new Error('Expected mainnet');
    const block = await rpc('eth_blockNumber', []);
    for (const chapter of Object.values(snapshot.chapters)) {
        currentChapter = `chapter ${chapter.chapter}`;
        const data = `0xc87b56dd${chapter.tokenId.toString(16).padStart(64, '0')}`;
        const tokenURI = decodeString(await rpc('eth_call', [{ to: snapshot.contract, data }, block]));
        const response = await fetch(httpsUrl(tokenURI), { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error('Metadata HTTP error');
        const metadata = await response.json();
        if (typeof metadata.external_url !== 'string') throw new Error('Missing external_url');
        chapter.url = httpsUrl(metadata.external_url);
        chapter.tokenURI = tokenURI;
        console.log(`Verified chapter ${chapter.chapter}, token ${chapter.tokenId}`);
    }
    snapshot.source = 'Ethereum mainnet tokenURI and token metadata external_url';
    snapshot.blockNumber = block;
    snapshot.updatedAt = new Date().toISOString();
    const temporary = new URL(`${destination.href}.tmp`);
    await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
    await rename(temporary, destination);
    console.log('Updated assets/data/chapters.json');
} catch {
    // Custom RPC URLs may contain secrets; never print fetch errors or the endpoint.
    console.error(`Refresh failed at ${currentChapter}; existing mapping preserved. Check RPC connectivity and token metadata.`);
    process.exitCode = 1;
}
