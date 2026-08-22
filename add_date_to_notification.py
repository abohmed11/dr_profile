import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = r'<h4 className="font-extrabold text-xs text-neutral-900 leading-tight">{banner.title}</h4>'

replacement = r"""<div className="flex justify-between items-start gap-2">
                            <h4 className="font-extrabold text-xs text-neutral-900 leading-tight">{banner.title}</h4>
                            {(banner.sentDate || banner.createdAt) && (
                              <span className="text-[9px] text-neutral-400 font-bold whitespace-nowrap shrink-0 mt-0.5">
                                {new Date(banner.sentDate || banner.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>"""

content = content.replace(target, replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

