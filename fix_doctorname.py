import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = r"رسالة الواتساب الافتراضية \(استخدم \{doctorName\} لاسم الطبيب\)"
replacement = r"رسالة الواتساب الافتراضية (استخدم {'{doctorName}'} لاسم الطبيب)"

content = re.sub(target, replacement, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
