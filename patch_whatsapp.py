import re

# Patch types.ts
with open('src/types.ts', 'r') as f:
    content = f.read()
content = content.replace("contactAdminWhatsappNumber: '201000000000'", "contactAdminWhatsappNumber: '201111777251'")
with open('src/types.ts', 'w') as f:
    f.write(content)

# Patch AdminPanel.tsx
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()
content = content.replace("contactAdminWhatsappNumber || '201000000000'", "contactAdminWhatsappNumber || '201111777251'")
with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

# Patch Dashboard.tsx
with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()
content = content.replace("contactAdminWhatsappNumber || '201000000000'", "contactAdminWhatsappNumber || '201111777251'")
with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

