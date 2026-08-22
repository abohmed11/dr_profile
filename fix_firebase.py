import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

# Add disableNetwork to imports
content = content.replace("  deleteDoc", "  deleteDoc,\n  disableNetwork")

# Call disableNetwork when setFirestoreQuotaExceeded is called with true
pattern = r"""export function setFirestoreQuotaExceeded\(exceeded: boolean\) \{
  isFirestoreQuotaExceeded = exceeded;
  try \{"""

replacement = """export function setFirestoreQuotaExceeded(exceeded: boolean) {
  isFirestoreQuotaExceeded = exceeded;
  
  if (exceeded && db) {
    disableNetwork(db).catch(() => {});
  }
  
  try {"""

content = re.sub(pattern, replacement, content)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)

