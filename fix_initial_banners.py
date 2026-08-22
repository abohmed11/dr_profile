import re

with open('src/types.ts', 'r') as f:
    content = f.read()

pattern = r"export const INITIAL_BANNERS: DoctorBanner\[\] = \[.*?\];"
replacement = "export const INITIAL_BANNERS: DoctorBanner[] = [];"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/types.ts', 'w') as f:
    f.write(content)
