// Fungsi untuk menunggu elemen dengan XPath sampai tersedia
function waitForElementByXPath(xpath, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                setTimeout(() => {
                    resolve(element);
                }, 3); // Menunggu 5 ms setelah elemen ditemukan
            } else if (Date.now() - startTime >= timeout) {
                reject(new Error(`Element with XPath ${xpath} not found within ${timeout} ms`));
            } else {
                requestAnimationFrame(check);
            }
        }

        check();
    });
}
// Fungsi untuk menunggu elemen dengan ID sampai tersedia
function waitForElementById(id, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    resolve(element);
                }, 3); // Menunggu 5 ms setelah elemen ditemukan
            } else if (Date.now() - startTime >= timeout) {
                reject(new Error(`Element with ID ${id} not found within ${timeout} ms`));
            } else {
                requestAnimationFrame(check);
            }
        }

        check();
    });
}
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
    var xpath_submit = '//*[@id="submit"]'
    // Cari nilai X maksimal
    console.log("Mengerjakan survei kepuasan...");
    waitForElementByXPath('//*[@id="__show_instrumen"]/div[3]/div[1]/div/div');
    let maxXPathTemplate = '//*[@id="__show_instrumen"]/div[3]/div[${X}]/div/div';
    let maxX = findMaxX(maxXPathTemplate);
    console.log(`Jumlah Soal: ${maxX}`);

    // Iterasi loop dari 1 hingga nilai X maksimal
    for (var i = 1; i <= maxX; i++) {
        // XPath yang bervariasi
        var xpath = '//*[@id="__show_instrumen"]/div[3]/div[' + i + ']/div/div/button';
        var xpath_ifelse = getElementsByXPath(xpath);
        var buttonElement = xpath_ifelse.length > 0 ? xpath_ifelse[0] : null;

        if(buttonElement && buttonElement.textContent === 'Selesai'){
            console.log('Survei sudah selesai sebelumnya.')
        }else{
            if (i != 1) {
                console.log("\n");
            }
            console.log("Mengerjakan Soal ke " + i);

            // Mengklik elemen utama
            await waitForElementByXPath(xpath);
            await clickElementByXPath(xpath);
    
            // Mendapatkan teks dari elemen card-text
            var cardTextXPath = '//*[@id="__show_instrumen"]/div[3]/div[' + i + ']/div/div/p';
            await waitForElementByXPath(cardTextXPath);
            var jumlahPertanyaan = await getNumberFromXPath(cardTextXPath);
            console.log('Akan menyelesaikan ' + jumlahPertanyaan + ' pertanyaan');
    
            for (var j = 1; j <= jumlahPertanyaan; j++) {
                // XPath untuk menemukan semua radio button di dalam elemen yang ditentukan
                var radioXPath = '//*[@id="post_survei"]/div[' + j + ']/div//input[@type="radio"]';
    
                // Mendapatkan ID dari semua elemen radio
               await waitForElementByXPath(radioXPath);
                var radioIds = getRadioIdsByXPath(radioXPath);
    
                // Memilih salah satu ID secara acak
                var randomId = getRandomElement(radioIds);
    
                // Mengklik elemen dengan ID yang dipilih
                try {
                    await waitForElementById(randomId);
                    document.getElementById(randomId).click();
                } catch (error) {
    
                }
                await delay(20);
            }
            console.log("Selesai mengerjakan soal ke " + i);
    
            // Klik tombol submit
            await waitForElementByXPath(xpath_submit);
            await clickElementByXPath(xpath_submit);
    
        }
        
    }
    console.log("Selesai mengerjakan survei kepuasan");
    console.log("");
    console.log("");
    await delay(100);

    // Mengerjakan survei dosen
    console.log("Mengerjakan survei dosen")
    maxXPathTemplate = '//*[@id="__show_instrumen"]/div[5]/div[${X}]/div/div';
    await waitForElementByXPath('//*[@id="__show_instrumen"]/div[5]/div[1]/div/div');
    maxX = findMaxX(maxXPathTemplate);
    console.log(`Jumlah Soal: ${maxX}`);
    for (var i = 1; i <= maxX; i++) {

        // XPath yang bervariasi
        var xpath = '//*[@id="__show_instrumen"]/div[5]/div[' + i + ']/div/div/button';
        var xpath_ifelse = getElementsByXPath(xpath);
        var buttonElement = xpath_ifelse.length > 0 ? xpath_ifelse[0] : null;
        if(buttonElement && buttonElement.textContent === 'Selesai'){
            console.log('Survei sudah selesai sebelumnya.');
        }else{
            if (i != 1) {
                console.log("\n");
            }
            console.log("Mengerjakan Soal ke " + i);

            // Mengklik elemen utama
            await waitForElementByXPath('//*[@id="__show_instrumen"]/div[5]/div[1]/div/div/button');
            await clickElementByXPath(xpath);
            await delay(10)
    
            // Mendapatkan teks dari elemen card-text
            var cardTextXPath = '//*[@id="post_survei"]/div[${X}]/div';
            await waitForElementByXPath('//*[@id="post_survei"]/div[20]/div');
            var jumlahPertanyaan = await getNumberOfQuestions(cardTextXPath);
            console.log('Akan menyelesaikan ' + jumlahPertanyaan + ' pertanyaan');
            var element = document.getElementById(randomId);
            for (var k = 0; k < 2; k++) {
                for (var j = 1; j <= jumlahPertanyaan; j++) {
                    // XPath untuk menemukan semua radio button di dalam elemen yang ditentukan
                    var radioXPath = '//*[@id="post_survei"]/div[' + j + ']/div//input[@type="radio"]';
            
                    // Mendapatkan ID dari semua elemen radio
                    await waitForElementByXPath('//*[@id="post_survei"]/div[' + j + ']/div//input[@type="radio"]');
                    var radioIds = getRadioIdsByXPath(radioXPath);
            
                    // Memilih salah satu ID secara acak
                    var randomId = getRandomElement(radioIds);
                    element = document.getElementById(randomId);
                    if (!element.checked) {
                        await waitForElementById(randomId);
                        document.getElementById(randomId).click();
                    }
                }
            }
            
            console.log("Selesai mengerjakan soal ke " + i);
    
            // Klik tombol submit
            await waitForElementByXPath(xpath_submit);
            await clickElementByXPath(xpath_submit);
            }
        }
        console.log("Selesai mengerjakan survei dosen");
}

// Menjalankan fungsi utama
main();
