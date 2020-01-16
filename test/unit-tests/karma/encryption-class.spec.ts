import tweetnacl from 'tweetnacl';
import { Encryption } from '../../../src/encryption.class';

describe('Encryption class', () => {
    it('should throw when document failes to decrypt', () => {
        spyOn(tweetnacl.secretbox, 'open').and.callFake(() => null);
        const encryption = new Encryption();
        const messageEncrypted = encryption.encrypt('sdhfuisdfsdf');
        expect(() => encryption.decrypt(messageEncrypted))
            .toThrowError('Could not decrypt message!');
    });
});
