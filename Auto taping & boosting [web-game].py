from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup the Edge WebDriver
service = Service(executable_path="msedgedriver.exe")
driver = webdriver.Edge(service=service)

# Navigate to the Cookie Clicker game
driver.get("https://orteil.dashnet.org/cookieclicker/")

# Constants
cookie_id = "bigCookie"
cookies_id = "cookies"
product_price_prefix = "productPrice"
product_prefix = "product"

# Wait for and select the English language
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'English')]"))
)
language = driver.find_element(By.XPATH, "//*[contains(text(), 'English')]")
language.click()

# Wait for the cookie to load
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, cookie_id))
)
cookie = driver.find_element(By.ID, cookie_id)

# Infinite loop to automate clicking
try:
    while True:
        cookie.click()
        time.sleep(0.1)  # Prevent excessive CPU usage
        
        # Fetch the cookies count
        cookies_text = driver.find_element(By.ID, cookies_id).text.split(" ")[0]
        cookies_count = int(cookies_text.replace(",", ""))
        
        # Attempt to purchase upgrades
        for i in range(4):  # Assuming you are checking the first 4 products
            try:
                product_price_element = driver.find_element(By.ID, f"{product_price_prefix}{i}")
                product_price_text = product_price_element.text.replace(",", "")
                
                if not product_price_text.isdigit():
                    continue
                
                product_price = int(product_price_text)
                
                if cookies_count >= product_price:
                    product = driver.find_element(By.ID, f"{product_prefix}{i}")
                    product.click()
                    break
            except Exception as e:
                # Handle cases where elements are not found or not interactable
                print(f"Error processing product {i}: {e}")
                continue
except KeyboardInterrupt:
    print("Automation stopped by user.")
finally:
    driver.quit()




#WebDriverWait(driver, 5).until(
#    EC.presence_of_element_located((By.CLASS_NAME, "gLFyf"))
#)

#input_element = driver.find_element(By.CLASS_NAME, "gLFyf")
#input_element.clear()
#input_element.send_keys(
#    "Python" + Keys.ENTER
#)

#WebDriverWait(driver, 5).until(
#    EC.presence_of_element_located((By.PARTIAL_LINK_TEXT, "Python"))
#)

#link = driver.find_element(By.PARTIAL_LINK_TEXT, "Python")
#link.click()

#time.sleep(10)

#driver.quit()