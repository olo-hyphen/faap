from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173")
    page.wait_for_selector('input[placeholder="Opis zlecenia"]')
    page.screenshot(path="jules-scratch/verification/verification-before.png")
    page.get_by_placeholder("Opis zlecenia").fill("Testowe zlecenie")
    page.get_by_role("button", name="Dodaj Zlecenie").click()
    page.screenshot(path="jules-scratch/verification/verification-after.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
