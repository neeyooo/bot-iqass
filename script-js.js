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
function findMaxX(xpathTemplate) {
    let X = 1; // Mulai dengan X = 1
    let elements;
    
    while (true) {
        let xpath = xpathTemplate.replace("${X}", X);
        elements = getElementsByXPath(xpath);
        
        if (elements.length === 0) {
            break; // Hentikan jika tidak ada elemen yang ditemukan
        }
        
        X++; // Tambah nilai X
    }
    
    return X - 1; // Kembalikan nilai X terakhir yang valid
}

// Fungsi untuk mendapatkan jumlah pertanyaan dari elemen card-text berdasarkan XPath
async function getNumberFromXPath(xpath, parent) {
    let element = document.evaluate(xpath, parent || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
        let text = element.textContent.trim();
        let match = text.match(/\d+$/); // Ekstrak angka di akhir teks
        if (match) {
            return parseInt(match[0], 10); // Konversi ke integer
        }
    }
    return 0; // Kembalikan 0 jika tidak ditemukan
}

// Fungsi untuk mengklik elemen berdasarkan XPath
function clickElementByXPath(xpath) {
    return new Promise((resolve, reject) => {
        try {
            // Menemukan elemen berdasarkan XPath
            var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // Memeriksa apakah elemen ditemukan
            if (element) {
                // Fokuskan elemen jika diperlukan
                element.focus();
                // Tunggu sebentar agar fokus berlaku
                setTimeout(() => {
                    // Mengklik elemen
                    try {
                        element.click();
                        resolve();
                    } catch (error) {
                        console.log('Error clicking element: ' + error.message);
                        resolve(); // Tetap melanjutkan meskipun ada kesalahan
                    }
                }, 100);
            } else {
                resolve();
            }
        } catch (error) {
            if (error instanceof TypeError) {
                resolve();
            } else {
                reject(error);
            }
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

async function getNumberOfQuestions(xpathTemplate) {
    let X = 1;
    while (true) {
        let xpath = xpathTemplate.replace("${X}", X);
        let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!element) {
            break; // Hentikan jika tidak ada elemen yang ditemukan
        }
        X++;
    }
    return X - 2; // Kembalikan jumlah pertanyaan terakhir yang valid
}



// Fungsi utama yang menjalankan iterasi
async function main() {
    // Cari nilai X maksimal
    let maxXPathTemplate = '//*[@id="__show_instrumen"]/div[3]/div[${X}]/div/div';
    let maxX = findMaxX(maxXPathTemplate);
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
        await delay(100);

        // Mendapatkan teks dari elemen card-text
        var cardTextXPath = '//*[@id="__show_instrumen"]/div[3]/div[' + i + ']/div/div/p';
        var jumlahPertanyaan = await getNumberFromXPath(cardTextXPath);
        console.log('Akan menyelesaikan ' + jumlahPertanyaan + ' pertanyaan');

        for (var j = 1; j <= jumlahPertanyaan; j++) {
            // XPath untuk menemukan semua radio button di dalam elemen yang ditentukan
            var radioXPath = '//*[@id="post_survei"]/div[' + j + ']/div//input[@type="radio"]';

            // Mendapatkan ID dari semua elemen radio
            var radioIds = getRadioIdsByXPath(radioXPath);

            // Memilih salah satu ID secara acak
            var randomId = getRandomElement(radioIds);

            // Mengklik elemen dengan ID yang dipilih
            try {
                document.getElementById(randomId).click();
            } catch (error) {

            }
            await delay(20);
        }
        console.log("Selesai mengerjakan soal ke " + i);

        // Klik tombol submit
        await clickElementByXPath('//*[@id="submit" and @type="submit"]');
        await delay(50);
    }
    console.log("Selesai mengerjakan survei kepuasan");

    // Mengerjakan survei dosen
    maxXPathTemplate = '//*[@id="__show_instrumen"]/div[5]/div[${X}]/div/div';
    maxX = findMaxX(maxXPathTemplate);
    console.log(`Jumlah Soal: ${maxX}`);
    for (var i = 1; i <= maxX; i++) {
        if (i != 1) {
            console.log("\n");
        }
        // XPath yang bervariasi
        var xpath = '//*[@id="__show_instrumen"]/div[5]/div[' + i + ']/div/div/button';
        console.log("Mengerjakan Soal ke " + i);

        // Mengklik elemen utama
        await clickElementByXPath(xpath);
        await delay(200);

        // Mendapatkan teks dari elemen card-text
        var cardTextXPath = '//*[@id="post_survei"]/div[${X}]/div';
        var jumlahPertanyaan = await getNumberOfQuestions(cardTextXPath);
        console.log('Akan menyelesaikan ' + jumlahPertanyaan + ' pertanyaan');

        for (var j = 1; j <= jumlahPertanyaan; j++) {
            // XPath untuk menemukan semua radio button di dalam elemen yang ditentukan
            var radioXPath = '//*[@id="post_survei"]/div[' + j + ']/div//input[@type="radio"]';

            // Mendapatkan ID dari semua elemen radio
            var radioIds = getRadioIdsByXPath(radioXPath);

            // Memilih salah satu ID secara acak
            var randomId = getRandomElement(radioIds);

            // Mengklik elemen dengan ID yang dipilih
            try {
                document.getElementById(randomId).click();
            } catch (error) {

            }
            await delay(30);
        }
        console.log("Selesai mengerjakan soal ke " + i);

        // Klik tombol submit
        await clickElementByXPath('//*[@id="submit"]');
    }
    console.log("Selesai mengerjakan survei dosen");
}

// Menjalankan fungsi utama
main();
