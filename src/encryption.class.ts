import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64';
import { hash, randomBytes, secretbox } from 'tweetnacl';

export class Encryption {

    private readonly _secret: string;
    get secret() {
        return this._secret;
    }

    private readonly keyUint8Array: Uint8Array;

    /**
     * Create a random key.
     */
    static createRandomEncryptionKey(): string {
        return encodeBase64(randomBytes(32));
    }

    /**
     * Create a base64 hash string of the provided input.
     * @param input Any non-circulair value.
     */
    static hash(input: any): string {
        const messageUint8Array = new TextEncoder().encode(JSON.stringify(input));
        const hashUint8Array = hash(messageUint8Array);
        const base64FullMessage = encodeBase64(hashUint8Array);
        const shortString = base64FullMessage.slice(11, 31);
        return shortString;
    }

    /**
     * Encrypt any value.
     * @param json Any non-circulair value.
     * @param key Secret key to encrypt with.
     */
    public encrypt(json: any): string {
        const nonce = randomBytes(secretbox.nonceLength);

        const messageUint8 = new TextEncoder().encode(JSON.stringify(json));
        const box = secretbox(messageUint8, nonce, this.keyUint8Array);

        const fullMessage = new Uint8Array(nonce.length + box.length);
        fullMessage.set(nonce);
        fullMessage.set(box, nonce.length);

        const base64FullMessage = encodeBase64(fullMessage);
        return base64FullMessage;
    }

    /**
     * Decrypt values.
     * @param json Any non-circulair value.
     * @param key Secret key to decrypt with.
     */
    public decrypt(messageWithNonce: string): any {
        const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
        const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
        const message = messageWithNonceAsUint8Array.slice(
            secretbox.nonceLength,
            messageWithNonce.length
        );

        const decrypted = secretbox.open(message, nonce, this.keyUint8Array);

        if (!decrypted) {
            throw new Error('Could not decrypt message!');
        }

        const base64DecryptedMessage = new TextDecoder().decode(decrypted);
        return JSON.parse(base64DecryptedMessage);
    }

    constructor(
        secret?: string
    ) {

        secret ?
            this._secret = secret :
            this._secret = Encryption.createRandomEncryptionKey();

        this.keyUint8Array = decodeBase64(this._secret);
    }

}

