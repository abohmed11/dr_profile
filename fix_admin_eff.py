import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Make sure imports are there
imp_fb_tgt = r"import \{([^}]+)\} from '\.\./lib/firebase';"
import_match = re.search(imp_fb_tgt, content)
if import_match:
    imports = import_match.group(1)
    if "subscribeContactMessages" not in imports:
        imports += ", subscribeContactMessages, deleteContactMessageFromDb, saveContactMessageInDb"
        content = content.replace(import_match.group(0), f"import {{{imports}}} from '../lib/firebase';")
else:
    # If not found, just add it below types
    content = content.replace("import { ContactMessage } from '../types';", "import { ContactMessage } from '../types';\nimport { subscribeContactMessages, deleteContactMessageFromDb, saveContactMessageInDb } from '../lib/firebase';")

# Add the effect
eff_tgt = r"const \[contactMessages, setContactMessages\] = useState\<ContactMessage\[\]\>\(\[\]\);"
eff_rep = r"""const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const unsubscribeMessages = subscribeContactMessages(setContactMessages);
    return () => {
      unsubscribeMessages();
    };
  }, []);"""

content = re.sub(eff_tgt, eff_rep, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
