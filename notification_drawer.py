import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Remove the DOCTOR DASHBOARD TOP BANNERS section
pattern_top_banners = r"\{\/\* DOCTOR DASHBOARD TOP BANNERS \*\/\}.*?(?=\{\/\* Main Content Area \*\/\})"
content = re.sub(pattern_top_banners, "", content, flags=re.DOTALL)

# Let's insert the Notification Drawer Modal at the end of the Dashboard component
notification_drawer_code = """
      {/* Notifications Drawer/Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNotificationsOpen(false)}
          />
          <div className="relative w-full sm:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#10244A]/10 flex items-center justify-center text-[#10244A]">
                  <Bell className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900">مركز الإشعارات</h3>
                  <p className="text-[10px] text-neutral-500 font-bold mt-0.5">آخر التحديثات والإعلانات الهامة</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {activeBanners.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-neutral-400">
                  <Bell className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-bold">لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                activeBanners.map(banner => {
                  const isUnread = !dismissedBannerIds.includes(banner.id);
                  const icon = banner.icon === 'crown' ? '👑' : banner.icon === 'gift' ? '🎁' : banner.icon === 'bell' ? '🔔' : banner.icon === 'alert' ? '⚠️' : banner.icon === 'star' ? '⭐' : '✨';
                  
                  return (
                    <div 
                      key={banner.id}
                      className={`relative p-4 rounded-2xl border transition-all text-right ${isUnread ? 'bg-[#10244A]/5 border-[#10244A]/20 shadow-sm' : 'bg-neutral-50 border-neutral-100 opacity-70'}`}
                    >
                      {isUnread && (
                        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span>{icon}</span>
                          )}
                        </div>
                        <div className="space-y-1 pr-1 flex-1">
                          <h4 className="font-extrabold text-xs text-neutral-900 leading-tight">{banner.title}</h4>
                          {banner.description && (
                            <p className="text-[10px] sm:text-xs text-neutral-600 font-semibold leading-relaxed mt-1">
                              {banner.description}
                            </p>
                          )}
                          {banner.buttonText && banner.buttonUrl && (
                            <div className="mt-3 inline-block">
                              <a
                                href={banner.buttonUrl.startsWith('#') ? undefined : banner.buttonUrl}
                                target={banner.buttonUrl.startsWith('http') ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  if (banner.buttonUrl?.startsWith('#')) {
                                    e.preventDefault();
                                    const tab = banner.buttonUrl.substring(1) as any;
                                    setActiveTab(tab);
                                    setIsNotificationsOpen(false);
                                  }
                                }}
                                className="inline-block px-4 py-2 bg-[#10244A] text-white text-[10px] font-extrabold rounded-xl hover:bg-[#0B2545] transition-colors"
                              >
                                {banner.buttonText}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => {
                            const newDismissed = [...dismissedBannerIds, banner.id];
                            setDismissedBannerIds(newDismissed);
                            try {
                              localStorage.setItem('dismissed_banners', JSON.stringify(newDismissed));
                            } catch (e) {}
                          }}
                          className="mt-3 w-full py-1.5 text-center text-[10px] font-bold text-neutral-500 hover:text-neutral-900 border-t border-neutral-200 transition-colors cursor-pointer"
                        >
                          تحديد كمقروء
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
"""

# Let's insert it before the last </div> in the file.
content = content.replace("    </div>\n  );\n}\n", notification_drawer_code + "\n    </div>\n  );\n}\n")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
