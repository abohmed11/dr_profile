import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

target = """              {/* Field 8: Options (Active, Pinned, Priority) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>🟢 البنر مفعل حالياً</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerIsPinned}
                    onChange={(e) => setBannerIsPinned(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>📌 تثبيت في أعلى القائمة</span>
                </label>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">رقم الأولوية (Priority):</label>
                  <input
                    type="number"
                    min={1}
                    value={bannerPriority}
                    onChange={(e) => setBannerPriority(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-center"
                  />
                </div>
              </div>"""

replacement = """              {/* Field 8: Options */}
              <div className="pt-2">
                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer w-full sm:w-fit">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>🟢 الإشعار مفعل ومتاح للإرسال</span>
                </label>
              </div>"""

content = content.replace(target, replacement)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

