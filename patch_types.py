import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = r"  login\?:"
replacement = r"""  dashboardSettings?: {
    contactAdminButtonText?: string;
    contactAdminWhatsappNumber?: string;
    contactAdminMessage?: string;
  };
  login?:"""

content = re.sub(target, replacement, content)

with open('src/types.ts', 'w') as f:
    f.write(content)
