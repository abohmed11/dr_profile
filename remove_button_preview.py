import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = r"""                              \{\(b\.buttonText\) && \(
                                <div className="flex flex-wrap gap-3 text-\[11px\] text-neutral-500 font-bold pt-2 border-t border-neutral-100">
                                  \{b\.buttonText && <span>🔘 الزر: "\{b\.buttonText\}" \(\{b\.buttonUrl \|\| 'بدون رابط'\}\)</span>\}
                                  \{b\.buttonText && <span>🔘 الزر: "\{b\.buttonText\}" \(\{b\.buttonUrl \|\| 'بدون رابط'\}\)</span>\}
                                </div>
                              \)\}"""

content = re.sub(target, "", content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

