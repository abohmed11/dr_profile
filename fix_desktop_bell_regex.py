import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

pattern = r"(<h3 className=\"font-extrabold text-sm text-neutral-900 truncate\">\{formData\.name \|\| 'دكتور بروفايل'\}</h3>\s*<span className=\"text-\[9px\] text-\[#10244A\] font-extrabold uppercase mt-0\.5\">\s*\{loggedSecretary \? `سكرتارية: \$\{loggedSecretary\.name\}` : \(formData\.jobTitle \|\| 'لوحة تحكم الطبيب'\)\}\s*</span>\s*</div>\s*</div>\s*)\s*</div>"

replacement = r"""\1
            {/* Desktop Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-neutral-200 shrink-0"
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5 text-neutral-800" strokeWidth={2.5} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>"""

content = re.sub(pattern, replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
