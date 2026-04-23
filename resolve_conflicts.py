import os
import subprocess
import re

files_theirs = [
    "src/app/(layout-empty)/login/page.tsx",
    "src/app/(layout-empty)/set-password/page.tsx",
    "src/app/(layout-empty)/signup/page.tsx",
    "src/app/(layout-empty)/verify-code/page.tsx",
    "src/app/(layout-hero)/boat-details/[id]/page.tsx",
    "src/app/(layout-hero)/contact/page.tsx",
    "src/app/(layout-hero)/my-bookings/[id]/page.tsx",
    "src/app/(layout-hero)/our-team/page.tsx",
    "src/app/(layout-hero)/profile/page.tsx",
    "src/components/Activities.tsx",
    "src/components/BoatCard.tsx",
    "src/components/BookingSidebar.tsx",
    "src/components/Footer.tsx",
    "src/components/WhyChoosingUs.tsx",
    "src/components/boatListing/BoatListingLayout.tsx",
    "src/components/payment/steps/stepTwoPersonalInfo/StepTwoPersonalInfo.tsx",
    "src/hooks/useDynamicHero.ts",
    "src/lib/api.ts",
    "src/lib/imageUtils.ts"
]

files_ours = [
    "public/images/founder 2.webp",
    "public/images/image 1.webp"
]

# Checkout theirs for text files
subprocess.run(["git", "checkout", "--theirs", "--"] + files_theirs)

# Checkout ours for images
subprocess.run(["git", "checkout", "--ours", "--"] + files_ours)

replacements = [
    (re.compile(r'\bmarakbi\b', re.IGNORECASE), lambda m: 'daffa' if m.group(0).islower() else ('DAFFA' if m.group(0).isupper() else 'Daffa')),
    (re.compile(r'\bmarkabi\b', re.IGNORECASE), lambda m: 'daffa' if m.group(0).islower() else ('DAFFA' if m.group(0).isupper() else 'Daffa')),
    (re.compile(r'مراكبي'), 'دفة'),
    (re.compile(r'مركبي'), 'دفة')
]

for file_path in files_theirs:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Text replacements
    for pattern, repl in replacements:
        content = pattern.sub(repl, content)
        
    # Specific file fixes
    if "api.ts" in file_path:
        # replace any BASE_URL to localhost
        content = re.sub(
            r'export const BASE_URL = \'https://[^\']+\';',
            r"// export const BASE_URL = 'https://daffa-e0870d98592a.herokuapp.com';\nexport const BASE_URL = 'https://marakbi-e0870d98592a.herokuapp.com/';",
            content
        )
    
    if "contact/page.tsx" in file_path:
        content = re.sub(
            r'"https://[^\"]+/contact/submit"',
            r"`${BASE_URL}/contact/submit`",
            content
        )
        if "BASE_URL" not in content[:500]:
            # try to insert import if missing (this is rough)
            content = content.replace("try {\n      // إرسال البيانات للـ API", "try {\n      // إرسال البيانات للـ API\n      const { BASE_URL } = await import('@/lib/api');")
            
    if "imageUtils.ts" in file_path:
        content = re.sub(
            r"baseUrl: string = 'https://[^\']+'",
            r"baseUrl: string = BASE_URL",
            content
        )
        content = re.sub(
            r"return url\.includes\('daffa-e0870d98592a\.herokuapp\.com'\) \|\| url\.startsWith\('/static/'\);",
            r"return url.includes('daffa-e0870d98592a.herokuapp.com') || url.includes('127.0.0.1:5000') || url.startsWith('/static/');",
            content
        )
        if "import { BASE_URL } from './api';" not in content:
            content = content.replace("// Helper functions for handling images from different sources", "// Helper functions for handling images from different sources\n\nimport { BASE_URL } from './api';")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

# Add all files to staging
subprocess.run(["git", "add", "."])
