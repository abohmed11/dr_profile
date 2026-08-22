import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# I need to match everything from {/* DOCTOR DASHBOARD TOP BANNERS */} down to the end of the IIFE
pattern = r"\{\/\* DOCTOR DASHBOARD TOP BANNERS \*\/\}\n\s*\{\(\(\) => \{[\s\S]*?\}\)\(\)\}"

content = re.sub(pattern, "", content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

