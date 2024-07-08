// Fungsi untuk mendapatkan elemen berdasarkan XPath
function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < query.snapshotLength; i++) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

// Fungsi untuk mencari jumlah maksimal dari X
function findMaxX() {
    let X = 1; // Mulai dengan X = 1
    let elements;
    
    while (true) {
        let xpath = `//*[@id="__show_instrumen"]/div[3]/div[${X}]/div/div`;
        elements = getElementsByXPath(xpath);
        
        if (elements.length === 0) {
            break; // Hentikan jika tidak ada elemen yang ditemukan
        }
        
        X++; // Tambah nilai X
    }
    
    return X - 1; // Kembalikan nilai X terakhir yang valid
}

// Fungsi untuk mendapatkan jumlah pertanyaan dari elemen card-text berdasarkan XPath
function getNumberFromXPath(xpath, parent) {
    // Fungsi untuk mendapatkan elemen berdasarkan XPath
    function getElementByXPath(xpath, parent) {
        return document.evaluate(xpath, parent || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    
    let element = getElementByXPath(xpath, parent);
    if (element) {
        let text = element.textContent.trim();
        let match = text.match(/\d+$/); // Ekstrak angka di akhir teks
        if (match) {
            return parseInt(match[0], 10); // Konversi ke integer
        }
    }
    return null;
}

// Fungsi untuk mengklik elemen berdasarkan XPath
function clickElementByXPath(xpath) {
    return new Promise((resolve, reject) => {
        // Menemukan elemen berdasarkan XPath
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // Memeriksa apakah elemen ditemukan
        if (element) {
            // Mengklik elemen
            element.click();
            resolve();
        } else {
            console.log('Element not found: ' + xpath);
            resolve();
        }
    });
}

// Fungsi untuk menunda eksekusi
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk mendapatkan ID dari elemen berdasarkan XPath
function getRadioIdsByXPath(xpath) {
    // Menemukan semua elemen berdasarkan XPath
    var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    
    // Menyimpan ID dari semua elemen radio
    var ids = [];
    
    // Iterasi melalui hasil dan mengambil ID dari masing-masing elemen
    for (var i = 0; i < result.snapshotLength; i++) {
        var element = result.snapshotItem(i);
        ids.push(element.id);
    }
    
    return ids;
}

// Fungsi untuk memilih salah satu ID secara acak
function getRandomElement(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// Fungsi utama yang menjalankan iterasi
async function main() {
    // Cari nilai X maksimal
    let maxX = findMaxX();
    console.log(`Jumlah Soal: ${maxX}`);

    // Iterasi loop dari 1 hingga nilai X maksimal
    for (var i = 1; i <= maxX; i++) {
        if (i != 1) {
            console.log("\n");
        }
        // XPath yang bervariasi
        var xpath = '//*[@id="__show_instrumen"]/div[3]/div[' + i + ']/div/div/button';
        console.log("Mengerjakan Soal ke " + i);

        // Mengklik elemen utama
        await clickElementByXPath(xpath);
        await delay(200);

        // Mendapatkan teks dari elemen card-text
        var cardTextXPath = '//*[@id="__show_instrumen"]/div[3]/div[' + i + ']/div/div/p';
        var jumlahPertanyaan = getNumberFromXPath(cardTextXPath)
        console.log('Akan menyelesaikan '+jumlahPertanyaan+' pertanyaan');

        for (j = 1; j <= jumlahPertanyaan; j++){
            // XPath untuk menemukan semua radio button di dalam elemen yang ditentukan
            var radioXPath = '//*[@id="post_survei"]/div[' + j + ']/div//input[@type="radio"]';

            // Mendapatkan ID dari semua elemen radio
            var radioIds = getRadioIdsByXPath(radioXPath);

            // Memilih salah satu ID secara acak
            var randomId = getRandomElement(radioIds);

            // Mengklik elemen dengan ID yang dipilih
            document.getElementById(randomId).click();
            await delay(50)
        }
        console.log("Selesai mengerjakan soal ke " + i)
        await clickElementByXPath('//*[@id="submit"]');
        await delay(100)
    }
}

// Menjalankan fungsi utama
main();
