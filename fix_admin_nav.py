import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = r"""            \<button 
              onClick=\{\(\) => setActiveTab\('settings'\)\}
              className=\{`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer \$\{"""

replacement = r"""            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'messages' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Mail className={`w-4 h-4 flex-shrink-0 ${activeTab === 'messages' ? 'text-white' : 'text-[#10244A]'}`} />
                <span>رسائل الزوار</span>
              </div>
              {contactMessages.filter(m => !m.read).length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'messages' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                  {contactMessages.filter(m => !m.read).length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${"""

content = re.sub(target, replacement, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
