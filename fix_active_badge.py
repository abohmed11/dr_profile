import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = r"""<span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-full">
                                  🎯 المستهدفون: {"""

replacement = r"""<span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${b.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-neutral-200 text-neutral-700'}`}>
                                  {b.isActive ? '🟢 مفعل' : '⚪ مسودة'}
                                </span>
                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-full">
                                  🎯 المستهدفون: {"""

content = content.replace(target, replacement)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
