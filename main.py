#selenium, webdriver-manager
import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

option = webdriver.ChromeOptions()
option.add_argument("--disable-gpu")
option.add_argument("--headless=new")
option.add_argument("--log-level=3")
option.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=option)
NIM = input("Masukkan Email/NIM: ")
PIC = input("Masukkan Password/PIC: ")
wait = WebDriverWait(driver, 20)
waktuTungguCekLogin = 5
looping = True

def loopMengisiRandom(panjang):
    pilihanRandom = random.randint(1,4)
    for x in range(1,panjang+1):
        indexRadio = int(driver.find_element(By.XPATH, f'//*[@id="post_survei"]/div[{x}]/div/div[2]/input').get_attribute('name'))
        driver.find_element(By.XPATH, f'//*[@id="input_radio_{indexRadio}_{pilihanRandom}"]').click()
        time.sleep(0.1)

url = 'http://iqass.umm.ac.id/'
while looping:
    driver.get(url)
    #LOGIN
    wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="email"]'))).send_keys(NIM)
    time.sleep(0.1)
    wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="password"]'))).send_keys(PIC)
    time.sleep(0.1)
    driver.find_element(By.XPATH, "/html/body/div/div/div[2]/form/button").click()
    time.sleep(0.1)
    try:
        WebDriverWait(driver, waktuTungguCekLogin).until(EC.visibility_of_element_located((By.XPATH, '//*[@id="__show_instrumen"]/div[3]/div[1]/div/div')))
    except:
        try:
            driver.find_element(By.XPATH, '/html/body/div/div/div[2]/div[2]/div')
        except NoSuchElementException:
            print("Internet lambat?")
            waktuTungguCekLogin += 5
            if(waktuTungguCekLogin == 20):
                print("Menunggu terlalu lama.")
                exit()
        else:
            print("Email atau Password salah. Silahkan masukkan Email dan Password lagi dengan benar.")
            NIM = input("Masukkan Email/NIM: ")
            PIC = input("Masukkan Password/PIC: ")
    else:
        looping = False


for x in range (1,9):
    wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="__show_instrumen"]/div[3]/div[1]/div/div')))
    try:
        time.sleep(0.1)
        driver.find_element(By.XPATH, f'//*[@id="__show_instrumen"]/div[3]/div[{x}]/div/div/button').click()
    except NoSuchElementException:
        print(f"Survei ke {x} sudah di isi. Melanjutkan survei yang lain.")
    else:
        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="post_survei"]/div[1]/div')))
        panjangFormIsi = len((driver.find_element(By.XPATH, '//*[@id="post_survei"]')).find_elements(By.CLASS_NAME, 'form-group.row'))
        loopMengisiRandom(panjangFormIsi)
        driver.find_element(By.XPATH, '//*[@id="submit"]').click()
        print(f"Survei ke {x} sudah di isi. Melanjutkan survei yang lain.")
        time.sleep(0.1)

print("\nBerhasil melakukan semua survei. Silahkan untuk cek hasil di https://iqass.umm.ac.id/ :D")