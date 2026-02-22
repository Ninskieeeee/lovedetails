let publicKey;
let privateKey;

async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;

    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);

    document.getElementById("publicKey").value = arrayBufferToBase64(exportedPublicKey);
    document.getElementById("privateKey").value = arrayBufferToBase64(exportedPrivateKey);
}

async function encryptMessage() {
    const message = document.getElementById("rsaMessage").value;
    if (!publicKey || message === "") return;

    const encoded = new TextEncoder().encode(message);

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoded
    );

    document.getElementById("rsaOutput").value = arrayBufferToBase64(encrypted);
}

async function decryptMessage() {
    const encryptedText = document.getElementById("rsaOutput").value;
    if (!privateKey || encryptedText === "") return;

    const buffer = base64ToArrayBuffer(encryptedText);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        buffer
    );

    document.getElementById("rsaOutput").value = new TextDecoder().decode(decrypted);
}

function encipher() {
    const text = document.getElementById("cipherMessage").value;
    const shift = parseInt(document.getElementById("shift").value) || 0;
    document.getElementById("cipherOutput").value = caesar(text, shift);
}

function decipher() {
    const text = document.getElementById("cipherMessage").value;
    const shift = parseInt(document.getElementById("shift").value) || 0;
    document.getElementById("cipherOutput").value = caesar(text, -shift);
}

function caesar(text, shift) {
    return text.split("").map(char => {
        const code = char.charCodeAt(0);

        if (code >= 65 && code <= 90)
            return String.fromCharCode((code - 65 + shift + 26) % 26 + 65);

        if (code >= 97 && code <= 122)
            return String.fromCharCode((code - 97 + shift + 26) % 26 + 97);

        return char;
    }).join("");
}

async function generateHash() {
    const message = document.getElementById("hashMessage").value;
    if (message === "") return;

    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    document.getElementById("hashOutput").value = hashHex;
}

function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}