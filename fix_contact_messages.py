import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = r"const \[localLanding, setLocalLanding\] = useState\<LandingPageConfig\>\(\(\) => \{"
replacement = r"""const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [localLanding, setLocalLanding] = useState<LandingPageConfig>(() => {"""

content = re.sub(target, replacement, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
