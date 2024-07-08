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
    // Iterasi loop dari 1 hingga 8
    for (var i = 1; i <= 8; i++) {
        if (i != 1) {
            console.log("\n");
        }
        // XPath yang bervariasi
        var xpath = '//*[@id="__show_instrumen"]/div[3]/div[' + i + ']/div/div/button';
        console.log("Mengerjakan Soal ke " + i);

        // Mengklik elemen utama
        await clickElementByXPath(xpath);
        await delay(200);
        for (j = 1; j <= 5; j++){
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
        if (i == 8){
            // XPath untuk menemukan semua radio button di dalam elemen yang ditentukan
            var radioXPath = '//*[@id="post_survei"]/div[6]/div//input[@type="radio"]';

            // Mendapatkan ID dari semua elemen radio
            var radioIds = getRadioIdsByXPath(radioXPath);

            // Memilih salah satu ID secara acak
            var randomId = getRandomElement(radioIds);

            // Mengklik elemen dengan ID yang dipilih
            document.getElementById(randomId).click();
            await delay(50)
        }
        clickElementByXPath('//*[@id="submit"]');
        await delay(100)
    }
}

// Menjalankan fungsi utama
main();
