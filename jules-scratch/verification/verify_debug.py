from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Listen for console messages and print them
    page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

    print("Navigating to http://localhost:5173...")
    page.goto("http://localhost:5173")

    print("Waiting for 5 seconds...")
    page.wait_for_timeout(5000) # Give the app time to load and potentially fail

    print("Taking screenshot...")
    page.screenshot(path="jules-scratch/verification/debug_screenshot.png")

    print("Closing browser.")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
