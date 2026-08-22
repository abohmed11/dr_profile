import re

with open('src/components/ContactWhatsApp.tsx', 'r') as f:
    content = f.read()

import_target = r"import \{ getEffectiveSocialLinks, SocialIcon \} from '\./SocialLinks';"
import_replacement = r"""import { getEffectiveSocialLinks, SocialIcon } from './SocialLinks';
import { saveContactMessageInDb } from '../lib/firebase';"""

content = content.replace(import_target, import_replacement)

# inside handleDirectFormSubmit
submit_target = r"""    try \{
      const saved = localStorage\.getItem\('dr_admin_contact_messages'\);
      const messages = saved \? JSON\.parse\(saved\) : \[\];
      messages\.unshift\(newMsg\);
      localStorage\.setItem\('dr_admin_contact_messages', JSON\.stringify\(messages\)\);
    \} catch \(err\) \{
      console\.error\('Failed to save message', err\);
    \}"""

submit_replacement = """    try {
      const saved = localStorage.getItem('dr_admin_contact_messages');
      const messages = saved ? JSON.parse(saved) : [];
      messages.unshift(newMsg);
      localStorage.setItem('dr_admin_contact_messages', JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save message to local', err);
    }
    
    // Save to Firebase
    saveContactMessageInDb(newMsg).catch(err => console.error('Failed to save message to Firebase', err));"""

content = re.sub(submit_target, submit_replacement, content)

with open('src/components/ContactWhatsApp.tsx', 'w') as f:
    f.write(content)
