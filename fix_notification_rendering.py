import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# I want to replace the whole block from '{b.isPinned && (' to '</span>\n                                )}'

pattern_remove = r"\{b\.isPinned && \([\s\S]*?الأولوية: \#\{b\.priority\}\n\s*</span>"
content = re.sub(pattern_remove, "", content)

# I also want to remove startDate and endDate from the bottom of the card
pattern_dates = r"\{\(b\.startDate \|\| b\.endDate \|\| b\.buttonText\) && \(\n\s*<div className=\"flex flex-wrap gap-3 text-\[11px\] text-neutral-500 font-bold pt-2 border-t border-neutral-100\">\n\s*\{b\.startDate && <span>📅 يبدأ: \{b\.startDate\}</span>\}\n\s*\{b\.endDate && <span>⏳ ينتهي: \{b\.endDate\}</span>\}"

replacement_dates = r"""{(b.buttonText) && (
                                <div className="flex flex-wrap gap-3 text-[11px] text-neutral-500 font-bold pt-2 border-t border-neutral-100">
                                  {b.buttonText && <span>🔘 الزر: "{b.buttonText}" ({b.buttonUrl || 'بدون رابط'})</span>}"""

content = re.sub(pattern_dates, replacement_dates, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

