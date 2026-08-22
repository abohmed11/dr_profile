import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add messages to type
type_target = r"const \[activeTab, setActiveTab\] = useState\<'landing-settings' \| 'seo-settings' \| 'db-status' \| 'subscriptions' \| 'doctors' \| 'banners' \| 'settings'\>"
type_replacement = "const [activeTab, setActiveTab] = useState<'landing-settings' | 'seo-settings' | 'db-status' | 'subscriptions' | 'doctors' | 'banners' | 'settings' | 'messages'>"
content = re.sub(type_target, type_replacement, content)

# Import Mail icon if not already there
import_target = r"import \{([^}]+)\} from 'lucide-react';"
import_replacement = r"import {\1, Mail} from 'lucide-react';"
if 'Mail,' not in content and 'Mail ' not in content:
    content = re.sub(import_target, import_replacement, content, 1)

# Import ContactMessage
if "ContactMessage" not in content:
    imp_t = r"import \{([^}]+)\} from '\.\./types';"
    imp_r = r"import {\1, ContactMessage} from '../types';"
    content = re.sub(imp_t, imp_r, content, 1)

# Import subscribeContactMessages, deleteContactMessageFromDb, saveContactMessageInDb
if "subscribeContactMessages" not in content:
    imp_t = r"import \{([^}]+)\} from '\.\./lib/firebase';"
    imp_r = r"import {\1, subscribeContactMessages, deleteContactMessageFromDb, saveContactMessageInDb} from '../lib/firebase';"
    content = re.sub(imp_t, imp_r, content, 1)

# Add state for messages
state_target = r"const \[localLanding, setLocalLanding\] = useState\<LandingPageConfig\>\(landingConfig\);"
state_replacement = r"""const [localLanding, setLocalLanding] = useState<LandingPageConfig>(landingConfig);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);"""
content = re.sub(state_target, state_replacement, content)

# Add effect for messages
eff_target = r"const unsubscribeSpecialties = subscribeSpecialties\(setSpecialties\);"
eff_replacement = r"""const unsubscribeSpecialties = subscribeSpecialties(setSpecialties);
    const unsubscribeMessages = subscribeContactMessages(setContactMessages);"""
content = re.sub(eff_target, eff_replacement, content)

clean_eff_target = r"unsubscribeSpecialties\(\);"
clean_eff_replacement = r"""unsubscribeSpecialties();
      unsubscribeMessages();"""
content = re.sub(clean_eff_target, clean_eff_replacement, content)

# Add button
nav_target = r"""            \<button
              onClick=\{[^\}]+\}
              className=\{`flex items-center gap-3 w-full p-3 md:p-3\.5 text-right rounded-xl md:rounded-2xl transition-all \$\{
                activeTab === 'settings'"""
nav_replacement = r"""            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3 w-full p-3 md:p-3.5 text-right rounded-xl md:rounded-2xl transition-all ${
                activeTab === 'messages' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <Mail className={`w-4 h-4 flex-shrink-0 ${activeTab === 'messages' ? 'text-white' : 'text-[#10244A]'}`} />
              <div className="flex items-center justify-between w-full">
                <span>رسائل التواصل</span>
                {contactMessages.filter(m => !m.read).length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'messages' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {contactMessages.filter(m => !m.read).length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 w-full p-3 md:p-3.5 text-right rounded-xl md:rounded-2xl transition-all ${
                activeTab === 'settings'"""
content = re.sub(nav_target, nav_replacement, content)

# Add section
section_target = r"""        \{activeTab === 'settings' && \("""
section_replacement = r"""        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-sm">
              <h2 className="text-xl font-black text-[#10244A] flex items-center gap-3">
                <Mail className="w-6 h-6" />
                <span>رسائل تواصل الزوار</span>
              </h2>
              <div className="px-4 py-2 bg-neutral-100 rounded-xl text-sm font-bold text-neutral-700">
                إجمالي الرسائل: {contactMessages.length}
              </div>
            </div>

            <div className="space-y-4">
              {contactMessages.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-neutral-200/60 shadow-sm text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">لا توجد رسائل</h3>
                  <p className="text-neutral-500 font-medium">لم يقم أحد بالتواصل معك بعد عبر نموذج التواصل.</p>
                </div>
              ) : (
                contactMessages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-3xl border ${msg.read ? 'border-neutral-200/60' : 'border-[#003B7A] ring-1 ring-[#003B7A]/20'} p-6 md:p-8 shadow-sm transition-all`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-4 mb-4 text-right">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 justify-end flex-row-reverse">
                          <h3 className="text-lg font-black text-neutral-900">{msg.name}</h3>
                          {!msg.read && <span className="bg-[#003B7A] text-white text-[10px] font-bold px-2 py-1 rounded-md">جديدة</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-600 font-semibold justify-end flex-row-reverse">
                          <span dir="ltr">{msg.phone}</span>
                          <span>•</span>
                          <span dir="ltr">{msg.email}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-400 text-right shrink-0">
                        {new Date(msg.createdAt).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-2xl text-right">
                      <p className="text-neutral-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    <div className="flex items-center gap-3 mt-6 justify-end">
                      <button
                        onClick={async () => {
                          if(confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                            await deleteContactMessageFromDb(msg.id);
                          }
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl transition-all"
                      >
                        حذف الرسالة
                      </button>
                      {!msg.read && (
                        <button
                          onClick={async () => {
                            await saveContactMessageInDb({ ...msg, read: true });
                          }}
                          className="px-6 py-2 bg-[#10244A] text-white hover:bg-[#10244A]/90 font-bold text-xs rounded-xl transition-all"
                        >
                          تحديد كمقروءة
                        </button>
                      )}
                      {msg.read && (
                        <button
                          onClick={async () => {
                            await saveContactMessageInDb({ ...msg, read: false });
                          }}
                          className="px-4 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all"
                        >
                          تحديد كغير مقروءة
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && ("""
content = re.sub(section_target, section_replacement, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

