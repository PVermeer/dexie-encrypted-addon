import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64';
import { hash, randomBytes, secretbox } from 'tweetnacl';
var Encryption = /** @class */ (function () {
    function Encryption(secret) {
        secret ?
            this._secret = secret :
            this._secret = Encryption.createRandomEncryptionKey();
        this.keyUint8Array = decodeBase64(this._secret);
    }
    Object.defineProperty(Encryption.prototype, "secret", {
        get: function () {
            return this._secret;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create a random key.
     */
    Encryption.createRandomEncryptionKey = function () {
        return encodeBase64(randomBytes(32));
    };
    Encryption.prototype._slice512HashString = function (hashString) {
        return hashString.slice(11, 31);
    };
    /**
     * Encrypt any value.
     * @param json Any non-circulair value.
     * @param key Secret key to encrypt with.
     */
    Encryption.prototype.encrypt = function (json) {
        var nonce = randomBytes(secretbox.nonceLength);
        var messageUint8 = new TextEncoder().encode(JSON.stringify(json));
        var box = secretbox(messageUint8, nonce, this.keyUint8Array);
        var fullMessage = new Uint8Array(nonce.length + box.length);
        fullMessage.set(nonce);
        fullMessage.set(box, nonce.length);
        var base64FullMessage = encodeBase64(fullMessage);
        return base64FullMessage;
    };
    /**
     * Decrypt values.
     * @param json Any non-circulair value.
     * @param key Secret key to decrypt with.
     */
    Encryption.prototype.decrypt = function (messageWithNonce) {
        var messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
        var nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
        var message = messageWithNonceAsUint8Array.slice(secretbox.nonceLength, messageWithNonce.length);
        var decrypted = secretbox.open(message, nonce, this.keyUint8Array);
        if (!decrypted) {
            throw new Error('Could not decrypt message!');
        }
        var base64DecryptedMessage = new TextDecoder().decode(decrypted);
        return JSON.parse(base64DecryptedMessage);
    };
    /**
     * Create a base64 hash string of the provided input.
     * @param input Any non-circulair value.
     */
    Encryption.prototype.hash = function (input) {
        var messageUint8Array = new TextEncoder().encode(JSON.stringify(input));
        var hashUint8Array = hash(messageUint8Array);
        var base64FullMessage = encodeBase64(hashUint8Array);
        var shortString = this._slice512HashString(base64FullMessage);
        return shortString;
    };
    return Encryption;
}());
export { Encryption };
//# sourceMappingURL=encryption.class.js.map