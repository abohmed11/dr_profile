import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# We want to replace the whole fields 3, 4, 5, 6, 8 with a cleaner version.

pattern = r"(\{\/\* Field 2: Description \*\/\}.*?</div>)\s*\{\/\* Field 3: Color Theme & Icon \*\/\}.*?(?=\{\/\* Field 7: Target Audience \*\/\})"
replacement = r"""\1

              {/* Field 3: Icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">أيقونة الإشعار السريعة:</label>
                <select
                  value={bannerIcon}
                  onChange={(e) => setBannerIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                >
                  <option value="sparkles">✨ نجوم وتحديثات (Sparkles)</option>
                  <option value="crown">👑 باقة بريميوم (Crown)</option>
                  <option value="bell">🔔 تنبيه وإشعار (Bell)</option>
                  <option value="gift">🎁 عرض وهدية (Gift)</option>
                  <option value="alert">⚠️ تحذير مهم (Alert)</option>
                  <option value="star">⭐ تميز وتقييم (Star)</option>
                </select>
              </div>

              {/* Field 4: Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">نص الزر (اختياري):</label>
                  <input
                    type="text"
                    value={bannerButtonText}
                    onChange={(e) => setBannerButtonText(e.target.value)}
                    placeholder="مثال: استعراض التفاصيل"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">رابط الزر (رابط داخلي أو خارجي):</label>
                  <input
                    type="text"
                    value={bannerButtonUrl}
                    onChange={(e) => setBannerButtonUrl(e.target.value)}
                    placeholder="مثال: https://..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>
              </div>

              """

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

