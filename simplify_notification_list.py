import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

pattern = r"const colorClasses = \{[\s\S]*?className=\{`bg-white rounded-3xl border-2 p-6 shadow-sm hover:shadow-md transition-all space-y-4 text-right \$\{\n                          b.isActive \? colorClasses.split\(' '\)\[0\] : 'border-neutral-200 opacity-60'\n                        \}`\}"

replacement = r"""const badgeColorClasses = 'bg-amber-100 text-amber-800';
                    return (
                      <div 
                        key={b.id} 
                        className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all space-y-4 text-right ${
                          b.isActive ? 'border-neutral-200' : 'border-neutral-200 opacity-60'
                        }`}"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Let's also remove b.isPinned and b.priority from the display
pattern2 = r"\{b.isPinned && \([\s\S]*?\)\}\n\s*<span className=\{`px-2.5 py-0.5 text-\[10px\] font-black rounded-full \$\{\b\.isActive \? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-neutral-200 text-neutral-700'\}\`\}>\n\s*\{b.isActive \? '🟢 مفعل' : '⚪ غير مفعل'\}\n\s*</span>\n\s*<span className=\"px-2.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200 text-\[10px\] font-bold rounded-full\">\n\s*الأولوية: \#\{b.priority\}\n\s*</span>"

replacement2 = r"""<span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${b.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-neutral-200 text-neutral-700'}`}>
                                  {b.isActive ? '🟢 مفعل' : '⚪ غير مفعل'}
                                </span>"""

content = re.sub(pattern2, replacement2, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

