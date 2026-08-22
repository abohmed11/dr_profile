import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

pattern = r"""export let isFirestoreQuotaExceeded = checkInitialQuotaStatus\(\);"""

replacement = """export let isFirestoreQuotaExceeded = checkInitialQuotaStatus();

if (isFirestoreQuotaExceeded && db) {
  disableNetwork(db).catch(() => {});
}"""

content = re.sub(pattern, replacement, content)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)

